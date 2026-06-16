// Mapillary street-level imagery coverage (replaces Panoramax).
// Coverage vector tiles: https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}
// Source layers: "sequence" (lines) and "image" (points; feature.id = image id).
// Requires a Mapillary access token in NEXT_PUBLIC_MAPILLARY_TOKEN.

export const MAPILLARY_SOURCE_ID = "mapillary";

export const MAPILLARY_TOKEN = process.env.NEXT_PUBLIC_MAPILLARY_TOKEN;

export const MAPILLARY_TILE_URL =
  MAPILLARY_TOKEN && MAPILLARY_TOKEN.trim() !== ""
    ? `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=${MAPILLARY_TOKEN}`
    : null;

export const MAPILLARY_LAYERS_SOURCE = {
  SEQUENCES: "sequence",
  PICTURES: "image",
};

export const MAPILLARY_SEQUENCE_LAYER_ID = "mapillary sequence";
export const MAPILLARY_PICTURE_LAYER_ID = "mapillary image";

// Deep link to the Mapillary web viewer focused on a given image.
export const mapillaryViewerUrl = (imageId: string) =>
  `https://www.mapillary.com/app/?pKey=${imageId}&focus=photo`;

export const mapillarySequenceLayer = {
  id: MAPILLARY_SEQUENCE_LAYER_ID,
  "source-layer": MAPILLARY_LAYERS_SOURCE.SEQUENCES,
  interactive: false,
  type: "line",
  paint: {
    "line-color": "#05CB63", // Mapillary green
    "line-width": 4,
  },
  layout: {
    "line-join": "round",
  },
};

export const mapillaryPictureLayer = {
  id: MAPILLARY_PICTURE_LAYER_ID,
  "source-layer": MAPILLARY_LAYERS_SOURCE.PICTURES,
  type: "circle",
  interactive: true,
  paint: {
    "circle-color": "#05CB63",
    "circle-radius": {
      stops: [
        [12, 0.8],
        [17, 6],
      ],
    },
    "circle-stroke-color": "#f8f4f0",
    "circle-stroke-width": {
      stops: [
        [12, 0.3],
        [17, 0.8],
      ],
    },
  },
};
