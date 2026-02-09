#!/usr/bin/env node
/**
 * Discover US jurisdiction logos from official .gov websites using CISA dotgov-data.
 *
 * 1. Fetches current-full.csv from cisagov/dotgov-data (Domain type, City, State, Organization, Domain name).
 * 2. Builds lookups: (State, City) for City type and (State, County name) for County type.
 * 3. For each FIPS county/place with a matching .gov domain, tries to find a logo URL:
 *    - Tries common paths: /logo.png, /logo.svg, /images/logo.png, etc.
 *    - Falls back to parsing homepage for og:image or <img> with logo/seal in attributes.
 * 4. Merges found logos into jurisdiction-logos.json (does not overwrite existing entries).
 *
 * Usage: node scripts/discover-logos-from-dotgov.mjs [--counties-only] [--places-only] [--dry-run] [--limit N]
 */

import { createWriteStream } from 'fs';
import { readFileSync, mkdirSync } from 'fs';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const API_ROOT = join(ROOT, '..', 'mes-adresses-api');
const FIPS_PATH = join(API_ROOT, 'us-fips-data.json');
const OUT_PATH = join(ROOT, 'public', 'static', 'data', 'jurisdiction-logos.json');
const DOTGOV_CSV_URL =
  'https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-full.csv';

const args = process.argv.slice(2);
const countiesOnly = args.includes('--counties-only');
const placesOnly = args.includes('--places-only');
const dryRun = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 && args[limitIdx + 1] ? parseInt(args[limitIdx + 1], 10) : 0;

const DELAY_MS = 150;
const REQUEST_TIMEOUT_MS = 10000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Parse one CSV line handling quoted fields (e.g. "Town of Acton, Massachusetts") */
function parseCSVLine(line) {
  const out = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let end = line.indexOf('"', i + 1);
      while (end !== -1 && line[end + 1] === '"') end = line.indexOf('"', end + 2);
      out.push(line.slice(i + 1, end === -1 ? undefined : end).replace(/""/g, '"'));
      i = end === -1 ? line.length : end + 1;
      if (i < line.length && line[i] === ',') i++;
    } else {
      const comma = line.indexOf(',', i);
      const value = comma === -1 ? line.slice(i) : line.slice(i, comma);
      out.push(value.trim());
      i = comma === -1 ? line.length : comma + 1;
    }
  }
  return out;
}

/** Normalize for matching: lowercase, collapse spaces, strip trailing " County" / "City" etc. */
function normalizeCountyName(name) {
  return name
    .replace(/\s+County\s*$/i, '')
    .replace(/^County\s+of\s+/i, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function normalizeCityName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/** Build (stateAbbr, normalizedName) key */
function countyKey(stateAbbr, countyName) {
  return `${(stateAbbr || '').toUpperCase()}:${normalizeCountyName(countyName || '')}`;
}

function cityKey(stateAbbr, cityName) {
  return `${(stateAbbr || '').toUpperCase()}:${normalizeCityName(cityName || '')}`;
}

async function fetchText(url) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: c.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'MesAdressesLogoDiscovery/1.0' },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function checkUrlExists(url) {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 8000);
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: c.signal,
      headers: { 'User-Agent': 'MesAdressesLogoDiscovery/1.0' },
    });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

/** Try common logo paths on baseUrl (origin only, no path). Returns first existing image URL. */
async function tryCommonLogoPaths(origin) {
  const candidates = [
    '/logo.svg',
    '/logo.png',
    '/images/logo.svg',
    '/images/logo.png',
    '/images/city-logo.png',
    '/images/seal.png',
    '/images/seal.svg',
    '/sites/default/files/logo.png',
    '/sites/default/files/logo.svg',
    '/wp-content/themes/custom/logo.png',
    '/assets/images/logo.svg',
    '/assets/images/logo.png',
    '/img/logo.png',
    '/img/logo.svg',
  ];
  for (const path of candidates) {
    const url = origin + path;
    await sleep(40);
    if (await checkUrlExists(url)) return url;
  }
  return null;
}

/** Extract logo URL from HTML: og:image first, then img with logo/seal in class/id/alt/src. */
function extractLogoFromHtml(html, baseOrigin) {
  if (!html) return null;
  const og = /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i.exec(html);
  if (og?.[1]) return resolveUrl(og[1], baseOrigin);

  const imgRegex = /<img[^>]+(?:class|id|alt)=["'][^"']*logo[^"']*["'][^>]+src=["']([^"']+)["']|<img[^>]+src=["']([^"']+)["'][^>]+(?:class|id|alt)=["'][^"']*logo[^"']*["']/gi;
  let m;
  while ((m = imgRegex.exec(html)) !== null) {
    const src = m[1] || m[2];
    if (src && !/\.(?:ico|cur)\b/i.test(src)) return resolveUrl(src, baseOrigin);
  }

  const sealRegex = /<img[^>]+(?:class|id|alt)=["'][^"']*seal[^"']*["'][^>]+src=["']([^"']+)["']|<img[^>]+src=["']([^"']+)["'][^>]+(?:class|id|alt)=["'][^"']*seal[^"']*["']/gi;
  while ((m = sealRegex.exec(html)) !== null) {
    const src = m[1] || m[2];
    if (src && !/\.(?:ico|cur)\b/i.test(src)) return resolveUrl(src, baseOrigin);
  }

  return null;
}

function resolveUrl(href, baseOrigin) {
  if (/^https?:\/\//i.test(href)) return href;
  const base = baseOrigin.replace(/\/$/, '');
  if (href.startsWith('/')) return base + href;
  return base + '/' + href.replace(/^\.\//, '');
}

async function discoverLogoForDomain(domain) {
  const origin = `https://${domain.replace(/\/$/, '')}`;
  const url = await tryCommonLogoPaths(origin);
  if (url) return url;
  const html = await fetchText(origin + '/');
  await sleep(DELAY_MS);
  return extractLogoFromHtml(html, origin);
}

async function main() {
  console.log('Fetching dotgov CSV...');
  const csvRes = await fetch(DOTGOV_CSV_URL, {
    headers: { 'User-Agent': 'MesAdressesLogoDiscovery/1.0' },
  });
  if (!csvRes.ok) {
    console.error('Failed to fetch CSV:', csvRes.status);
    process.exit(1);
  }
  const csvText = await csvRes.text();
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
  const header = parseCSVLine(lines[0]);
  const domainIdx = header.indexOf('Domain name');
  const typeIdx = header.indexOf('Domain type');
  const orgIdx = header.indexOf('Organization name');
  const cityIdx = header.indexOf('City');
  const stateIdx = header.indexOf('State');

  const countyDomains = new Map(); // countyKey(state, countyName) -> domain (prefer short)
  const cityDomains = new Map();   // cityKey(state, city) -> domain

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const domain = (row[domainIdx] || '').trim().toLowerCase();
    const type = (row[typeIdx] || '').trim();
    const org = (row[orgIdx] || '').trim();
    const city = (row[cityIdx] || '').trim();
    const state = (row[stateIdx] || '').trim();
    if (!domain || !state) continue;

    if (type === 'County') {
      const name = org || city;
      const key = countyKey(state, name);
      if (!key.endsWith(':')) {
        if (!countyDomains.has(key) || domain.length < (countyDomains.get(key).length)) {
          countyDomains.set(key, domain);
        }
      }
    } else if (type === 'City') {
      const key = cityKey(state, city);
      if (!key.endsWith(':')) {
        if (!cityDomains.has(key) || domain.length < (cityDomains.get(key).length)) {
          cityDomains.set(key, domain);
        }
      }
    }
  }

  console.log(`Parsed CSV: ${countyDomains.size} county domains, ${cityDomains.size} city domains.`);

  let fipsData;
  try {
    fipsData = JSON.parse(readFileSync(FIPS_PATH, 'utf8'));
  } catch (e) {
    console.error('Failed to read FIPS data:', e.message);
    process.exit(1);
  }

  const states = fipsData.states || {};
  const counties = fipsData.counties || {};
  const places = fipsData.places || {};
  const countyList = Object.values(counties);
  const placeList = Object.values(places);

  let existing = {};
  if (existsSync(OUT_PATH)) {
    try {
      existing = JSON.parse(readFileSync(OUT_PATH, 'utf8'));
    } catch (_) {}
  }

  const result = { ...existing };
  let foundCounties = 0;
  let foundPlaces = 0;

  if (!placesOnly) {
    const countyMax = limit ? Math.min(limit, countyList.length) : countyList.length;
    console.log(`Checking county domains (${countyMax} of ${countyList.length} counties)...`);
    for (let i = 0; i < countyMax; i++) {
      const county = countyList[i];
      if (result[county.code]) continue;
      const state = states[county.stateFips];
      if (!state) continue;
      const key = countyKey(state.abbr, county.name);
      const domain = countyDomains.get(key);
      if (!domain) continue;
      const url = await discoverLogoForDomain(domain);
      if (url) {
        result[county.code] = url;
        foundCounties++;
      }
      if ((i + 1) % 100 === 0) {
        console.log(`  counties ${i + 1}/${countyMax} (${foundCounties} from .gov)`);
      }
    }
    console.log(`Counties done. Found ${foundCounties} logos from .gov.`);
  }

  if (!countiesOnly) {
    const placeMax = limit ? Math.min(limit, placeList.length) : placeList.length;
    console.log(`Checking place/city domains (${placeMax} of ${placeList.length} places)...`);
    for (let i = 0; i < placeMax; i++) {
      const place = placeList[i];
      if (result[place.code]) continue;
      const state = states[place.stateFips];
      if (!state) continue;
      const placeName = place.name.replace(/\s+(city|town|village|borough|CDP|place)\s*$/i, '').trim();
      const key = cityKey(state.abbr, placeName);
      const domain = cityDomains.get(key);
      if (!domain) continue;
      const url = await discoverLogoForDomain(domain);
      if (url) {
        result[place.code] = url;
        foundPlaces++;
      }
      if ((i + 1) % 500 === 0) {
        console.log(`  places ${i + 1}/${placeMax} (${foundPlaces} from .gov)`);
      }
    }
    console.log(`Places done. Found ${foundPlaces} logos from .gov.`);
  }

  const totalNew = foundCounties + foundPlaces;
  console.log(`Total new from .gov: ${totalNew} (${foundCounties} counties + ${foundPlaces} places).`);
  console.log(`Total logos in file: ${Object.keys(result).length}.`);

  if (!dryRun && totalNew > 0) {
    const dir = dirname(OUT_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    createWriteStream(OUT_PATH).write(JSON.stringify(result, null, 2), () => {
      console.log('Wrote', OUT_PATH);
    });
  } else if (dryRun) {
    console.log('Dry run: not writing file.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
