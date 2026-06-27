import { Signalement } from "@/lib/openapi-signalement";
import { Badge, Pane, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface SignalementParcelleProps {
  parcelles: string[];
  signalementType?: Signalement.type;
}

export function SignalementParcelle({
  parcelles,
  signalementType,
}: SignalementParcelleProps) {
  const t = useTranslations("signalement");
  return parcelles.length > 0 ? (
    <Pane marginTop={10} padding={8} borderRadius={8} className="glass-pane">
      <Text is="div" fontWeight="bold" marginBottom={5}>
        {t("parcelle.label", { count: parcelles.length })}
      </Text>

      {parcelles.map((parcelle) => (
        <Badge
          key={parcelle}
          marginLeft={4}
          color={
            signalementType === Signalement.type.LOCATION_TO_CREATE
              ? "teal"
              : signalementType === Signalement.type.LOCATION_TO_DELETE
                ? "orange"
                : "blue"
          }
        >
          {parcelle}
        </Badge>
      ))}
    </Pane>
  ) : null;
}
