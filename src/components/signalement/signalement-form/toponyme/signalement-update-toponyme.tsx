import React, { useContext } from "react";
import {
  Signalement,
  ToponymeChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { Toponyme, ToponymesService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementToponymeDiffCard } from "../../signalement-diff/signalement-toponyme-diff-card";
import { ActiveCardEnum } from "@/lib/utils/signalement";
import { useSignalementMapDiffUpdate } from "@/components/signalement/hooks/useSignalementMapDiffUpdate";
import LayoutContext from "@/contexts/layout";
import { useTranslations } from "next-intl";

interface SignalementUpdateToponymeProps {
  signalement: Signalement;
  author?: Signalement["author"];
  existingLocation: Toponyme;
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementUpdateToponyme({
  signalement,
  author,
  existingLocation,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementUpdateToponymeProps) {
  const {
    nom: existingNom,
    positions: existingPositions,
    parcelles: existingParcelles,
  } = existingLocation;

  const { nom, parcelles, positions } =
    signalement.changesRequested as ToponymeChangesRequestedDTO;
  const t = useTranslations("signalement");
  const { pushToast } = useContext(LayoutContext);

  const { activeCard, setActiveCard } = useSignalementMapDiffUpdate(
    { positions: existingPositions, parcelles: existingParcelles },
    { positions, parcelles }
  );

  const onAccept = async () => {
    try {
      await ToponymesService.updateToponyme(existingLocation.id, {
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
      <SignalementToponymeDiffCard
        title={t("form.currentPlaceName")}
        isActive={activeCard === ActiveCardEnum.INITIAL}
        nom={{
          to: existingNom,
        }}
        positions={{
          to: existingPositions,
        }}
        parcelles={{
          to: existingParcelles,
        }}
        onClick={() => {
          setActiveCard(ActiveCardEnum.INITIAL);
        }}
      />
      <SignalementToponymeDiffCard
        title={t("form.proposedChange")}
        isActive={activeCard === ActiveCardEnum.CHANGES}
        signalementType={Signalement.type.LOCATION_TO_UPDATE}
        nom={{
          from: existingNom,
          to: nom,
        }}
        positions={{
          from: existingPositions,
          to: positions,
        }}
        parcelles={{
          from: existingParcelles,
          to: parcelles,
        }}
        onClick={() => {
          setActiveCard(ActiveCardEnum.CHANGES);
        }}
      />
      <SignalementToponymeDiffCard
        title={t("form.placeNameAfterModification")}
        isActive={activeCard === ActiveCardEnum.FINAL}
        nom={{
          to: nom,
        }}
        positions={{
          to: positions,
        }}
        parcelles={{
          to: parcelles,
        }}
        onClick={() => {
          setActiveCard(ActiveCardEnum.FINAL);
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

export default SignalementUpdateToponyme;
