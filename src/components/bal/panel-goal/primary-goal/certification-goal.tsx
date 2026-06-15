import { useState, useContext } from "react";
import {
  Pane,
  Heading,
  Text,
  defaultTheme,
  Paragraph,
  Strong,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import ProgressBar from "@/components/progress-bar";
import Counter from "@/components/counter";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { AccordionCard } from "@/components/accordion-card";
import AchievementBadge from "../achievements-badge/achievements-badge";
import { TilesLayerMode } from "@/components/map/layers/tiles";
import MapContext from "@/contexts/map";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

interface CertificationGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function CertificationGoal({ baseLocale }: CertificationGoalProps) {
  const {
    nbNumeros,
    nbNumerosCertifies,
    isAllCertified: isCompleted,
  } = baseLocale;
  const percentCertified =
    nbNumeros > 0 ? Math.floor((nbNumerosCertifies * 100) / nbNumeros) : 0;

  const t = useTranslations("panels");
  const [isActive, setIsActive] = useState(false);
  const { setTileLayersMode } = useContext(MapContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  const toggleAccordion = () => {
    const isOpen = !isActive;
    setIsActive(isOpen);
    if (isOpen) {
      setTileLayersMode(TilesLayerMode.CERTIFICATION);
      matomoTrackEvent(
        MatomoEventCategory.GAMIFICATION,
        MatomoEventAction[MatomoEventCategory.GAMIFICATION]
          .OPEN_CERTIFICATION_GOAL
      );
    } else {
      setTileLayersMode(TilesLayerMode.VOIE);
    }
  };

  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane paddingLeft={8} width="100%">
            <Pane display="flex" alignItems="center" gap={16}>
              <AchievementBadge
                icone="/static/images/achievements/100-certified.svg"
                title={t("badgeTitle")}
                completed={isCompleted}
              />
              <Heading color={isCompleted && defaultTheme.colors.green700}>
                {t("certification")}
              </Heading>
            </Pane>
            {!isCompleted ? (
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
            ) : (
              <Pane marginTop={16} width="100%">
                <Text>{t("certComplete")}</Text>
              </Pane>
            )}
          </Pane>
        }
        backgroundColor={
          isCompleted ? defaultTheme.colors.green100 : defaultTheme.colors.white
        }
        isActive={isActive}
        onClick={toggleAccordion}
        caretPosition="start"
      >
        <Pane padding={8}>
          <Paragraph>
            {t.rich("certHelp", {
              link: (chunks) => (
                <a
                  href="https://nationaladdressplatform.us/guide/certification"
                  target="_blank"
                  rel="noreferrer"
                >
                  {chunks}
                </a>
              ),
              s: (chunks) => <Strong>{chunks}</Strong>,
            })}
          </Paragraph>
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default CertificationGoal;
