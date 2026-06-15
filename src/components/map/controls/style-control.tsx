"use client";

import { useContext, useMemo, useState, useEffect } from "react";
import { Pane, SelectMenu, Button, Position, LayersIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import ParcelControl from "@/components/map/controls/cadastre-control";
import { CommuneType } from "@/types/commune";
import { MapStyle } from "@/contexts/map";
import LocalStorageContext from "@/contexts/local-storage";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";

interface StyleControlProps {
  style: string;
  handleStyle: (style: MapStyle | string) => void;
  isParcelsDisplayed: boolean;
  handleParcelsToggle: (fn: (show: boolean) => boolean) => void;
  commune: CommuneType;
  baseLocale: ExtendedBaseLocaleDTO;
}

function StyleControl({
  style,
  commune,
  baseLocale,
  handleStyle,
  isParcelsDisplayed,
  handleParcelsToggle,
}: StyleControlProps) {
  const t = useTranslations("mapControls");
  const [showPopover, setShowPopover] = useState(false);
  const { registeredMapStyle, setRegisteredMapStyle } =
    useContext(LocalStorageContext);

  const availableStyles = useMemo(() => {
    const { hasOrtho, hasOpenMapTiles, hasPlanIGN } = commune;
    return [
      {
        label: t("styleAerial"),
        value: MapStyle.ORTHO,
        isAvailable: hasOrtho,
      },
      {
        label: t("styleOSM"),
        value: MapStyle.VECTOR,
        isAvailable: hasOpenMapTiles,
      },
      { label: t("styleTopo"), value: MapStyle.PLAN_IGN, isAvailable: hasPlanIGN },
      ...(baseLocale.settings?.fondsDeCartes?.map((styleMap) => ({
        label: styleMap.name,
        value: styleMap.name,
        isAvailable: true,
      })) || []),
    ].filter(({ isAvailable }) => isAvailable);
  }, [commune, baseLocale.settings.fondsDeCartes, t]);

  const onSelect = (style: MapStyle | string) => {
    const updatedRegisteredMapStyle = registeredMapStyle
      ? { ...registeredMapStyle, [baseLocale.id]: style }
      : { [baseLocale.id]: style };
    setRegisteredMapStyle(updatedRegisteredMapStyle);
    handleStyle(style);
  };

  useEffect(() => {
    if (!availableStyles.find(({ value }) => value === style)) {
      onSelect(availableStyles[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableStyles]);

  return (
    <Pane
      position="absolute"
      display="flex"
      left={22}
      bottom={22}
      border="none"
      elevation={2}
      zIndex={2}
      cursor="pointer"
      onClick={() => setShowPopover(!showPopover)}
    >
      {availableStyles.length > 1 ? (
        <SelectMenu
          closeOnSelect
          position={Position.TOP_LEFT}
          title={t("chooseMapStyle")}
          hasFilter={false}
          height={40 + 33 * availableStyles.length}
          options={availableStyles}
          selected={style}
          onSelect={(item) => onSelect(item.value as MapStyle | string)}
        >
          <Button
            className="map-style-button"
            style={{ borderRadius: "3px 0 0 3px" }}
          >
            <LayersIcon
              style={{ marginRight: ".5em", borderRadius: "0 3px 3px 0" }}
            />
            <div className="map-style-label">
              {availableStyles.find(({ value }) => value === style)?.label}
            </div>
          </Button>
        </SelectMenu>
      ) : (
        <Button
          className="map-style-button"
          style={{ borderRadius: "3px 0 0 3px" }}
        >
          <LayersIcon
            style={{ marginRight: ".5em", borderRadius: "0 3px 3px 0" }}
          />
          <div className="map-style-label">{availableStyles[0].label}</div>
        </Button>
      )}
      <ParcelControl
        isParcelsDisplayed={isParcelsDisplayed}
        onClick={() => handleParcelsToggle((show) => !show)}
      />
    </Pane>
  );
}

export default StyleControl;
