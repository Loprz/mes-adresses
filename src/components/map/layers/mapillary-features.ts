/**
 * Mapillary map-feature points — mailboxes and driveway entrances.
 *
 * Address-validation aids: a detected mailbox near an address corroborates a
 * real delivery point, and a detected driveway entrance corroborates the access
 * point. Served from Mapillary's map-feature point vector tiles
 *   https://tiles.mapillary.com/maps/vtp/mly_map_feature_point/2/{z}/{x}/{y}
 * (layer "point", field "value"), filtered to the two classes we care about.
 * Rendered as recognizable icons; clicking one opens the Mapillary imagery
 * viewer at the image the feature was detected from. Reuses the same
 * NEXT_PUBLIC_MAPILLARY_TOKEN as the imagery coverage layer.
 */

import { MAPILLARY_TOKEN } from "./mapillary";

export const MAPILLARY_FEATURES_SOURCE_ID = "mapillary-map-features";

export const MAPILLARY_FEATURES_SOURCE_LAYER = "point"; // vector tile layer name

export const MAPILLARY_FEATURES_TILE_URL =
  MAPILLARY_TOKEN && MAPILLARY_TOKEN.trim() !== ""
    ? `https://tiles.mapillary.com/maps/vtp/mly_map_feature_point/2/{z}/{x}/{y}?access_token=${MAPILLARY_TOKEN}`
    : null;

// Mapillary point-feature class values (see API docs → Object values → Points).
export const MAILBOX_VALUE = "object--mailbox";
export const DRIVEWAY_VALUE = "construction--flat--driveway";

export const MAILBOX_ICON_ID = "mly-mailbox";
export const DRIVEWAY_ICON_ID = "mly-driveway";

export const MAILBOX_COLOR = "#1d6fd6"; // blue
export const DRIVEWAY_COLOR = "#7d3cc9"; // purple

export const MAPILLARY_FEATURE_LAYER = {
  MAILBOX: "mapillary-mailbox",
  DRIVEWAY: "mapillary-driveway",
};

// Only show at high zoom (tiles are z14; MapLibre overzooms above that).
const FEATURES_MIN_ZOOM = 16;

export const mailboxLayer = {
  id: MAPILLARY_FEATURE_LAYER.MAILBOX,
  type: "symbol",
  source: MAPILLARY_FEATURES_SOURCE_ID,
  "source-layer": MAPILLARY_FEATURES_SOURCE_LAYER,
  minzoom: FEATURES_MIN_ZOOM,
  filter: ["==", ["get", "value"], MAILBOX_VALUE],
  layout: {
    visibility: "visible",
    "icon-image": MAILBOX_ICON_ID,
    // Grow the marker as the user zooms in.
    "icon-size": ["interpolate", ["linear"], ["zoom"], 16, 0.5, 18, 0.85, 21, 1.4],
    "icon-allow-overlap": true,
    "icon-ignore-placement": true,
  },
};

export const drivewayLayer = {
  id: MAPILLARY_FEATURE_LAYER.DRIVEWAY,
  type: "symbol",
  source: MAPILLARY_FEATURES_SOURCE_ID,
  "source-layer": MAPILLARY_FEATURES_SOURCE_LAYER,
  minzoom: FEATURES_MIN_ZOOM,
  filter: ["==", ["get", "value"], DRIVEWAY_VALUE],
  layout: {
    visibility: "visible",
    "icon-image": DRIVEWAY_ICON_ID,
    // Grow the marker as the user zooms in.
    "icon-size": ["interpolate", ["linear"], ["zoom"], 16, 0.5, 18, 0.85, 21, 1.4],
    "icon-allow-overlap": true,
    "icon-ignore-placement": true,
  },
};

export const mapillaryFeatureLayers = [mailboxLayer, drivewayLayer];

// ── Icons ────────────────────────────────────────────────────────────────────
// Badge + white glyph so the points read clearly over aerial imagery.
const mailboxSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <circle cx="15" cy="15" r="13" fill="${MAILBOX_COLOR}" stroke="#ffffff" stroke-width="2"/>
  <rect x="8" y="11" width="14" height="9" rx="1.5" fill="#ffffff"/>
  <path d="M8.5 12 L15 16.5 L21.5 12" fill="none" stroke="${MAILBOX_COLOR}" stroke-width="1.6" stroke-linejoin="round"/>
</svg>`;

// Car icon (side view) — reads as "vehicle access / driveway" rather than a
// house, which testers found confusing.
const drivewaySvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <circle cx="15" cy="15" r="13" fill="${DRIVEWAY_COLOR}" stroke="#ffffff" stroke-width="2"/>
  <path d="M9.5 10.5 L18.5 10.5 L21.5 14.5 L23 15 L23 18 L7 18 L7 15 L8.5 14.5 Z" fill="#ffffff"/>
  <circle cx="11" cy="19" r="2.1" fill="#ffffff" stroke="${DRIVEWAY_COLOR}" stroke-width="1.1"/>
  <circle cx="19" cy="19" r="2.1" fill="#ffffff" stroke="${DRIVEWAY_COLOR}" stroke-width="1.1"/>
</svg>`;

function svgToImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image(30, 30);
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.trim());
  });
}

/**
 * Register the mailbox + driveway icons on the map (idempotent). Call after the
 * map style is loaded and whenever the style changes (style swaps drop images).
 */
export async function addMapillaryFeatureIcons(map: any): Promise<void> {
  const defs: Array<[string, string]> = [
    [MAILBOX_ICON_ID, mailboxSvg],
    [DRIVEWAY_ICON_ID, drivewaySvg],
  ];
  for (const [id, svg] of defs) {
    try {
      if (map.hasImage && map.hasImage(id)) continue;
      const img = await svgToImage(svg);
      if (!map.hasImage(id)) {
        map.addImage(id, img, { pixelRatio: 2 });
      }
    } catch {
      /* icon load failed — layer falls back to no icon, non-fatal */
    }
  }
}

// ── Detection image lookup ───────────────────────────────────────────────────
/**
 * Given a Mapillary map-feature id, return the id of an image it was detected
 * from (so the viewer can open on the street-level photo showing the object).
 */
export async function fetchDetectionImageId(
  featureId: string
): Promise<string | null> {
  if (!MAPILLARY_TOKEN || !featureId) return null;
  try {
    const url =
      `https://graph.mapillary.com/${featureId}` +
      `?fields=images&access_token=${MAPILLARY_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const images = data?.images?.data || [];
    return images.length ? String(images[0].id) : null;
  } catch {
    return null;
  }
}
