import React from "react";
import { Pane, Text, Strong } from "evergreen-ui";
import { HabilitationDTO, StrategyDTO } from "@/lib/openapi-api-bal";

interface RevisionUserProps {
  communeName: string;
  context: {
    nomComplet?: string;
    organisation?: string;
  };
  habilitation: HabilitationDTO;
}

function RevisionUser({
  context,
  habilitation,
  communeName,
}: RevisionUserProps) {
  let userName = context.nomComplet || context.organisation;
  if (!userName) {
    if (
      [StrategyDTO.type.EMAIL, StrategyDTO.type.PROCONNECT].includes(
        habilitation?.strategy?.type
      )
    ) {
      userName = `city hall of ${communeName}`;
    }

    if (habilitation?.strategy?.type === StrategyDTO.type.FRANCECONNECT) {
      userName = `elected official of ${communeName}`;
    }
  }

  return (
    <Pane display="flex" gap={4}>
      <Text>Par</Text>
      {userName ? (
        <Strong>{userName}</Strong>
      ) : (
        <Text fontStyle="italic">Not specified</Text>
      )}
    </Pane>
  );
}

export default React.memo(RevisionUser);
