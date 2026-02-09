# Prompt: Collect US jurisdiction logos for the National Address Platform

Use this as the instruction set for an AI agent (or human) that will collect official county and place logos/seals for the NAP app.

---

## Copy-paste prompt (short version)

**Task:** Build a JSON file `jurisdiction-logos.json` that maps US jurisdiction FIPS codes to their official logo URLs (or paths). FIPS codes: 5-digit county (e.g. `"06019"` = Fresno County, CA) and optionally 7-digit place. Keys must be strings; values must be logo URLs (e.g. `https://...` or `/static/images/jurisdiction-logos/06019.svg`). Find official county/city seals or logos from government sites; prefer SVG, then PNG. Use the project’s `us-fips-data.json` (in mes-adresses-api) or Census for the full county list. Output valid JSON only; you may also save images to `public/static/images/jurisdiction-logos/` named `{fips}.svg` or `{fips}.png` and use the path `/static/images/jurisdiction-logos/{fips}.{ext}` in the JSON. Follow the full instructions below for scope, quality, and format.

---

## Your task

Collect **official logos or seals** for US jurisdictions (counties and, optionally, incorporated places) and produce:

1. **`jurisdiction-logos.json`** — a JSON file that maps each jurisdiction’s FIPS code to a logo URL (or app path).
2. **(Optional)** Image files in **`jurisdiction-logos/`** — if you save logo images locally instead of linking to external URLs.

The app uses this to show the correct logo in the welcome modal and elsewhere (e.g. “Welcome to the new Local Address Base for Fresno County, CA”).

---

## Output format

### 1. JSON file: `jurisdiction-logos.json`

- **Location:** Same directory as this prompt, or wherever the app expects it (e.g. `public/static/data/jurisdiction-logos.json`).
- **Structure:** A single JSON object. No `_comment` or `_example` keys in the final file (or leave them; the app ignores keys starting with `_`).

**Schema:**

- **Key:** FIPS code as a **string** (no leading zero stripped).
  - **5 digits** = county (e.g. `"06019"` = Fresno County, CA; `"06037"` = Los Angeles County, CA).
  - **7 digits** = Census “place” (e.g. city/town); optional, only if you are collecting place-level logos.
- **Value:** Logo URL as a **string**. Allowed forms:
  - **Full URL:** `"https://www.fresnocounty.ca.gov/.../seal.svg"` — use stable, official URLs when possible.
  - **App-relative path:** `"/static/images/jurisdiction-logos/06019.svg"` — use when you are saving image files into the repo (see below).
  - **Data URL:** `"data:image/svg+xml;base64,..."` — acceptable but makes the JSON large; prefer URL or path.

**Example (minimal):**

```json
{
  "06019": "https://www.fresnocounty.ca.gov/.../county-seal.svg",
  "06037": "/static/images/jurisdiction-logos/06037.png"
}
```

**Example (with many counties):**

```json
{
  "06001": "https://...",
  "06019": "/static/images/jurisdiction-logos/06019.svg",
  "06037": "/static/images/jurisdiction-logos/06037.png"
}
```

---

## Where to get FIPS codes

- **Counties:** 5-digit FIPS (e.g. California counties: 06001, 06013, 06019, 06037, …). Use the project’s **`mes-adresses-api/us-fips-data.json`** (under `states` → state → `counties`) or the Census Bureau’s county FIPS list.
- **Places (optional):** 7-digit FIPS (state + county + place). The project has place data in its FIPS utilities; you can also use Census “Incorporated Places” / “Census Designated Places” FIPS.

Ensure keys are **strings** and **zero-padded** (e.g. `"06019"` not `6019`).

---

## Where to find logos

- **Official government sources first:** County or city “About” / “Government” / “Seal” / “Brand” pages; official `.gov` or `.us` sites.
- **Stable URLs:** Prefer URLs that are unlikely to change (e.g. from the jurisdiction’s own site or a stable CDN). If the only option is unstable, prefer downloading the file and using a path under `jurisdiction-logos/`.
- **Fallbacks (use with care):** Wikipedia/Commons, or other repositories that host official seals; prefer “official” or “public domain” where possible. Avoid clearly unofficial or commercial clip art.
- **Format:** Prefer **SVG** (scales well). **PNG** is fine (e.g. 200–400 px on the long side). Avoid low-resolution or watermarked images.

---

## If you save image files (optional)

- **Folder:** `public/static/images/jurisdiction-logos/` (or the equivalent path in the app repo).
- **Naming:** `{fips}.svg` or `{fips}.png` (e.g. `06019.svg`, `06037.png`).
- **Value in JSON:** Use the app path: `"/static/images/jurisdiction-logos/06019.svg"`.

Then the JSON entry for that jurisdiction should be that path string.

---

## Scope (what to collect)

- **Minimum:** All **counties** in one or more states (e.g. start with California, or a list of states the product owner specifies).
- **Optional:** **Incorporated places** (cities, towns, etc.) — 7-digit FIPS; only if the product owner wants place-level logos and you have a list of place FIPS to cover.

If the scope is “all US counties,” use the full county FIPS list (e.g. from `us-fips-data.json` or Census) and collect one logo per county. Skip a county only if no suitable official or reasonable fallback exists; in that case omit it from the JSON (the app will use a default placeholder).

---

## Quality and legal

- Use **official seals or logos** where possible (county seal, city logo, etc.).
- Prefer **public domain** or **government use**; many US government seals are in the public domain or acceptable for this use. Avoid clearly copyrighted, non-official artwork.
- If you can’t find an official logo, you may leave that FIPS out of the JSON so the app shows the default placeholder, or note it in a short report for the product owner.

---

## Deliverables

1. **`jurisdiction-logos.json`** — complete, valid JSON (no trailing commas; keys quoted; FIPS as string).
2. **(If applicable)** Image files in **`jurisdiction-logos/`** named by FIPS (e.g. `06019.svg`), and corresponding entries in the JSON using the `/static/images/jurisdiction-logos/{fips}.{ext}` path.
3. **(Optional)** Short report: list of FIPS with no logo found, or with fallback/unusual source, so the product owner can review.

---

## Checklist before submitting

- [ ] Every key in `jurisdiction-logos.json` is a 5-digit (county) or 7-digit (place) FIPS string.
- [ ] Every value is a non-empty string (full URL, or path starting with `/static/...`, or data URL).
- [ ] No keys start with `_` unless they are comments you intend to keep (and the app will ignore them).
- [ ] If you added image files, paths in the JSON match the actual file names (e.g. `06019.svg` → `/static/images/jurisdiction-logos/06019.svg`).
- [ ] JSON is valid (e.g. paste into a JSON validator).

Once `jurisdiction-logos.json` (and any image files) are in place, the app will use them automatically for US jurisdictions; no code change is required beyond what is already implemented.
