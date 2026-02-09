import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Pane,
  Strong,
  Spinner,
  Text,
  Link,
  Button,
  Image,
  Heading,
  defaultTheme,
  Icon,
  ErrorIcon,
} from "evergreen-ui";
import NextImage from "next/image";
import { BaseLocale } from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";
import { ApiDepotService } from "@/lib/api-depot/index";
import { Revision } from "@/lib/api-depot/types";
import { ApiBalAdminService } from "@/lib/bal-admin";
import { BALWidgetConfig } from "@/lib/bal-admin/type";
import PublishedBALMesAdresses from "@/components/new/alert-published-bal/published-bal-mes-adresses";
import PublishedBALMoissoneur from "@/components/new/alert-published-bal/published-bal-moissoneur";
import PublishedBALApiDepot from "@/components/new/alert-published-bal/published-bal-api-depot";

interface PublishBalStepProps {
  baseLocale: BaseLocale;
  commune: CommuneType;
  handlePublication: () => void;
  isLoadingPublish: boolean;
  handleClose: () => void;
}

function PublishBalStep({
  baseLocale,
  commune,
  handlePublication,
  isLoadingPublish,
  handleClose,
}: PublishBalStepProps) {
  const [isConflicted, setIsConflicted] = useState(false);
  const [isLoadingConflicted, setIsLoadingConflicted] = useState(false);
  const [lastRevision, setLastRevision] = useState<Revision | null>(null);
  const [outdatedApiDepotClients, setOutdatedApiDepotClients] = useState<
    string[]
  >([]);
  const [outdatedHarvestSources, setOutdatedHarvestSources] = useState<
    string[]
  >([]);

  const forcePublication = useCallback(async () => {
    setIsConflicted(false);
    handlePublication();
  }, [handlePublication]);

  // Checks revisions to warn of a conflict
  const checkConflictingRevision = useCallback(async () => {
    let conflicted = false;
    try {
      setIsLoadingConflicted(true);
      const revision = await ApiDepotService.getCurrentRevision(commune.code);
      setLastRevision(revision);
      const publishedBALId = revision.context?.extras?.balId || null;
      conflicted = Boolean(baseLocale.id !== publishedBALId);
      setIsConflicted(conflicted);
    } catch (error) {
      console.error(
        "ERROR: Unable to retrieve revisions for this jurisdiction",
        error.body
      );
    } finally {
      setIsLoadingConflicted(false);
    }

    if (!conflicted) {
      handlePublication();
    } else {
      try {
        const widgetConfig: BALWidgetConfig =
          await ApiBalAdminService.getBALWidgetConfig();
        setOutdatedApiDepotClients(
          widgetConfig?.communes?.outdatedApiDepotClients || []
        );
        setOutdatedHarvestSources(
          widgetConfig?.communes?.outdatedHarvestSources || []
        );
      } catch (error) {
        console.error(
          "ERROR: Unable to retrieve API Depot clients for this jurisdiction",
          error.body
        );
      }
    }
  }, [baseLocale.id, commune.code, handlePublication]);

  useEffect(() => {
    if (baseLocale.sync) {
      // Skip publication step when renewing accreditation
      handleClose();
    } else {
      checkConflictingRevision();
    }
  }, [baseLocale.sync, handleClose, checkConflictingRevision]);

  return (
    <Pane>
      {isLoadingConflicted && (
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={16}
          padding={16}
          borderRadius={8}
        >
          <Spinner size={42} />
          <Text>Checking the National Address Platform...</Text>
        </Pane>
      )}
      {isLoadingPublish && (
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={16}
          padding={16}
          borderRadius={8}
        >
          <Spinner size={42} />
          <Text>Publishing in progress...</Text>
        </Pane>
      )}
      {isConflicted && (
        <Pane display="flex" flexDirection="column" gap={16}>
          <Pane
            width="100%"
            textAlign="center"
            borderRadius={8}
            backgroundColor="white"
            padding={16}
          >
            <Heading size={600} textAlign="center">
              This jurisdiction already has a published Local Address Base.
            </Heading>
          </Pane>
          <Pane
            width="100%"
            borderRadius={8}
            backgroundColor="white"
            border={`1px solid ${defaultTheme.colors.red500}`}
            padding={16}
          >
            <Heading
              size={600}
              is="h3"
              color={defaultTheme.colors.red500}
              display="flex"
              alignItems="center"
              gap={8}
            >
              <Icon icon={ErrorIcon} />
              Are you sure you want to replace it?
            </Heading>
            <Text is="p" marginTop={8}>
              By forcing publication, this Local Address Base{" "}
              <Strong>will replace the one currently in place</Strong>.
            </Text>
            <Pane
              width="100%"
              textAlign="center"
              borderRadius={8}
              backgroundColor="white"
            >
              <Image
                src="/static/images/schema_bals_conflict.png"
                maxHeight={200}
                overflow="hidden"
                alt="Diagram of conflict between the Local Address Base and the National Address Platform"
              />
            </Pane>

            <Pane display="flex" justifyContent="end">
              <Button
                intent="danger"
                appearance="primary"
                onClick={forcePublication}
              >
                Force publication
              </Button>
            </Pane>
          </Pane>
          {lastRevision && (
            <Pane
              width="100%"
              borderRadius={8}
              backgroundColor="white"
              border={`1px solid ${defaultTheme.colors.blue400}`}
              padding={16}
            >
              <Heading
                size={600}
                is="h3"
                color={defaultTheme.colors.blue400}
                display="flex"
                alignItems="center"
                gap={8}
              >
                <Pane position="relative" width={24} height={24}>
                  <NextImage
                    src="/static/images/published-bal-icon.svg"
                    alt="Published Local Address Base icon"
                    width={24}
                    height={24}
                  />
                </Pane>
                Or would you like to continue with the already published LAB?
              </Heading>
              {lastRevision.context.extras?.balId ? (
                <PublishedBALMesAdresses
                  commune={commune}
                  revision={lastRevision}
                  buttonPosition="right"
                />
              ) : lastRevision.context.extras?.sourceId ? (
                <PublishedBALMoissoneur
                  commune={commune}
                  revision={lastRevision}
                  outdatedHarvestSources={outdatedHarvestSources}
                />
              ) : (
                <PublishedBALApiDepot
                  commune={commune}
                  revision={lastRevision}
                  outdatedApiDepotClients={outdatedApiDepotClients}
                />
              )}
            </Pane>
          )}

          <Pane
            display="flex"
            flexDirection="row"
            justifyContent="end"
            gap={16}
          >
            <Button intent="primary" onClick={handleClose}>
              Close
            </Button>
          </Pane>
        </Pane>
      )}
    </Pane>
  );
}

export default PublishBalStep;
