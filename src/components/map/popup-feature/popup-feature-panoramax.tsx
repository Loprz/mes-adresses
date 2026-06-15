import ResponsiveImage from "@/components/responsive-image";
import { Pane } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface PopupFeaturePanoramaxProps {
  feature: {
    properties: {
      id: string;
    };
  };
}

function PopupFeaturePanoramax({ feature }: PopupFeaturePanoramaxProps) {
  const t = useTranslations("mapPopup");
  return (
    <Pane>
      <ResponsiveImage
        alt={t("panoramaxThumbAlt")}
        src={`${process.env.NEXT_PUBLIC_PANORAMAX_API_ENDPOINT}/api/pictures/${feature.properties.id}/thumb.jpg`}
      />
    </Pane>
  );
}

export default PopupFeaturePanoramax;
