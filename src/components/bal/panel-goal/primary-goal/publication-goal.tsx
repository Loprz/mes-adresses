import { useMemo, useState, useContext } from "react";
import {
  Pane,
  Heading,
  Button,
  Paragraph,
  defaultTheme,
  Strong,
} from "evergreen-ui";

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
              title="Publication"
              completed={isCompleted}
            />
            <Heading color={isCompleted && defaultTheme.colors.green700}>
              Publication
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
              To be synchronized with the National Address Platform,
              this Local Address Base must be published by the jurisdiction of{" "}
              {commune.nom}.
              <br />
              Note that once published,{" "}
              <Strong>
                all changes will automatically be uploaded
              </Strong>{" "}
              to the National Address Platform.
              <Pane display="flex" justifyContent="right">
                <Button
                  appearance="primary"
                  onClick={(e) => handlePublication(e)}
                  textAlign="center"
                >
                  Publish
                </Button>
              </Pane>
            </Paragraph>
          )}
          {baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
            habilitation?.status === HabilitationDTO.status.ACCEPTED && (
              <Paragraph>
                All changes will automatically be uploaded to the
                National Address Platform
              </Paragraph>
            )}
          {baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
            habilitation?.status !== HabilitationDTO.status.ACCEPTED && (
              <Paragraph display="flex" flexDirection="column" gap={8} is="div">
                Your authorization is no longer valid. Renew it to resume
                automatic updates to the National Address Platform.
                <Pane display="flex" justifyContent="right">
                  <Button
                    marginRight={8}
                    height={24}
                    appearance="primary"
                    onClick={handleShowHabilitationProcess}
                  >
                    Renew authorization
                  </Button>
                </Pane>
              </Paragraph>
            )}
          {baseLocale.status === ExtendedBaseLocaleDTO.status.REPLACED && (
            <Pane>
              <Paragraph color={defaultTheme.colors.red700}>
                A different Local Address Base is currently published for this
                jurisdiction, so this LAB is no longer syncing with the
                National Address Platform.
              </Paragraph>
              <Paragraph>
                If you need to take over publication, contact the
                administrators of the published LAB or email
                support@nap.us.gov.
              </Paragraph>
            </Pane>
          )}
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default PublicationGoal;
