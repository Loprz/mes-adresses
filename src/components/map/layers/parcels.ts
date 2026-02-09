/**
 * US Parcel Tile Layers
 *
 * Replaces the French cadastre vector tile layers with US parcel data.
 * Supports Regrid vector tiles as the primary nationwide source.
 * Configure via NEXT_PUBLIC_PARCEL_TILES_URL environment variable.
 *
 * Regrid vector tile properties (source-layer: "parcels"):
 *   - path: parcel path/ID
 *   - apn: assessor's parcel number
 *   - address, city, state, zip
 *   - owner
 *   - geoid: FIPS code
 *   - ll_uuid: Regrid unique parcel ID
 *
 * For county-specific or alternative tile services, set the env var
 * to the appropriate {z}/{x}/{y} tile URL template.
 */

import { SignalementDiff } from "@/lib/utils/signalement";

// Parcel tile source configuration
export const PARCEL_TILES_URL =
  process.env.NEXT_PUBLIC_PARCEL_TILES_URL || "";

// Whether parcel tiles are configured and available
export const PARCELS_AVAILABLE = Boolean(PARCEL_TILES_URL);

// Tile type: "vector" for Regrid MVT, "raster" for PNG tile services
export const PARCEL_TILES_TYPE =
  (process.env.NEXT_PUBLIC_PARCEL_TILES_TYPE as "vector" | "raster") ||
  "vector";

// For vector tiles, the feature ID field used for feature-state operations
export const PARCEL_PROMOTE_ID =
  process.env.NEXT_PUBLIC_PARCEL_PROMOTE_ID || "ll_uuid";

export const SOURCE = "parcels";

export const SOURCE_LAYER = {
  PARCELS: "parcels",
};

export const LAYER = {
  PARCELS: "parcels-line",
  PARCELS_FILL: "parcels-fill",
  PARCELS_SELECTED: "parcels-selected",
  PARCELLE_HIGHLIGHTED: "parcels-highlighted",
  PARCELLE_HIGHLIGHTED_DIFF_MODE: "parcels-highlighted-diff-mode",
  CODE_PARCELS: "parcels-label",
};

const signalementColors = {
  [SignalementDiff.NEW]: "rgba(218, 244, 246, 1)",
  [SignalementDiff.DELETED]: "rgba(244, 228, 219, 1)",
  [SignalementDiff.UNCHANGED]: "rgba(64, 101, 246, 1)",
};

/**
 * Vector tile layers for parcel data (used with Regrid or similar MVT sources).
 * These are added to the map style when parcel tiles are available.
 */
export const parcelLayers = [
  // Parcel boundary outlines
  {
    id: LAYER.PARCELS,
    type: "line",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELS,
    minzoom: 14,
    maxzoom: 24,
    layout: {
      visibility: "none",
      "line-cap": "butt",
    },
    paint: {
      "line-color": "#0053b3",
      "line-opacity": 0.9,
      "line-width": {
        stops: [
          [14, 0.5],
          [16, 1],
          [17, 2],
        ],
      },
    },
  },
  // Parcel fill (for hover interaction)
  {
    id: LAYER.PARCELS_FILL,
    type: "fill",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELS,
    minzoom: 14,
    layout: {
      visibility: "none",
    },
    paint: {
      "fill-color": "rgba(129, 123, 0, 1)",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.7,
        0.1,
      ],
    },
  },
  // Selected parcels (associated with an address)
  {
    id: LAYER.PARCELS_SELECTED,
    type: "fill",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELS,
    layout: {
      visibility: "none",
    },
    filter: ["==", "id", ""],
    paint: {
      "fill-color": "#0053b3",
      "fill-opacity": 0.2,
    },
  },
  // Highlighted parcels (during parcel selection mode)
  {
    id: LAYER.PARCELLE_HIGHLIGHTED,
    type: "fill",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELS,
    layout: {
      visibility: "none",
    },
    filter: ["==", "id", ""],
    paint: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "rgba(209, 67, 67, 1)",
        "rgba(1, 129, 0, 1)",
      ],
      "fill-opacity": 0.7,
    },
  },
  // Highlighted parcels in diff mode (signalement)
  {
    id: LAYER.PARCELLE_HIGHLIGHTED_DIFF_MODE,
    type: "fill",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELS,
    layout: {
      visibility: "none",
    },
    filter: ["==", "id", ""],
    paint: {
      "fill-color": [
        "case",
        ["==", ["feature-state", "diff"], SignalementDiff.DELETED],
        signalementColors[SignalementDiff.DELETED],
        ["==", ["feature-state", "diff"], SignalementDiff.NEW],
        signalementColors[SignalementDiff.NEW],
        signalementColors[SignalementDiff.UNCHANGED],
      ],
      "fill-opacity": 0.7,
    },
  },
  // Parcel APN labels (visible at high zoom)
  {
    id: LAYER.CODE_PARCELS,
    type: "symbol",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELS,
    minzoom: 17,
    filter: ["all"],
    layout: {
      visibility: "none",
      "text-field": ["coalesce", ["get", "apn"], ["get", "path"], ""],
      "text-font": ["Open Sans Regular"],
      "text-allow-overlap": false,
      "text-size": 11,
    },
    paint: {
      "text-halo-color": "#fff6f1",
      "text-halo-width": 1.5,
      "text-translate-anchor": "map",
    },
  },
];

/**
 * Raster tile layer for parcel data (used with ATTOM, county WMS, etc.).
 * Only the outline layer is used; selection/highlight is not available for raster.
 */
export const parcelRasterLayer = {
  id: "parcels-raster",
  type: "raster",
  source: SOURCE,
  minzoom: 15,
  maxzoom: 18,
  layout: {
    visibility: "none",
  },
  paint: {
    "raster-opacity": 0.7,
  },
};
