import { Tooltip, Button, MapMarkerIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface MapillaryFeaturesControlProps {
  isDisplayed?: boolean;
  onClick: () => void;
}

function MapillaryFeaturesControl({
  isDisplayed,
  onClick,
}: MapillaryFeaturesControlProps) {
  const t = useTranslations("mapControls");
  const label = isDisplayed
    ? t("hideMapillaryFeatures")
    : t("showMapillaryFeatures");
  return (
    <Tooltip content={label}>
      <Button style={{ padding: ".8em" }} onClick={onClick} title={label}>
        <MapMarkerIcon color={isDisplayed ? "selected" : "muted"} />
      </Button>
    </Tooltip>
  );
}

export default MapillaryFeaturesControl;
