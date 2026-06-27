import React, { useContext } from "react";
import { ExtendedVoieDTO, Voie, VoiesService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { Signalement } from "@/lib/openapi-signalement";
import LayoutContext from "@/contexts/layout";
import BalDataContext from "@/contexts/bal-data";
import { Alert, Text } from "evergreen-ui";
import { SignalementVoieDiffCard } from "../../signalement-diff/signalement-voie-diff-card";
import { useTranslations } from "next-intl";

interface SignalementDeleteVoieProps {
  author: Signalement["author"];
  existingLocation: ExtendedVoieDTO;
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementDeleteVoie({
  author,
  existingLocation,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementDeleteVoieProps) {
  const t = useTranslations("signalement");
  const { nom, nbNumeros } = existingLocation;
  const { pushToast } = useContext(LayoutContext);
  const { reloadVoies } = useContext(BalDataContext);

  const onAccept = async () => {
    try {
      await VoiesService.softDeleteVoie(existingLocation.id);
      await reloadVoies();
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
        signalementType={Signalement.type.LOCATION_TO_DELETE}
        title={t("form.streetDeletionRequest")}
        nom={{
          to: nom,
        }}
      />
      <Alert intent={nbNumeros > 0 ? "warning" : "info"} flexShrink={0}>
        <Text>
          {t("form.deleteVoiePrefix")} <b>{nom}</b> {t("form.deleteVoieSuffix")}
          {nbNumeros > 0 && (
            <>
              {" "}
              {t("form.deleteVoieAttachedPrefix")}{" "}
              <b>{t("form.addresses", { count: nbNumeros })}</b>{" "}
              {t("form.deleteVoieAttachedSuffix")}
            </>
          )}
        </Text>
      </Alert>
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

export default SignalementDeleteVoie;
