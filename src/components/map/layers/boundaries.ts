/**
 * US Census TIGER Boundary Layers
 *
 * Uses the Census Bureau TIGERweb WMS service for administrative boundary tiles.
 * Provides state, county, and incorporated place (city/town) boundary overlays.
 *
 * Service: https://tigerweb.geo.census.gov/arcgis/services/TIGERweb/tigerWMS_Current/MapServer/WMSServer
 *
 * WMS Layer IDs (from GetCapabilities):
 * - Layer 13: States            (boundaries)
 * - Layer 12: States Labels     (names)
 * - Layer 11: Counties          (boundaries)
 * - Layer 10: Counties Labels   (names)
 * - Layer 49: Incorporated Places (boundaries)
 * - Layer 48: Incorporated Places Labels (names)
 */

// TIGERweb WMS base URL
const TIGERWEB_WMS_BASE =
  "https://tigerweb.geo.census.gov/arcgis/services/TIGERweb/tigerWMS_Current/MapServer/WMSServer";

/**
 * Build a WMS tile URL for MapLibre raster source.
 * Uses EPSG:3857 (Web Mercator) for compatibility with standard map tiles.
 * The {bbox-epsg-3857} placeholder is replaced by MapLibre at render time.
 */
function buildWmsTileUrl(layers: string): string {
  const params = new URLSearchParams({
    SERVICE: "WMS",
    VERSION: "1.1.1",
    REQUEST: "GetMap",
    LAYERS: layers,
    STYLES: "",
    SRS: "EPSG:3857",
    FORMAT: "image/png",
    TRANSPARENT: "true",
    WIDTH: "256",
    HEIGHT: "256",
  });
  return `${TIGERWEB_WMS_BASE}?${params.toString()}&BBOX={bbox-epsg-3857}`;
}

// ─── Source IDs ─────────────────────────────────────────────────────────────────

export const BOUNDARY_SOURCES = {
  STATES: "tiger-states",
  COUNTIES: "tiger-counties",
  PLACES: "tiger-places",
} as const;

// ─── Layer IDs ──────────────────────────────────────────────────────────────────

export const BOUNDARY_LAYERS = {
  STATES: "tiger-states-layer",
  COUNTIES: "tiger-counties-layer",
  PLACES: "tiger-places-layer",
} as const;

// ─── Source Definitions ─────────────────────────────────────────────────────────

export const boundarySourceConfigs = {
  [BOUNDARY_SOURCES.STATES]: {
    type: "raster" as const,
    tiles: [buildWmsTileUrl("12,13")], // States + States Labels
    tileSize: 256,
    attribution:
      '&copy; <a href="https://www.census.gov/programs-surveys/geography.html">US Census Bureau</a>',
  },
  [BOUNDARY_SOURCES.COUNTIES]: {
    type: "raster" as const,
    tiles: [buildWmsTileUrl("10,11")], // Counties + Counties Labels
    tileSize: 256,
    attribution:
      '&copy; <a href="https://www.census.gov/programs-surveys/geography.html">US Census Bureau</a>',
  },
  [BOUNDARY_SOURCES.PLACES]: {
    type: "raster" as const,
    tiles: [buildWmsTileUrl("48,49")], // Incorporated Places + Labels
    tileSize: 256,
    attribution:
      '&copy; <a href="https://www.census.gov/programs-surveys/geography.html">US Census Bureau</a>',
  },
};

// ─── Layer Definitions ──────────────────────────────────────────────────────────

export const boundaryLayerConfigs = {
  [BOUNDARY_LAYERS.STATES]: {
    id: BOUNDARY_LAYERS.STATES,
    type: "raster" as const,
    source: BOUNDARY_SOURCES.STATES,
    minzoom: 2,
    maxzoom: 10,
    paint: {
      "raster-opacity": 0.7,
    },
  },
  [BOUNDARY_LAYERS.COUNTIES]: {
    id: BOUNDARY_LAYERS.COUNTIES,
    type: "raster" as const,
    source: BOUNDARY_SOURCES.COUNTIES,
    minzoom: 6,
    maxzoom: 14,
    paint: {
      "raster-opacity": 0.7,
    },
  },
  [BOUNDARY_LAYERS.PLACES]: {
    id: BOUNDARY_LAYERS.PLACES,
    type: "raster" as const,
    source: BOUNDARY_SOURCES.PLACES,
    minzoom: 8,
    maxzoom: 16,
    paint: {
      "raster-opacity": 0.7,
    },
  },
};

// ─── Helper: Get all boundary layer IDs ─────────────────────────────────────────

export const ALL_BOUNDARY_LAYER_IDS = Object.values(BOUNDARY_LAYERS);
