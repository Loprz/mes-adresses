import DrawContext, { DrawMode } from "@/contexts/draw";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";
import { CrossIcon, IconButton } from "evergreen-ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useContext } from "react";

interface RulerControlProps {
  disabled?: boolean;
}

function RulerControl({ disabled }: RulerControlProps) {
  const t = useTranslations("mapControls");
  const { drawMode, setDrawMode } = useContext(DrawContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  return drawMode === DrawMode.RULER ? (
    <IconButton
      height={29}
      width={29}
      icon={CrossIcon}
      onClick={() => {
        setDrawMode(null);
      }}
      title={t("closeMeasurement")}
    />
  ) : (
    <IconButton
      disabled={disabled}
      onClick={() => {
        setDrawMode(DrawMode.RULER);
        matomoTrackEvent(
          MatomoEventCategory.MAP,
          MatomoEventAction[MatomoEventCategory.MAP].ENABLE_RULER
        );
      }}
      height={29}
      width={29}
      icon={
        <Image
          src="/static/images/ruler.svg"
          alt={t("rulerIconAlt")}
          width={20}
          height={20}
          style={{ opacity: disabled ? 0.4 : 1 }}
        />
      }
      title={t("measureDistance")}
    />
  );
}

export default RulerControl;
