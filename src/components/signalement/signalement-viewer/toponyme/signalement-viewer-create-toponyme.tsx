import React from "react";
import {
  Signalement,
  ToponymeChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { BanCircleIcon, TickCircleIcon } from "evergreen-ui";
import { useSignalementMapDiffCreation } from "../../hooks/useSignalementMapDiffCreation";
import { SignalementToponymeDiffCard } from "../../signalement-diff/signalement-toponyme-diff-card";
import { useTranslations } from "next-intl";

interface SignalementViewerCreateToponymeProps {
  signalement: Signalement;
}

function SignalementViewerCreateToponyme({
  signalement,
}: SignalementViewerCreateToponymeProps) {
  const t = useTranslations("signalement");
  const { changesRequested, status } = signalement;

  const { nom, parcelles, positions } =
    changesRequested as ToponymeChangesRequestedDTO;
  useSignalementMapDiffCreation(
    changesRequested as ToponymeChangesRequestedDTO
  );

  return (
    <SignalementToponymeDiffCard
      title={
        <>
          {t("viewer.placeNameCreationRequest")}{" "}
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
      isActive
      signalementType={Signalement.type.LOCATION_TO_CREATE}
      nom={{
        to: nom,
      }}
      positions={{
        to: positions,
      }}
      parcelles={{
        to: parcelles,
      }}
    />
  );
}

export default SignalementViewerCreateToponyme;
