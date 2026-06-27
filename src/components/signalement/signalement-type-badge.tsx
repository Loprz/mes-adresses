import { Signalement } from "@/lib/openapi-signalement";
import { Badge } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface SignalementTypeBadgeProps {
  type: Signalement.type;
}

// Colors only — labels live in the `signalement.type` i18n namespace and are
// resolved at render time (see signalementTypeLabelKey).
export const signalementTypeMap = {
  [Signalement.type.LOCATION_TO_CREATE]: {
    color: "teal",
    backgroundColor: "#D3F5F7",
    foregroundColor: "#0F5156",
  },
  [Signalement.type.LOCATION_TO_UPDATE]: {
    color: "purple",
    backgroundColor: "#E7E4F9",
    foregroundColor: "#6E62B6",
  },
  [Signalement.type.LOCATION_TO_DELETE]: {
    color: "orange",
    backgroundColor: "#F8E3DA",
    foregroundColor: "#FFB020",
  },
};

export const signalementTypeLabelKey: Record<Signalement.type, string> = {
  [Signalement.type.LOCATION_TO_CREATE]: "create",
  [Signalement.type.LOCATION_TO_UPDATE]: "update",
  [Signalement.type.LOCATION_TO_DELETE]: "delete",
};

function SignalementTypeBadge({ type }: SignalementTypeBadgeProps) {
  const t = useTranslations("signalement");

  return (
    <Badge
      width="fit-content"
      size="small"
      color={signalementTypeMap[type].color as any}
    >
      {t(`type.${signalementTypeLabelKey[type]}`)}
    </Badge>
  );
}

export default SignalementTypeBadge;
