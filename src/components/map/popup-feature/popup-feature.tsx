import { Popup } from "react-map-gl/maplibre";
import PopupFeatureVoie from "./popup-feature-voie";
import PopupFeatureNumero from "./popup-feature-numero";
import { LAYERS_SOURCE } from "@/components/map/layers/tiles";
import { CommuneType } from "@/types/commune";
import PopupFeatureToponyme from "./popup-feature-toponyme";
import PopupFeatureMapillary from "./popup-feature-mapillary";
import { MAPILLARY_LAYERS_SOURCE } from "../layers/mapillary";

interface PopupFeatureProps {
  feature: {
    sourceLayer: string;
    geometry: {
      coordinates: number[];
    };
    properties: any;
  };
  commune: CommuneType;
}

function PopupFeature({ feature, commune }: PopupFeatureProps) {
  return (
    <Popup
      longitude={feature.geometry.coordinates[0]}
      latitude={feature.geometry.coordinates[1]}
      closeButton={false}
      anchor="bottom"
    >
      {feature.sourceLayer === LAYERS_SOURCE.VOIES_POINTS && (
        <PopupFeatureVoie feature={feature} commune={commune} />
      )}
      {feature.sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS && (
        <PopupFeatureNumero feature={feature} commune={commune} />
      )}
      {feature.sourceLayer === LAYERS_SOURCE.TOPONYME_POINTS && (
        <PopupFeatureToponyme feature={feature} commune={commune} />
      )}
      {feature.sourceLayer === MAPILLARY_LAYERS_SOURCE.PICTURES && (
        <PopupFeatureMapillary feature={feature} />
      )}
    </Popup>
  );
}

export default PopupFeature;
