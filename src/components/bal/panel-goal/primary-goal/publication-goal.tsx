import { useMemo, useState, useContext } from "react";
import {
  Pane,
  Heading,
  Button,
  Paragraph,
  defaultTheme,
  Strong,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import usePublishProcess from "@/hooks/publish-process";
import { CommuneType } from "@/types/commune";
import { ExtendedBaseLocaleDTO, HabilitationDTO } from "@/lib/openapi-api-bal";
import AchievementBadge from "../achievements-badge/achievements-badge";
import { AccordionCard } from "@/components/accordion-card";
import BalDataContext from "@/contexts/bal-data";

interface PublicationGoalProps {
  commune: CommuneType;
  baseLocale: ExtendedBaseLocaleDTO;
}

function PublicationGoal({ commune, baseLocale }: PublicationGoalProps) {
  const t = useTranslations("panels");
  const tc = useTranslations("common");
  const { handleShowHabilitationProcess } = usePublishProcess(commune);
  const { habilitation } = useContext(BalDataContext);
  const [isActive, setIsActive] = useState(
    baseLocale.status === ExtendedBaseLocaleDTO.status.DRAFT
  );

  const handlePublication = (e) => {
    e.stopPropagation();
    handleShowHabilitationProcess();
  };
  const isCompleted = useMemo(() => {
    return (
      baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
      habilitation?.status === HabilitationDTO.status.ACCEPTED
    );
  }, [baseLocale.status, habilitation?.status]);

  const colorCard = useMemo(() => {
    if (baseLocale.status === ExtendedBaseLocaleDTO.status.REPLACED) {
      return defaultTheme.colors.redTint;
    } else if (baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED) {
      if (habilitation?.status === HabilitationDTO.status.ACCEPTED) {
        return defaultTheme.colors.green100;
      } else {
        return defaultTheme.colors.yellow100;
      }
    }
    return defaultTheme.colors.white;
  }, [baseLocale.status, habilitation?.status]);

  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane display="flex" alignItems="center" gap={16} paddingLeft={8}>
            <AchievementBadge
              icone="/static/images/achievements/published-bal.svg"
              title={t("badgeTitle")}
              completed={isCompleted}
            />
            <Heading color={isCompleted && defaultTheme.colors.green700}>
              {t("publication")}
            </Heading>
          </Pane>
        }
        backgroundColor={colorCard}
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        caretPosition="start"
      >
        <Pane padding={8}>
          {baseLocale.status === ExtendedBaseLocaleDTO.status.DRAFT && (
            <Paragraph is="div">
              {t.rich("pubDraftIntro", {
                communeName: commune.nom,
                s: (chunks) => <Strong>{chunks}</Strong>,
                br: () => <br />,
              })}
              <Pane display="flex" justifyContent="right">
                <Button
                  appearance="primary"
                  onClick={(e) => handlePublication(e)}
                  textAlign="center"
                >
                  {tc("publish")}
                </Button>
              </Pane>
            </Paragraph>
          )}
          {baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
            habilitation?.status === HabilitationDTO.status.ACCEPTED && (
              <Paragraph>{t("pubPublishedInfo")}</Paragraph>
            )}
          {baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
            habilitation?.status !== HabilitationDTO.status.ACCEPTED && (
              <Paragraph display="flex" flexDirection="column" gap={8} is="div">
                {t("pubAuthInvalid")}
                <Pane display="flex" justifyContent="right">
                  <Button
                    marginRight={8}
                    height={24}
                    appearance="primary"
                    onClick={handleShowHabilitationProcess}
                  >
                    {t("renewAuthorization")}
                  </Button>
                </Pane>
              </Paragraph>
            )}
          {baseLocale.status === ExtendedBaseLocaleDTO.status.REPLACED && (
            <Pane>
              <Paragraph color={defaultTheme.colors.red700}>
                {t("pubReplaced1")}
              </Paragraph>
              <Paragraph>{t("pubReplaced2")}</Paragraph>
            </Pane>
          )}
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default PublicationGoal;
