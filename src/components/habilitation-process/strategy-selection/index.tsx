import React from "react";
import { useTranslations } from "next-intl";
import {
  Pane,
  Strong,
  Alert,
  Text,
  Heading,
  PeopleIcon,
  UnorderedList,
  ListItem,
} from "evergreen-ui";

import CodeEmail from "@/components/habilitation-process/strategy-selection/code-email";
import { StrategyDTO } from "@/lib/openapi-api-bal";

interface StrategySelectionStepProps {
  baseLocaleId: string;
  codeCommune: string;
  emailSelected: string;
  setEmailSelected: React.Dispatch<React.SetStateAction<string>>;
  handleStrategy: (strategy: StrategyDTO.type) => void;
}

export function StrategySelectionStep({
  baseLocaleId,
  codeCommune,
  emailSelected,
  setEmailSelected,
  handleStrategy,
}: StrategySelectionStepProps) {
  const t = useTranslations("strategySelection");
  return (
    <Pane>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        background="white"
        padding={16}
        borderRadius={8}
      >
        <Heading is="h2" textAlign="center">
          {t.rich("title", {
            s: (chunks) => <Strong size={400}>{chunks}</Strong>,
          })}
        </Heading>
        <Text marginTop={8} color="muted">
          {t("subtitle")}
        </Text>
      </Pane>

      <Pane marginTop={16} background="white" padding={16} borderRadius={8}>
        <CodeEmail
          baseLocaleId={baseLocaleId}
          codeCommune={codeCommune}
          emailSelected={emailSelected}
          setEmailSelected={setEmailSelected}
          handleStrategy={() => handleStrategy(StrategyDTO.type.EMAIL)}
        />
      </Pane>

      <Pane
        display="flex"
        flexDirection="column"
        background="white"
        padding={16}
        borderRadius={8}
        marginTop={16}
      >
        <Heading>{t("understanding")}</Heading>
        <UnorderedList>
          <ListItem icon={PeopleIcon}>
            <Text size={400}>
              {t.rich("understandingItem", {
                s: (chunks) => <Strong size={400}>{chunks}</Strong>,
              })}
            </Text>
          </ListItem>
        </UnorderedList>
        <Alert title={t("needHelpTitle")} marginTop={16}>
          <Text is="div" marginTop={8}>
            {t.rich("contactUs", {
              link: (chunks) => (
                <a href="mailto:support@nationaladdressplatform.us">{chunks}</a>
              ),
            })}
          </Text>
        </Alert>
      </Pane>
    </Pane>
  );
}
