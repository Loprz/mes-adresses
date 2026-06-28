/**
 * Mapillary map-feature points — mailboxes and driveway entrances.
 *
 * Address-validation aids: a detected mailbox near an address corroborates a
 * real delivery point, and a detected driveway entrance corroborates the access
 * point. Served from Mapillary's map-feature point vector tiles
 *   https://tiles.mapillary.com/maps/vtp/mly_map_feature_point/2/{z}/{x}/{y}
 * (layer "point", field "value"), filtered to the two classes we care about.
 * Reuses the same NEXT_PUBLIC_MAPILLARY_TOKEN as the imagery coverage layer.
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

export const MAPILLARY_FEATURE_LAYER = {
  MAILBOX: "mapillary-mailbox",
  DRIVEWAY: "mapillary-driveway",
};

// Only show at high zoom (tiles are z14; MapLibre overzooms above that).
const FEATURES_MIN_ZOOM = 16;

export const mailboxLayer = {
  id: MAPILLARY_FEATURE_LAYER.MAILBOX,
  type: "circle",
  source: MAPILLARY_FEATURES_SOURCE_ID,
  "source-layer": MAPILLARY_FEATURES_SOURCE_LAYER,
  minzoom: FEATURES_MIN_ZOOM,
  filter: ["==", ["get", "value"], MAILBOX_VALUE],
  layout: { visibility: "visible" },
  paint: {
    "circle-radius": 6,
    "circle-color": "#1d6fd6", // blue = mailbox
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 2,
  },
};

export const drivewayLayer = {
  id: MAPILLARY_FEATURE_LAYER.DRIVEWAY,
  type: "circle",
  source: MAPILLARY_FEATURES_SOURCE_ID,
  "source-layer": MAPILLARY_FEATURES_SOURCE_LAYER,
  minzoom: FEATURES_MIN_ZOOM,
  filter: ["==", ["get", "value"], DRIVEWAY_VALUE],
  layout: { visibility: "visible" },
  paint: {
    "circle-radius": 6,
    "circle-color": "#7d3cc9", // purple = driveway entrance
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 2,
  },
};

export const mapillaryFeatureLayers = [mailboxLayer, drivewayLayer];
