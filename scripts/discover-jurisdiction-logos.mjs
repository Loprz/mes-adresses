#!/usr/bin/env node
/**
 * Discover US county and city/place logos from Wikimedia Commons.
 *
 * Counties: Seal_of_{CountyName}_County,_StateName.svg (or .png)
 * Places:  Seal_of_{PlaceName},_{StateName}.svg (or .png) — place name has " city"/" town" etc. stripped
 *
 * Reads FIPS data from mes-adresses-api, checks Commons Special:FilePath URLs,
 * writes public/static/data/jurisdiction-logos.json.
 *
 * Usage: node scripts/discover-jurisdiction-logos.mjs [--counties-only] [--places-only]
 */

import { createWriteStream } from 'fs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const API_ROOT = join(ROOT, '..', 'mes-adresses-api');
const FIPS_PATH = join(API_ROOT, 'us-fips-data.json');
const OUT_PATH = join(ROOT, 'public', 'static', 'data', 'jurisdiction-logos.json');

const COMMONS_PATH_BASE = 'https://commons.wikimedia.org/wiki/Special:FilePath/';
const DELAY_MS_COUNTY = 80;
const DELAY_MS_PLACE = 60;

const args = process.argv.slice(2);
const countiesOnly = args.includes('--counties-only');
const placesOnly = args.includes('--places-only');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// County: "Los Angeles County" -> Seal_of_Los_Angeles_County,_California.svg
function buildCountyFilename(countyName, stateName, ext) {
  const part = countyName.replace(/ /g, '_') + ',_' + stateName;
  return `Seal_of_${part}.${ext}`;
}

// Place: "Los Angeles city" -> "Los Angeles"; then Seal_of_Los_Angeles,_California.svg
function normalizePlaceName(name) {
  return name
    .replace(/\s+(city|town|village|borough|CDP|place)\s*$/i, '')
    .trim();
}

function buildPlaceFilename(placeNameNormalized, stateName, ext) {
  const part = placeNameNormalized.replace(/ /g, '_') + ',_' + stateName;
  return `Seal_of_${part}.${ext}`;
}

function buildCommonsUrl(filename) {
  return COMMONS_PATH_BASE + encodeURIComponent(filename);
}

async function checkUrlExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return res.ok;
  } catch {
    return false;
  }
}

async function discoverCountyLogo(county, stateName, delay) {
  const name = county.name;
  for (const ext of ['svg', 'png']) {
    const filename = buildCountyFilename(name, stateName, ext);
    const url = buildCommonsUrl(filename);
    await sleep(delay);
    if (await checkUrlExists(url)) return url;
  }
  return null;
}

async function discoverPlaceLogo(place, stateName, delay) {
  const normalized = normalizePlaceName(place.name);
  if (!normalized) return null;
  // Primary: Seal_of_{Name},_{State}.svg/png
  for (const ext of ['svg', 'png', 'jpg']) {
    const filename = buildPlaceFilename(normalized, stateName, ext);
    const url = buildCommonsUrl(filename);
    await sleep(delay);
    if (await checkUrlExists(url)) return url;
  }
  // Fallback: Seal_of_{Name}.svg (no state) for well-known cities
  for (const ext of ['svg', 'png']) {
    const part = normalized.replace(/ /g, '_');
    const filename = `Seal_of_${part}.${ext}`;
    const url = buildCommonsUrl(filename);
    await sleep(delay);
    if (await checkUrlExists(url)) return url;
  }
  return null;
}

async function main() {
  let fipsData;
  try {
    fipsData = JSON.parse(readFileSync(FIPS_PATH, 'utf8'));
  } catch (e) {
    console.error('Failed to read FIPS data from', FIPS_PATH, e.message);
    process.exit(1);
  }

  const states = fipsData.states || {};
  const counties = fipsData.counties || {};
  const places = fipsData.places || {};
  const countyList = Object.values(counties);
  const placeList = Object.values(places);

  const result = {};
  let foundCounties = 0;
  let foundPlaces = 0;

  if (!placesOnly) {
    console.log(`Discovering county logos (${countyList.length} counties)...`);
    for (let i = 0; i < countyList.length; i++) {
      const county = countyList[i];
      const state = states[county.stateFips];
      if (!state) continue;
      const url = await discoverCountyLogo(county, state.name, DELAY_MS_COUNTY);
      if (url) {
        result[county.code] = url;
        foundCounties++;
      }
      if ((i + 1) % 200 === 0) {
        console.log(`  counties ${i + 1}/${countyList.length} (${foundCounties} found)`);
      }
    }
    console.log(`Counties done. Found ${foundCounties} logos.`);
  }

  if (!countiesOnly) {
    console.log(`Discovering place/city logos (${placeList.length} places)...`);
    for (let i = 0; i < placeList.length; i++) {
      const place = placeList[i];
      const state = states[place.stateFips];
      if (!state) continue;
      const url = await discoverPlaceLogo(place, state.name, DELAY_MS_PLACE);
      if (url) {
        result[place.code] = url;
        foundPlaces++;
      }
      if ((i + 1) % 500 === 0) {
        console.log(`  places ${i + 1}/${placeList.length} (${foundPlaces} found)`);
      }
    }
    console.log(`Places done. Found ${foundPlaces} logos.`);
  }

  const total = foundCounties + foundPlaces;
  console.log(`Total: ${total} logos (${foundCounties} counties + ${foundPlaces} places).`);
  const json = JSON.stringify(result, null, 2);
  createWriteStream(OUT_PATH).write(json, () => {
    console.log('Wrote', OUT_PATH);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
