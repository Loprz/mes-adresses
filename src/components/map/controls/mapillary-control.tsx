"use client";

import {
  CameraIcon,
  CrossIcon,
  IconButton,
  Pane,
  Tooltip,
  Text,
  Button,
} from "evergreen-ui";
import { useTranslations } from "next-intl";
import type { Map as MaplibreMap } from "maplibre-gl";
import { useContext, useEffect, useState } from "react";
import { CommuneType } from "@/types/commune";
import {
  MAPILLARY_LAYERS_SOURCE,
  MAPILLARY_SOURCE_ID,
} from "../layers/mapillary";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

interface MapillaryControlProps {
  map: MaplibreMap | null;
  setShowMapillary: (show: boolean) => void;
  showMapillary: boolean;
  commune: CommuneType;
}

function MapillaryControl({
  map,
  setShowMapillary,
  showMapillary,
  commune,
}: MapillaryControlProps) {
  const t = useTranslations("mapControls");
  const [disabled, setDisabled] = useState(true);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  useEffect(() => {
    if (map && showMapillary) {
      // Rerender the map to avoid tiles remaining on screen
      map.zoomTo(map.getZoom());
    }
  }, [map, showMapillary]);

  useEffect(() => {
    if (!map) {
      setDisabled(true);
      return;
    }

    const checkMapillaryData = (e) => {
      if (e.sourceId === MAPILLARY_SOURCE_ID && e.isSourceLoaded) {
        const sequences = map?.querySourceFeatures(MAPILLARY_SOURCE_ID, {
          sourceLayer: MAPILLARY_LAYERS_SOURCE.SEQUENCES,
        });

        setDisabled(!(sequences && sequences.length > 0));
      }
    };

    map.on("sourcedata", checkMapillaryData);

    return () => {
      map.off("sourcedata", checkMapillaryData);
    };
  }, [map, commune]);

  const enabledButton = (
    <IconButton
      disabled={disabled}
      onClick={() => {
        setShowMapillary(true);
        matomoTrackEvent(
          MatomoEventCategory.MAP,
          MatomoEventAction[MatomoEventCategory.MAP].ENABLE_MAPILLARY
        );
      }}
      height={29}
      width={29}
      icon={CameraIcon}
      title={t("openStreetView")}
      style={{ color: disabled ? undefined : "#05CB63" }}
    />
  );

  return showMapillary ? (
    <IconButton
      height={29}
      width={29}
      icon={CrossIcon}
      onClick={() => {
        setShowMapillary(false);
      }}
      title={t("closeStreetView")}
    />
  ) : disabled ? (
    <Tooltip
      content={
        <>
          <Pane marginBottom={8}>
            <Text color="white">{t("noPhotography")}</Text>
          </Pane>
          <Button
            is="a"
            size="small"
            href="https://www.mapillary.com/app"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("contributeStreetView")}
          </Button>
        </>
      }
    >
      <div>{enabledButton}</div>
    </Tooltip>
  ) : (
    enabledButton
  );
}

export default MapillaryControl;
