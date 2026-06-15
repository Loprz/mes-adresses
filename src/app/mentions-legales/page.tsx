"use client";

import { Pane, Heading, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";
import useWindowSize from "@/hooks/useWindowSize";

export default function LegalNotice() {
  const { isMobile } = useWindowSize();
  const t = useTranslations("legalNotice");
  const link = (chunks: React.ReactNode) => (
    <a href="mailto:support@nap.us.gov">{chunks}</a>
  );

  return (
    <>
      <Pane
        fontSize={18}
        {...(isMobile
          ? { padding: 20 }
          : {
              padding: 20,
              marginX: "6em",
              marginY: "2em",
            })}
      >
        <Heading is="h1" fontSize={24} marginBottom={30}>
          {t("title")}
        </Heading>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("aboutTitle")}
          </Heading>

          <Paragraph>{t("aboutBody")}</Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("licenseTitle")}
          </Heading>

          <Paragraph>{t("licenseBody")}</Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("dataSourcesTitle")}
          </Heading>

          <Paragraph>{t("dataSourcesBody")}</Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("accessibilityTitle")}
          </Heading>

          <Paragraph>{t("accessibilityBody")}</Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("reportTitle")}
          </Heading>

          <Paragraph>{t.rich("reportBody", { link })}</Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("securityTitle")}
          </Heading>

          <Paragraph>{t("securityBody1")}</Paragraph>

          <Paragraph>{t("securityBody2")}</Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("privacyTitle")}
          </Heading>

          <Paragraph>{t("privacyBody")}</Paragraph>
        </Pane>
      </Pane>
    </>
  );
}
