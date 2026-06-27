import ProductTour from "@/components/product-tour";
import { Heading, Pane, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";

export default function SignalementProductTour() {
  const t = useTranslations("signalement");

  const steps = [
    {
      target: "body",
      placement: "center",
      content: (
        <Pane>
          <Heading size={800}>{t("tour.step1Title")}</Heading>
          <Paragraph margin={20} textAlign="justify">
            {t("tour.step1Text")}
          </Paragraph>
        </Pane>
      ),
    },
    {
      target: "div[class^='main-tabs_tabsList'] > a:last-child",
      content: (
        <Pane>
          <Paragraph>{t("tour.step2")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 15,
      callback: () => {
        const element = document.querySelector(
          "div[class^='main-tabs_tabsList'] > a:last-child"
        ) as HTMLElement | null;
        if (element) {
          element.click();
        } else {
          console.warn(
            "Element not found: div[class^='main-tabs_tabsList'] > a:last-child"
          );
        }
      },
    },
    {
      target: "div[role='tablist'] > span:nth-child(1)",
      content: (
        <Pane>
          <Paragraph>{t("tour.step3")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 5,
    },
    {
      target: "div[role='tablist'] > span:nth-child(2)",
      content: (
        <Pane>
          <Paragraph>{t("tour.step4")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 5,
    },
    {
      target: `input[placeholder='${t("list.searchPlaceholder")}']`,
      content: (
        <Pane>
          <Paragraph>{t("tour.step5")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 20,
    },
    {
      target: ".filter-button",
      content: (
        <Pane>
          <Paragraph>{t("tour.step6")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 5,
    },
    {
      target: ".main-table-cell",
      content: (
        <Pane>
          <Paragraph>{t("tour.step7")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 5,
    },
    {
      target: ".maplibregl-marker",
      content: (
        <Pane>
          <Paragraph>{t("tour.step8")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 5,
    },
  ];

  return <ProductTour steps={steps} localStorageKey="signalement" />;
}
