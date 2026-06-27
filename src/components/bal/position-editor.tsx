import { useCallback, useEffect, useContext, useMemo } from "react";
import {
  Strong,
  Pane,
  Heading,
  Button,
  AddIcon,
  FormField,
  Alert,
  Text,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import MarkersContext from "@/contexts/markers";

import InputLabel from "@/components/input-label";
import PositionItem from "./position-item";
import { Position } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";

interface PositionEditorProps {
  initialPositions: any[];
  isToponyme?: boolean;
  validationMessage?: string;
}

function PositionEditor({
  initialPositions,
  isToponyme,
  validationMessage,
}: PositionEditorProps) {
  const t = useTranslations("editorForm");
  const { isMobile, setIsMapFullscreen } = useContext(LayoutContext);
  const {
    markers,
    addMarker,
    updateMarker,
    removeMarker,
    disableMarkers,
    pendingBuildingPlacement,
  } = useContext(MarkersContext);

  const handleAddMarker = useCallback(() => {
    addMarker({
      type: isToponyme ? Position.type.SEGMENT : Position.type.ENTR_E,
    });
    if (isMobile) {
      setIsMapFullscreen(true);
    }
  }, [isToponyme, addMarker, isMobile, setIsMapFullscreen]);

  useEffect(() => {
    if (initialPositions) {
      const positions = initialPositions.map((position) => ({
        id: position.id,
        longitude: position.point.coordinates[0],
        latitude: position.point.coordinates[1],
        type: position.type,
      }));
      positions.forEach((position) => addMarker(position));
    } else if (pendingBuildingPlacement && !isToponyme) {
      // Seed the address on the clicked Overture building footprint, typed as
      // "bâtiment" (building). The GERS link is read at submit by NumeroEditor.
      addMarker({
        longitude: pendingBuildingPlacement.longitude,
        latitude: pendingBuildingPlacement.latitude,
        type: Position.type.B_TIMENT,
      });
      if (isMobile) {
        setIsMapFullscreen(true);
      }
    } else {
      handleAddMarker();
    }

    return () => {
      disableMarkers();
    };

    // Remove addMarker and handleAddMarker from hooks to prevent useEffect running when viewport changing
  }, [initialPositions, disableMarkers]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FormField label="" validationMessage={validationMessage}>
      <InputLabel title={t("positions")} />
      {markers.length > 0 ? (
        <Pane display="grid" gridTemplateColumns="2fr .5fr 1fr 1fr .5fr">
          <Strong fontWeight={400} paddingBottom=".5em">
            {t("typeColumn")}
          </Strong>
          <div />
          <Strong fontWeight={400}>{t("latitude")}</Strong>
          <Strong fontWeight={400}>{t("longitude")}</Strong>
          <div />

          {markers
            .filter(({ isDisabled }) => !isDisabled)
            .map((marker) => (
              <PositionItem
                key={marker.id}
                marker={marker}
                isRemovable={markers.length === 1}
                handleChange={updateMarker}
                onRemove={removeMarker}
              />
            ))}
        </Pane>
      ) : (
        <Pane paddingBottom=".5em" textAlign="center">
          <Heading size={400}>{t("noPosition")}</Heading>
        </Pane>
      )}

      <Button
        type="button"
        iconBefore={AddIcon}
        appearance="primary"
        intent="success"
        width="100%"
        marginBottom={0}
        display="flex"
        justifyContent="center"
        onClick={handleAddMarker}
      >
        {t("addPosition", {
          addressType: isToponyme
            ? t("addressTypePlaceName")
            : t("addressTypeNumber"),
        })}
      </Button>
    </FormField>
  );
}

export default PositionEditor;
