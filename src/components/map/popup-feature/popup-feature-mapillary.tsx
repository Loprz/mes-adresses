import { Pane, Text, CameraIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface PopupFeatureMapillaryProps {
  feature: {
    properties: {
      id: string;
    };
  };
}

function PopupFeatureMapillary(_props: PopupFeatureMapillaryProps) {
  const t = useTranslations("mapPopup");
  return (
    <Pane display="flex" alignItems="center" gap={6} paddingX={4} paddingY={2}>
      <CameraIcon size={12} color="#05CB63" />
      <Text size={300}>{t("mapillaryHint")}</Text>
    </Pane>
  );
}

export default PopupFeatureMapillary;
