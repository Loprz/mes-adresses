import React from "react";
import {
  Pane,
  Alert,
  Text,
  Button,
  defaultTheme,
  Paragraph,
} from "evergreen-ui";
import { useTranslations } from "next-intl";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import Counter from "../counter";
import ProgressBar from "../progress-bar";

interface CertificationInfosProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function CertificationInfos({ baseLocale }: CertificationInfosProps) {
  const t = useTranslations("panels");
  const {
    nbNumeros,
    nbNumerosCertifies,
    isAllCertified: isCompleted,
  } = baseLocale;
  const percentCertified =
    nbNumeros > 0 ? Math.floor((nbNumerosCertifies * 100) / nbNumeros) : 0;
  return (
    <Pane backgroundColor="white" padding={8}>
      <Alert
        intent="info"
        title={t("certification")}
        marginBottom={15}
        hasIcon={false}
      >
        <Pane width="100%">
          <ProgressBar percent={percentCertified} />
          <Pane display="flex" justifyContent="center">
            <Counter
              label={t("certifiedAddresses")}
              value={nbNumerosCertifies}
              color={defaultTheme.colors.green500}
            />
            <Counter
              label={t("uncertifiedAddresses")}
              value={nbNumeros - nbNumerosCertifies}
              color={defaultTheme.colors.gray500}
            />
          </Pane>
        </Pane>
        <Paragraph>{t("certInfoProse")}</Paragraph>
      </Alert>
    </Pane>
  );
}

export default CertificationInfos;
