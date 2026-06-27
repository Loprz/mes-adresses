import { Tooltip, Button, HomeIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface BuildingsControlProps {
  isBuildingsDisplayed?: boolean;
  onClick: () => void;
}

function BuildingsControl({
  isBuildingsDisplayed,
  onClick,
}: BuildingsControlProps) {
  const t = useTranslations("mapControls");
  const label = isBuildingsDisplayed
    ? t("hideBuildingData")
    : t("showBuildingData");
  return (
    <Tooltip content={label}>
      <Button style={{ padding: ".8em" }} onClick={onClick} title={label}>
        <HomeIcon color={isBuildingsDisplayed ? "selected" : "muted"} />
      </Button>
    </Tooltip>
  );
}

export default BuildingsControl;
