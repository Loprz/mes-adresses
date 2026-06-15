import { useContext } from "react";
import { Pane, Badge, Text, Strong } from "evergreen-ui";
import { useTranslations } from "next-intl";
import BalDataContext from "@/contexts/bal-data";
import { CommuneType } from "@/types/commune";

interface PopupFeatureNumeroProps {
  feature: {
    geometry: {
      coordinates: number[];
    };
    properties: {
      id: string;
      nom: string;
    };
  };
  commune: CommuneType;
}

function PopupFeatureVoie({ feature, commune }: PopupFeatureNumeroProps) {
  const t = useTranslations("mapPopup");
  const { voies } = useContext(BalDataContext);

  const voie = voies.find((v) => v.id === feature.properties?.id);

  return (
    <Pane display="flex" flexDirection="column">
      <Strong>{feature.properties.nom}</Strong>
      <Text marginBottom="10px">
        {commune.code} - {commune.nom}
      </Text>
      {voie.nbNumeros <= 0 ? (
        <Badge color="red">{t("noNumber")}</Badge>
      ) : voie.isAllCertified ? (
        <Badge color="green">{t("allCertified")}</Badge>
      ) : (
        <Badge color="yellow">
          {t("someCertified", {
            certified: voie.nbNumerosCertifies,
            total: voie.nbNumeros,
          })}
        </Badge>
      )}
    </Pane>
  );
}

export default PopupFeatureVoie;
