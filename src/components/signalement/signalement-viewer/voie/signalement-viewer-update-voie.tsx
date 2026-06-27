import React from "react";
import {
  ExistingVoie,
  Signalement,
  VoieChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { SignalementVoieDiffCard } from "../../signalement-diff/signalement-voie-diff-card";
import { BanCircleIcon, TickCircleIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface SignalementViewerUpdateVoieProps {
  signalement: Signalement;
}

function SignalementViewerUpdateVoie({
  signalement,
}: SignalementViewerUpdateVoieProps) {
  const t = useTranslations("signalement");
  const { existingLocation, changesRequested, status } = signalement;
  const { nom: existingNom } = existingLocation as ExistingVoie;
  const { nom } = changesRequested as VoieChangesRequestedDTO;

  return (
    <>
      <SignalementVoieDiffCard
        title={t("viewer.streetNameBefore")}
        nom={{
          to: existingNom,
        }}
      />
      <SignalementVoieDiffCard
        title={
          <>
            {t("viewer.updateRequest")}{" "}
            {status === Signalement.status.PROCESSED
              ? t("viewer.accepted")
              : t("viewer.rejected")}
            {status === Signalement.status.PROCESSED ? (
              <TickCircleIcon size={20} color="success" marginLeft={10} />
            ) : (
              <BanCircleIcon size={20} color="danger" marginLeft={10} />
            )}
          </>
        }
        signalementType={Signalement.type.LOCATION_TO_UPDATE}
        nom={{
          from: existingNom,
          to: nom,
        }}
      />
    </>
  );
}

export default SignalementViewerUpdateVoie;
