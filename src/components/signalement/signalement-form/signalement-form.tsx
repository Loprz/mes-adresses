"use client";

import { useContext, useEffect, useState } from "react";
import {
  ExistingLocation,
  NumeroChangesRequestedDTO,
  Signalement,
} from "@/lib/openapi-signalement";
import { ExtendedVoieDTO, Numero, Toponyme, Voie } from "@/lib/openapi-api-bal";
import Form from "../../form";
import SignalementCreateNumero from "./numero/signalement-create-numero";
import SignalementUpdateNumero from "./numero/signalement-update-numero";
import SignalementUpdateVoie from "./voie/signalement-update-voie";
import SignalementUpdateToponyme from "./toponyme/signalement-update-toponyme";
import SignalementDeleteNumero from "./numero/signalement-delete-numero";
import MapContext from "@/contexts/map";
import { SignalementHeader } from "../signalement-header";
import SignalementContext from "@/contexts/signalement";
import { Paragraph } from "evergreen-ui";
import SignalementCreateToponyme from "./toponyme/signalement-create-toponyme";
import { isToponymeChangesRequested } from "@/lib/utils/signalement";
import SignalementDeleteToponyme from "./toponyme/signalement-delete-toponyme";
import SignalementDeleteVoie from "./voie/signalement-delete-voie";

interface SignalementFormProps {
  report: Signalement;
  author?: Signalement["author"];
  existingLocation: Voie | Toponyme | Numero | null;
  requestedLocations: { toponyme?: Toponyme; voie?: Voie };
  onSubmit: (status: Signalement.status, reason?: string) => Promise<void>;
  onClose: () => void;
}

function SignalementForm({
  report,
  author,
  existingLocation,
  requestedLocations,
  onSubmit,
  onClose,
}: SignalementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { map } = useContext(MapContext);
  const { pendingSignalementsCount } = useContext(SignalementContext);

  // Point the map to the location of the report
  useEffect(() => {
    if (!map) {
      return;
    }

    let pointTo = null;

    if (
      (report.changesRequested as NumeroChangesRequestedDTO).positions
        ?.length > 0
    ) {
      const position = (
        report.changesRequested as NumeroChangesRequestedDTO
      ).positions[0];
      pointTo = {
        latitude: position.point.coordinates[1],
        longitude: position.point.coordinates[0],
      };
    } else if ((existingLocation as Numero)?.positions?.length > 0) {
      const position = (existingLocation as Numero).positions[0];
      pointTo = {
        latitude: position.point.coordinates[1],
        longitude: position.point.coordinates[0],
      };
    } else if ((existingLocation as Voie)?.centroid) {
      pointTo = {
        latitude: (existingLocation as Voie).centroid.coordinates[1],
        longitude: (existingLocation as Voie).centroid.coordinates[0],
      };
    }

    if (pointTo) {
      map.flyTo({
        center: [pointTo.longitude, pointTo.latitude],
        offset: [0, 0],
        zoom:
          report.type === Signalement.type.LOCATION_TO_CREATE ||
          report.existingLocation.type === ExistingLocation.type.NUMERO
            ? 20
            : 16.5,
        screenSpeed: 2,
      });
    }
  }, [existingLocation, report, map]);

  const handleSubmit = async (status: Signalement.status, reason?: string) => {
    try {
      setIsLoading(true);
      await onSubmit(status, reason);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    await handleSubmit(Signalement.status.PROCESSED);
  };

  const handleReject = async (reason?: string) => {
    await handleSubmit(Signalement.status.IGNORED, reason);
  };

  return (
    <Form
      editingId={existingLocation?.id}
      closeForm={onClose}
      onFormSubmit={(e) => {
        e.preventDefault();

        return Promise.resolve();
      }}
    >
      <SignalementHeader signalement={report} author={author} />

      {report.type === Signalement.type.LOCATION_TO_CREATE &&
        (isToponymeChangesRequested(report.changesRequested) ? (
          <SignalementCreateToponyme
            report={report}
            author={author}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleClose={onClose}
            isLoading={isLoading}
          />
        ) : (
          <SignalementCreateNumero
            report={report}
            author={author}
            handleClose={onClose}
            handleAccept={handleAccept}
            handleReject={handleReject}
            voie={existingLocation as Voie}
            isLoading={isLoading}
            requestedToponyme={requestedLocations.toponyme}
          />
        ))}

      {report.type === Signalement.type.LOCATION_TO_UPDATE &&
        (report.existingLocation.type === ExistingLocation.type.NUMERO ? (
          <SignalementUpdateNumero
            report={report}
            author={author}
            existingLocation={existingLocation as Numero}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleClose={onClose}
            isLoading={isLoading}
            requestedToponyme={requestedLocations.toponyme}
            requestedVoie={requestedLocations.voie}
          />
        ) : report.existingLocation.type === ExistingLocation.type.VOIE ? (
          <SignalementUpdateVoie
            report={report}
            author={author}
            existingLocation={existingLocation as Voie}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleClose={onClose}
            isLoading={isLoading}
          />
        ) : (
          <SignalementUpdateToponyme
            report={report}
            author={author}
            existingLocation={existingLocation as Toponyme}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleClose={onClose}
            isLoading={isLoading}
          />
        ))}

      {report.type === Signalement.type.LOCATION_TO_DELETE &&
        (report.existingLocation.type ===
        ExistingLocation.type.TOPONYME ? (
          <SignalementDeleteToponyme
            author={author}
            existingLocation={existingLocation as Toponyme}
            handleClose={onClose}
            handleAccept={handleAccept}
            handleReject={handleReject}
            isLoading={isLoading}
          />
        ) : report.existingLocation.type === ExistingLocation.type.VOIE ? (
          <SignalementDeleteVoie
            author={author}
            existingLocation={existingLocation as ExtendedVoieDTO}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleClose={onClose}
            isLoading={isLoading}
          />
        ) : (
          <SignalementDeleteNumero
            author={author}
            existingLocation={existingLocation as Numero}
            handleClose={onClose}
            handleAccept={handleAccept}
            handleReject={handleReject}
            isLoading={isLoading}
          />
        ))}
      <Paragraph textAlign="center">
        Il reste {pendingSignalementsCount} report
        {pendingSignalementsCount === 1 ? "" : "s"} remaining to process
      </Paragraph>
    </Form>
  );
}

export default SignalementForm;
