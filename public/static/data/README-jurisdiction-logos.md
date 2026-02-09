# Jurisdiction logos (US)

Used by the app to show a jurisdiction’s logo in the welcome modal and elsewhere.

## Discovery script (counties + cities)

From the repo root (or `mes-adresses`):

```bash
cd mes-adresses && node scripts/discover-jurisdiction-logos.mjs
```

- **Counties** (5-digit FIPS): uses Commons pattern `Seal_of_{CountyName}_County,_State.svg` (or .png).
- **Places** (7-digit FIPS): uses `Seal_of_{PlaceName},_{State}.svg` (place name is normalized, e.g. "Los Angeles city" → "Los Angeles"). Tries .svg, .png, .jpg; then fallback without state.

Options:
- `--counties-only` — only discover county logos (~8–10 min).
- `--places-only` — only discover city/town logos (~1–2 hours for 28k places).

Output is written to `public/static/data/jurisdiction-logos.json` (county and place codes in one file).

## File

- **`jurisdiction-logos.json`** — JSON object: FIPS code → logo URL.

## Format

- **Keys**: FIPS code as string.
  - 5 digits = county (e.g. `"06019"` = Fresno County, CA).
  - 7 digits = place (e.g. `"0603710"` = a city/place).
- **Values**: Logo URL as string. Allowed:
  - Full URL: `"https://example.com/logos/06019.svg"`
  - App path: `"/static/images/jurisdiction-logos/06019.svg"` (put files in `public/static/images/jurisdiction-logos/`).
  - Data URL: `"data:image/svg+xml;base64,..."`
- Remove any `_comment` / `_example_*` keys when producing the final file (or leave them; they are ignored).

## Example (minimal)

```json
{
  "06019": "https://cdn.example.com/fresno-county-seal.svg",
  "06037": "/static/images/jurisdiction-logos/06037.png"
}
```

## Who can update logos?

- **Today**: Only by editing this JSON (and optionally adding files under `public/static/images/jurisdiction-logos/`). Jurisdictions do **not** have an in-app setting to change their logo.
- A future feature could add a “logo URL” (or upload) in LAB/jurisdiction settings so they can update it themselves.
