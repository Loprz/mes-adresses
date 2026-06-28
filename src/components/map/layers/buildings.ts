/**
 * Overture Building Footprints layer (Phase 3).
 *
 * A viewport-driven GeoJSON layer fed by the API endpoint
 *   GET {NEXT_PUBLIC_BAL_API_URL}/overture/buildings?bbox=minLng,minLat,maxLng,maxLat
 * which extracts footprints (with GERS IDs) from the Overture Buildings theme on
 * demand. Rendered only at high zoom so the requested bbox — and the payload —
 * stay small. Each feature carries `properties.gersId` so a future click-to-place
 * interaction can link a building-typed address back to Overture.
 */

export const BUILDINGS_SOURCE = "overture-buildings";

export const BUILDINGS_LAYER = {
  FILL: "overture-buildings-fill",
  LINE: "overture-buildings-line",
};

// Only fetch/render footprints from this zoom up (keeps the bbox small).
export const BUILDINGS_MIN_ZOOM = 16;

export const buildingLayers = [
  {
    id: BUILDINGS_LAYER.FILL,
    type: "fill",
    source: BUILDINGS_SOURCE,
    minzoom: BUILDINGS_MIN_ZOOM,
    layout: { visibility: "visible" },
    paint: {
      "fill-color": "#f08c00",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.45,
        0.18,
      ],
    },
  },
  {
    id: BUILDINGS_LAYER.LINE,
    type: "line",
    source: BUILDINGS_SOURCE,
    minzoom: BUILDINGS_MIN_ZOOM,
    layout: { visibility: "visible", "line-join": "round" },
    paint: {
      "line-color": "#e8590c",
      "line-width": 1.5,
      "line-opacity": 0.9,
    },
  },
];

// ── Address validation: addresses NOT on any building footprint ──────────────
export const OFF_BUILDING_SOURCE = "off-building-addresses";
export const OFF_BUILDING_LAYER = "off-building-addresses-circle";

// A red halo drawn over address points that don't fall on a building footprint.
export const offBuildingLayer = {
  id: OFF_BUILDING_LAYER,
  type: "circle",
  source: OFF_BUILDING_SOURCE,
  minzoom: BUILDINGS_MIN_ZOOM,
  layout: { visibility: "visible" },
  paint: {
    "circle-radius": 11,
    "circle-color": "rgba(214, 69, 69, 0.15)",
    "circle-stroke-color": "#d64545",
    "circle-stroke-width": 2.5,
  },
};

const API_BASE =
  process.env.NEXT_PUBLIC_BAL_API_URL || "http://localhost:5050/v2";

export type BuildingsFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: { type: string; coordinates: unknown };
    properties: { gersId: string; class?: string };
  }>;
  release?: string;
};

export const EMPTY_BUILDINGS: BuildingsFeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

/**
 * Fetch Overture building footprints overlapping a bbox from the API.
 * @param bbox "minLng,minLat,maxLng,maxLat"
 */
export async function fetchBuildings(
  bbox: string,
  limit?: number
): Promise<BuildingsFeatureCollection> {
  const url =
    `${API_BASE}/overture/buildings?bbox=${encodeURIComponent(bbox)}` +
    (limit ? `&limit=${limit}` : "");
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch buildings (${res.status})`);
  }
  return res.json();
}
