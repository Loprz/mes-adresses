import React, { useContext } from "react";
import {
  Signalement,
  ToponymeChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { BasesLocalesService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementToponymeDiffCard } from "../../signalement-diff/signalement-toponyme-diff-card";
import LayoutContext from "@/contexts/layout";
import BalDataContext from "@/contexts/bal-data";
import { useSignalementMapDiffCreation } from "../../hooks/useSignalementMapDiffCreation";
import useFuse from "@/hooks/fuse";
import { Alert, Link, Paragraph } from "evergreen-ui";
import NextLink from "next/link";

interface SignalementCreateToponymeProps {
  signalement: Signalement;
  author?: Signalement["author"];
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementCreateToponyme({
  signalement,
  author,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementCreateToponymeProps) {
  const { nom, parcelles, positions } =
    signalement.changesRequested as ToponymeChangesRequestedDTO;
  const { pushToast } = useContext(LayoutContext);
  const { baseLocale, reloadToponymes, toponymes } = useContext(BalDataContext);

  const [similarToponymes] = useFuse(
    toponymes,
    0,
    {
      keys: ["nom"],
    },
    nom,
    0.1
  );

  useSignalementMapDiffCreation(
    signalement.changesRequested as ToponymeChangesRequestedDTO
  );

  const onAccept = async () => {
    try {
      await BasesLocalesService.createToponyme(baseLocale.id, {
        nom,
        parcelles,
        positions: positions as any[],
      });
      await reloadToponymes();
      await handleAccept();
    } catch (error) {
      console.error("Error accepting signalement:", error);
      pushToast({
        title: "Error while accepting the report.",
        intent: "danger",
      });
    }
  };

  return (
    <>
      <SignalementToponymeDiffCard
        title="Place name creation request"
        signalementType={Signalement.type.LOCATION_TO_CREATE}
        isActive
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
      {!isLoading && similarToponymes.length > 0 && (
        <Alert
          title="Accepting this report may create a duplicate"
          flexShrink={0}
          intent="warning"
        >
          <Paragraph>
            The Local Address Base contains{" "}
            {similarToponymes.length === 1
              ? `a place name`
              : `several place names`}{" "}
            with a similar name:{" "}
            {similarToponymes.map(({ id, nom }) => (
              <Link
                key={id}
                is={NextLink}
                href={`/bal/${baseLocale.id}/toponymes/${id}`}
              >
                {nom}
              </Link>
            ))}
          </Paragraph>
        </Alert>
      )}
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

export default SignalementCreateToponyme;
