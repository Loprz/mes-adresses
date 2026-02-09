import React from "react";
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
          Authorize your <Strong size={400}>Local Address Base</Strong> to
          publish it in the <Strong size={400}>National Address Platform</Strong>.
        </Heading>
        <Text marginTop={8} color="muted">
          Verify your jurisdiction authority by receiving a PIN code at your
          official email address.
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
        <Heading>Understanding authorization</Heading>
        <UnorderedList>
          <ListItem icon={PeopleIcon}>
            <Text size={400}>
              Authorization ensures that the publication is{" "}
              <Strong size={400}>carried out by a competent person</Strong>{" "}
              with authority over addressing matters in this jurisdiction.
            </Text>
          </ListItem>
        </UnorderedList>
        <Alert title="Need help getting authorized?" marginTop={16}>
          <Text is="div" marginTop={8}>
            Contact us at{" "}
            <a href="mailto:support@nationaladdressplatform.us">
              support@nationaladdressplatform.us
            </a>
          </Text>
        </Alert>
      </Pane>
    </Pane>
  );
}
