import { Tooltip, Button, ControlIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { PARCELS_AVAILABLE } from "@/components/map/layers/parcels";

interface ParcelControlProps {
  isParcelsDisplayed?: boolean;
  onClick: () => void;
}

function ParcelControl({
  isParcelsDisplayed,
  onClick,
}: ParcelControlProps) {
  const t = useTranslations("mapControls");
  const parcelLabel = isParcelsDisplayed
    ? t("hideParcelData")
    : t("showParcelData");
  return PARCELS_AVAILABLE ? (
    <Tooltip content={parcelLabel}>
      <Button
        style={{ padding: ".8em" }}
        onClick={onClick}
        title={parcelLabel}
      >
        <ControlIcon color={isParcelsDisplayed ? "selected" : "muted"} />
      </Button>
    </Tooltip>
  ) : (
    <Tooltip content={t("parcelNotConfigured")}>
      <Button
        style={{ padding: ".8em" }}
        cursor="not-allowed"
        title={t("parcelNotAvailable")}
      >
        <ControlIcon color="muted" />
      </Button>
    </Tooltip>
  );
}

export default ParcelControl;
