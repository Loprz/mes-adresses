import { fromJS } from "immutable";

import vectorStyle from "@/components/map/styles/vector.json";
import planIGNStyle from "@/components/map/styles/plan-ign.json";

// US map tile configuration
// Glyphs and tile URLs use environment variables with fallbacks to free open sources
const GLYPHS_URL =
  process.env.NEXT_PUBLIC_MAP_GLYPHS_URL ||
  "https://tiles.stadiamaps.com/fonts/{fontstack}/{range}.pbf";

// ── Aerial / ortho imagery ──────────────────────────────────────────────────
// Resolution order for the base imagery (most accurate first):
//   1. Per-county ortho (COUNTY_ORTHO_TILES) — local, high-res, recent.
//   2. NEXT_PUBLIC_ORTHO_TILES_URL — global override.
//   3. National default: Esri World Imagery (high-res, global, free, keyless).
//
// The aerial layer is rendered as an "Imagery Hybrid": the base imagery PLUS
// Esri's keyless reference overlays (place labels + roads/road names), so the
// aerial view is annotated. Disable the overlay with NEXT_PUBLIC_ORTHO_HYBRID=off.
//
// Alternative public-domain US source (if you prefer NAIP over Esri), usable as
// NEXT_PUBLIC_ORTHO_TILES_URL or a county override:
//   https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}

const ESRI_WORLD_IMAGERY =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTRIBUTION =
  "<a target='_blank' href='https://www.esri.com/'>© Esri</a>";

// Transparent Esri reference overlays (free, keyless) — the "hybrid" labels.
const ESRI_REF_PLACES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";
const ESRI_REF_TRANSPORT =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}";

const ORTHO_TILES_URL_ENV = process.env.NEXT_PUBLIC_ORTHO_TILES_URL;
const ORTHO_ATTRIBUTION_ENV = process.env.NEXT_PUBLIC_ORTHO_ATTRIBUTION;
const ORTHO_HYBRID =
  (process.env.NEXT_PUBLIC_ORTHO_HYBRID || "on").toLowerCase() !== "off";

/**
 * Per-county aerial overrides, keyed by 5-digit county FIPS. County imagery is
 * usually the most accurate and current backdrop for address QA, so it takes
 * precedence over the env override and the national default.
 *
 * Point each entry at the county's tiled ArcGIS service, e.g.
 *   .../MapServer/tile/{z}/{y}/{x}  (or any XYZ raster template).
 * Examples (replace with real URLs):
 *   "06019": { tiles: "https://gisportal.co.fresno.ca.us/.../MapServer/tile/{z}/{y}/{x}", attribution: "Fresno County GIS" },
 *   "06107": { tiles: "https://<tulare-gis>/.../MapServer/tile/{z}/{y}/{x}", attribution: "Tulare County GIS" },
 */
export const COUNTY_ORTHO_TILES: Record<
  string,
  { tiles: string; attribution?: string }
> = {};

export const resolveOrthoTiles = (
  countyFips?: string | null
): { tiles: string; attribution: string } => {
  if (countyFips && COUNTY_ORTHO_TILES[countyFips]) {
    const c = COUNTY_ORTHO_TILES[countyFips];
    return { tiles: c.tiles, attribution: c.attribution || "County GIS" };
  }
  if (ORTHO_TILES_URL_ENV) {
    return {
      tiles: ORTHO_TILES_URL_ENV,
      attribution: ORTHO_ATTRIBUTION_ENV || "Aerial imagery",
    };
  }
  return { tiles: ESRI_WORLD_IMAGERY, attribution: ESRI_ATTRIBUTION };
};

export const buildOrthoStyle = (
  { tiles, attribution }: { tiles: string; attribution: string },
  { hybrid = ORTHO_HYBRID }: { hybrid?: boolean } = {}
) => {
  const sources: Record<string, any> = {
    "raster-tiles": {
      type: "raster",
      tiles: [tiles],
      tileSize: 256,
      attribution,
    },
  };
  const layers: any[] = [
    { id: "simple-tiles", type: "raster", source: "raster-tiles" },
  ];

  if (hybrid) {
    sources["ortho-ref-places"] = {
      type: "raster",
      tiles: [ESRI_REF_PLACES],
      tileSize: 256,
    };
    sources["ortho-ref-transport"] = {
      type: "raster",
      tiles: [ESRI_REF_TRANSPORT],
      tileSize: 256,
    };
    // Roads first, then place labels on top.
    layers.push({
      id: "ortho-ref-transport",
      type: "raster",
      source: "ortho-ref-transport",
    });
    layers.push({
      id: "ortho-ref-places",
      type: "raster",
      source: "ortho-ref-places",
    });
  }

  return fromJS({ version: 8, glyphs: GLYPHS_URL, sources, layers });
};

// Backward-compatible national default ortho style.
export const ortho = buildOrthoStyle(resolveOrthoTiles());

export const vector = fromJS(vectorStyle);
export const planIGN = fromJS(planIGNStyle);

export const getStyleDynamically = ({ name, url }) => {
  return fromJS({
    version: 8,
    glyphs: GLYPHS_URL,
    sources: {
      [name]: {
        type: "raster",
        tiles: [url],
      },
    },
    layers: [
      {
        id: "simple-tiles",
        type: "raster",
        source: name,
      },
    ],
  });
};
