import { useContext, useEffect } from "react";
import {
  Pane,
  Button,
  Badge,
  Alert,
  TrashIcon,
  ControlIcon,
  Text,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import ParcellesContext from "@/contexts/parcelles";
import MapContext from "@/contexts/map";

import InputLabel from "@/components/input-label";

interface SelectParcellesProps {
  initialParcelles: string[];
  isToponyme?: boolean;
}

function SelectParcelles({
  initialParcelles = [],
  isToponyme,
}: SelectParcellesProps) {
  const t = useTranslations("editorForm");
  const { isParcelsDisplayed, setIsParcelsDisplayed } =
    useContext(MapContext);
  const {
    highlightedParcelles,
    setHighlightedParcelles,
    setIsParcelleSelectionEnabled,
    hoveredParcelles,
    handleHoveredParcelles,
    handleParcelles,
  } = useContext(ParcellesContext);
  const addressType = isToponyme
    ? t("addressTypePlaceName")
    : t("addressTypeNumber");

  useEffect(() => {
    setHighlightedParcelles(initialParcelles);
    setIsParcelleSelectionEnabled(true);

    return () => {
      setIsParcelleSelectionEnabled(false);
    };
  }, [setHighlightedParcelles, setIsParcelleSelectionEnabled]);

  return (
    <Pane display="flex" flexDirection="column">
      <InputLabel
        title={t("parcelData")}
        help={t("parcelHelp", { addressType })}
      />
      {highlightedParcelles.length > 0 ? (
        <Pane display="grid" gridTemplateColumns="1fr 1fr 1fr">
          {highlightedParcelles.map((parcelle) => {
            const isHovered = hoveredParcelles.some(
              ({ id }) => id === parcelle
            );
            return (
              <Badge
                key={parcelle}
                isInteractive
                color={isHovered ? "red" : "green"}
                margin={4}
                onClick={() => handleParcelles([parcelle])}
                onMouseEnter={() => handleHoveredParcelles([parcelle])}
                onMouseLeave={() => handleHoveredParcelles([])}
              >
                {parcelle}
                {isHovered && (
                  <TrashIcon
                    marginLeft={4}
                    size={14}
                    color="danger"
                    verticalAlign="text-bottom"
                  />
                )}
              </Badge>
            );
          })}
        </Pane>
      ) : (
        <Pane>
          <Alert marginTop={8}>
            <Text>{t("parcelClickHint", { addressType })}</Text>
          </Alert>
        </Pane>
      )}

      <Button
        type="button"
        display="flex"
        justifyContent="center"
        marginTop={8}
        iconAfter={ControlIcon}
        onClick={() => setIsParcelsDisplayed(!isParcelsDisplayed)}
      >
        {isParcelsDisplayed ? t("hideParcelData") : t("showParcelData")}
      </Button>
    </Pane>
  );
}

export default SelectParcelles;
