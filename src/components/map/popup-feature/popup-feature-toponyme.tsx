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
  const { toponymes } = useContext(BalDataContext);

  const toponyme = toponymes.find(
    (topo) => topo.id === feature.properties?.id
  );

  return (
    <Pane display="flex" flexDirection="column">
      <Strong>{feature.properties.nom}</Strong>
      <Text marginBottom="10px">
        {commune.code} - {commune.nom}
      </Text>
      {toponyme.nbNumeros <= 0 ? (
        <Badge color="red">{t("noNumbers")}</Badge>
      ) : toponyme.isAllCertified ? (
        <Badge color="green">{t("allCertified")}</Badge>
      ) : (
        <Badge color="yellow">
          {t("someCertified", {
            certified: toponyme.nbNumerosCertifies,
            total: toponyme.nbNumeros,
          })}
        </Badge>
      )}
    </Pane>
  );
}

export default PopupFeatureVoie;
