import React from "react";
import { Pane, Text, Strong } from "evergreen-ui";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("balStatus");
  let userName = context.nomComplet || context.organisation;
  if (!userName) {
    if (habilitation?.strategy?.type === StrategyDTO.type.EMAIL) {
      userName = t("jurisdictionOf", { communeName });
    }
  }

  return (
    <Pane display="flex" gap={4}>
      <Text>{t("by")}</Text>
      {userName ? (
        <Strong>{userName}</Strong>
      ) : (
        <Text fontStyle="italic">{t("notSpecified")}</Text>
      )}
    </Pane>
  );
}

export default React.memo(RevisionUser);
