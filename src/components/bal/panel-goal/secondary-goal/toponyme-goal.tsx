import {
  Pane,
  Heading,
  Paragraph,
  defaultTheme,
  AddIcon,
  Button,
  IconButton,
  TrashIcon,
} from "evergreen-ui";
import NextLink from "next/link";
import { useContext, useState } from "react";

import BalDataContext from "@/contexts/bal-data";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { AccordionCard } from "@/components/accordion-card";
import AchievementBadge from "../achievements-badge/achievements-badge";
import Counter from "@/components/counter";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

interface LangGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
  onIgnoreGoal: () => void;
}

function LangGoal({ baseLocale, onIgnoreGoal }: LangGoalProps) {
  const [isActive, setIsActive] = useState(false);
  const { toponymes } = useContext(BalDataContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  const nbNumerosWithToponymes = toponymes.reduce(
    (acc, toponyme) => acc + toponyme.nbNumeros,
    0
  );
  const hasToponymes = toponymes.length > 0;
  const isCompleted = toponymes.length > 0 && nbNumerosWithToponymes > 0;

  const toggleAccordion = () => {
    const isOpen = !isActive;
    setIsActive(isOpen);
    if (isOpen) {
      matomoTrackEvent(
        MatomoEventCategory.GAMIFICATION,
        MatomoEventAction[MatomoEventCategory.GAMIFICATION].OPEN_TOPONYME_GOAL
      );
    }
  };

  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane paddingLeft={8} width="100%">
            <Pane
              display="flex"
              alignItems="center"
              gap={16}
              justifyContent="space-between"
            >
              <Pane display="flex" alignItems="center" gap={16}>
                <AchievementBadge
                  icone="/static/images/achievements/panneau-directionnel.png"
                  title="Publication"
                  completed={isCompleted}
                />
                <Heading color={isCompleted && defaultTheme.colors.green700}>
                  Place Names / Supplements
                </Heading>
              </Pane>
              {!hasToponymes && (
                <IconButton
                  icon={TrashIcon}
                  title="Remove goal"
                  appearance="minimal"
                  intent="danger"
                  onClick={onIgnoreGoal}
                />
              )}
            </Pane>
            {hasToponymes ? (
              <Pane display="flex" justifyContent="start">
                <Counter
                  label={`place name${
                    toponymes.length > 1 ? "s" : ""
                  } / supplement${toponymes.length > 1 ? "s" : ""}`}
                  value={toponymes.length}
                  color={defaultTheme.colors.orange700}
                />
                <Counter
                  label={`number${
                    nbNumerosWithToponymes > 1 ? "s" : ""
                  } associated`}
                  value={nbNumerosWithToponymes}
                  color={defaultTheme.colors.orange700}
                />
              </Pane>
            ) : (
              <Pane marginTop={16}>
                <Paragraph>
                  Enhance the addressing of your jurisdiction by entering
                  your supplementary place names and streets without addresses.
                </Paragraph>
                <Button
                  marginTop={16}
                  title="Add a place name"
                  is={NextLink}
                  appearance="primary"
                  intent="success"
                  href={`/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/new`}
                  width="100%"
                >
                  Create a supplementary place name or a street without addresses
                  <AddIcon marginLeft={8} />
                </Button>
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
        {hasToponymes && (
          <Pane padding={8}>
            <Paragraph>
              Preserve your hamlet and historical place names.
              Associate them with numbers as address supplements.
            </Paragraph>
          </Pane>
        )}
      </AccordionCard>
    </Pane>
  );
}

export default LangGoal;
