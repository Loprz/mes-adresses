"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import {
  BasesLocalesService,
  Numero,
  Toponyme,
  Voie,
  VoiesService,
} from "@/lib/openapi-api-bal";
import {
  NumeroChangesRequestedDTO,
  Signalement,
} from "@/lib/openapi-signalement";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import { useSignalementMapDiffCreation } from "@/components/signalement/hooks/useSignalementMapDiffCreation";
import LayoutContext from "@/contexts/layout";
import BalDataContext from "@/contexts/bal-data";
import { Alert, Link, Paragraph, Text, Pane, Button } from "evergreen-ui";
import useFuse from "@/hooks/fuse";
import NextLink from "next/link";
import { computeCompletNumero } from "@/lib/utils/numero";

interface SignalementCreateNumeroProps {
  signalement: Signalement;
  author?: Signalement["author"];
  voie?: Voie;
  requestedToponyme?: Toponyme;
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementCreateNumero({
  signalement,
  author,
  voie,
  requestedToponyme,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementCreateNumeroProps) {
  const { numero, suffixe, parcelles, positions, nomVoie } =
    signalement.changesRequested as NumeroChangesRequestedDTO;
  const { pushToast } = useContext(LayoutContext);
  const { baseLocale, reloadVoies, voies } = useContext(BalDataContext);
  const [existingVoie, setExistingVoie] = useState<Voie>(voie);
  const [existingNumeros, setExistingNumeros] = useState<Numero[]>();

  const [similarVoies] = useFuse(
    voies,
    0,
    {
      keys: ["nom"],
    },
    nomVoie,
    0.1
  );

  useSignalementMapDiffCreation(
    signalement.changesRequested as NumeroChangesRequestedDTO
  );

  useEffect(() => {
    setExistingVoie(voie);
  }, [voie]);

  useEffect(() => {
    async function fetchNumeros() {
      try {
        const numeros = await VoiesService.findVoieNumeros(existingVoie.id);
        setExistingNumeros(numeros);
      } catch (err) {
        console.error(err);
      }
    }

    if (existingVoie) {
      fetchNumeros();
    }
  }, [existingVoie]);

  const numeroAlreadyExists = useMemo(() => {
    const numeroCompletToBeCreated = computeCompletNumero(numero, suffixe);

    return existingNumeros?.some(
      ({ numeroComplet }) =>
        numeroCompletToBeCreated.trim() === numeroComplet.trim()
    );
  }, [existingNumeros, numero, suffixe]);

  const onAccept = async () => {
    try {
      let newVoie;
      if (!existingVoie) {
        newVoie = await BasesLocalesService.createVoie(baseLocale.id, {
          nom: nomVoie,
        });
      }
      const voieId = existingVoie?.id || newVoie.id;
      await VoiesService.createNumero(voieId, {
        numero,
        suffixe,
        positions: positions as any[],
        parcelles,
        certifie: true,
        toponymeId: requestedToponyme?.id,
      });
      if (!existingVoie) {
        await reloadVoies();
      }
      await handleAccept();
    } catch (error) {
      console.error("Error accepting signalement:", error);
      pushToast({
        title: "Error while accepting'the report.",
        intent: "danger",
      });
    }
  };

  return (
    <>
      <SignalementNumeroDiffCard
        isActive
        signalementType={Signalement.type.LOCATION_TO_CREATE}
        title="Address creation request"
        numero={{
          to: `${numero}${suffixe ? ` ${suffixe}` : ""}`,
        }}
        voie={{
          to: existingVoie?.nom || nomVoie,
        }}
        complement={{
          to: requestedToponyme?.nom,
        }}
        positions={{
          to: positions,
        }}
        parcelles={{
          to: parcelles,
        }}
      />

      {!existingVoie && similarVoies.length === 0 && (
        <Alert flexShrink={0}>
          <Text>
            The new street <b>{nomVoie}</b> will be created by accepting this
            signalement.
          </Text>
        </Alert>
      )}

      {!isLoading && !existingVoie && similarVoies.length > 0 && (
        <Alert
          title="Accepting this report may create a duplicate"
          flexShrink={0}
          intent="warning"
        >
          <Paragraph>
            The Local Address Base contains{" "}
            {similarVoies.length === 1 ? `a street` : `several streets`} dont le
            nom est similaire :
          </Paragraph>

          {similarVoies.map((voie) => (
            <Pane key={voie.id} display="flex" alignItems="center">
              <Link
                is={NextLink}
                href={`/bal/${baseLocale.id}/voies/${voie.id}`}
              >
                {voie.nom}
              </Link>
              <Button
                type="button"
                onClick={() => setExistingVoie(voie)}
                marginLeft={20}
              >
                Add the&apos;address to this street
              </Button>
            </Pane>
          ))}
        </Alert>
      )}

      {!isLoading && numeroAlreadyExists && (
        <Alert
          title="Accepting this report may create a duplicate"
          flexShrink={0}
          intent="warning"
        >
          <Paragraph>
            The street <b>{existingVoie.nom}</b> already has an address at
            number <b>{computeCompletNumero(numero, suffixe)}</b>.
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

export default SignalementCreateNumero;
