import React, { useContext } from "react";
import {
  Signalement,
  VoieChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { Voie, VoiesService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementVoieDiffCard } from "../../signalement-diff/signalement-voie-diff-card";
import LayoutContext from "@/contexts/layout";
import { useTranslations } from "next-intl";

interface SignalementUpdateVoieProps {
  signalement: Signalement;
  author?: Signalement["author"];
  existingLocation: Voie;
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementUpdateVoie({
  signalement,
  author,
  existingLocation,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementUpdateVoieProps) {
  const t = useTranslations("signalement");
  const { nom: existingNom } = existingLocation;
  const { nom } = signalement.changesRequested as VoieChangesRequestedDTO;
  const { pushToast } = useContext(LayoutContext);

  const onAccept = async () => {
    try {
      await VoiesService.updateVoie(existingLocation.id, {
        nom,
      });
      await handleAccept();
    } catch (error) {
      console.error("Error accepting signalement:", error);
      pushToast({
        title: t("form.acceptError"),
        intent: "danger",
      });
    }
  };

  return (
    <>
      <SignalementVoieDiffCard
        title={t("form.currentStreetName")}
        nom={{
          to: existingNom,
        }}
      />
      <SignalementVoieDiffCard
        title={t("form.proposedChange")}
        signalementType={Signalement.type.LOCATION_TO_UPDATE}
        nom={{
          from: existingNom,
          to: nom,
        }}
      />
      <SignalementVoieDiffCard
        title={t("form.streetNameAfterModification")}
        nom={{
          to: nom,
        }}
      />
      <SignalementFormButtons
        author={author}
        onAccept={onAccept}
        onReject={handleReject}
        isLoading={isLoading}
        onClose={handleClose}
      />
    </>
  );
}

export default SignalementUpdateVoie;
