import { fromJS } from "immutable";

import vectorStyle from "@/components/map/styles/vector.json";
import planIGNStyle from "@/components/map/styles/plan-ign.json";

// US map tile configuration
// Glyphs and tile URLs use environment variables with fallbacks to free open sources
const GLYPHS_URL =
  process.env.NEXT_PUBLIC_MAP_GLYPHS_URL ||
  "https://tiles.stadiamaps.com/fonts/{fontstack}/{range}.pbf";

// Aerial / ortho imagery (e.g. Esri World Imagery, Hexagon statewide, or other tile service)
const ORTHO_TILES_URL =
  process.env.NEXT_PUBLIC_ORTHO_TILES_URL ||
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ORTHO_ATTRIBUTION =
  process.env.NEXT_PUBLIC_ORTHO_ATTRIBUTION ||
  "<a target='_blank' href='https://www.esri.com/'>© Esri</a>";

export const ortho = fromJS({
  version: 8,
  glyphs: GLYPHS_URL,
  sources: {
    "raster-tiles": {
      type: "raster",
      tiles: [ORTHO_TILES_URL],
      tileSize: 256,
      attribution: ORTHO_ATTRIBUTION,
    },
  },
  layers: [
    { id: "simple-tiles", type: "raster", source: "raster-tiles" },
  ],
});

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
