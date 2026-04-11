import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Pane,
  Strong,
  Spinner,
  Text,
  Link,
  Button,
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

interface ConflictDiagramNodeProps {
  title: string;
  description?: string;
  borderColor: string;
  textColor?: string;
  top: string;
  left: string;
  width: string;
  height: string;
}

function ConflictDiagramNode({
  title,
  description,
  borderColor,
  textColor = defaultTheme.colors.gray900,
  top,
  left,
  width,
  height,
}: ConflictDiagramNodeProps) {
  return (
    <Pane
      position="absolute"
      top={top}
      left={left}
      width={width}
      height={height}
      background="white"
      border={`2px solid ${borderColor}`}
      borderRadius={10}
      paddingX={16}
      paddingY={14}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      gap={4}
    >
      <Text size={600} fontWeight={700} color={textColor} whiteSpace="pre-line">
        {title}
      </Text>
      {description && (
        <Text color={defaultTheme.colors.gray700}>{description}</Text>
      )}
    </Pane>
  );
}

function PublicationConflictDiagram() {
  return (
    <Pane
      display="flex"
      flexWrap="wrap"
      gap={16}
      marginTop={20}
      marginBottom={16}
      alignItems="center"
    >
      <Pane
        position="relative"
        flex="1 1 420px"
        border={`1px solid ${defaultTheme.colors.gray300}`}
        borderRadius={8}
        padding={20}
        backgroundColor={defaultTheme.colors.gray50}
        minHeight={304}
      >
        <Pane
          position="absolute"
          top={-14}
          left={18}
          background="white"
          paddingX={8}
        >
          <Text size={500} color={defaultTheme.colors.gray700}>
            Current situation
          </Text>
        </Pane>
        <Pane position="relative" height={260}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <defs>
              <marker
                id="current-panel-green-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path
                  d="M 0 0 L 6 3 L 0 6"
                  fill={defaultTheme.colors.green500}
                />
              </marker>
            </defs>
            <path
              d="M 40 72 C 48 72 50 57 59 57"
              fill="none"
              stroke={defaultTheme.colors.green500}
              strokeWidth="0.7"
              markerEnd="url(#current-panel-green-arrow)"
            />
          </svg>
          <Pane position="relative" width="100%" height="100%">
            <ConflictDiagramNode
              title="New LAB"
              description="in draft"
              borderColor={defaultTheme.colors.gray400}
              textColor={defaultTheme.colors.gray700}
              top="10%"
              left="4%"
              width="35%"
              height="38%"
            />
            <ConflictDiagramNode
              title="Current LAB"
              description="published"
              borderColor={defaultTheme.colors.green500}
              top="56%"
              left="4%"
              width="35%"
              height="38%"
            />
            <ConflictDiagramNode
              title={"National Address\nPlatform"}
              borderColor={defaultTheme.colors.blue400}
              top="10%"
              left="59%"
              width="37%"
              height="80%"
            />
          </Pane>
        </Pane>
      </Pane>

      <Pane
        flex="0 0 28px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <svg width="24" height="18" viewBox="0 0 24 18">
          <defs>
            <marker
              id="diagram-between-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6" fill={defaultTheme.colors.gray400} />
            </marker>
          </defs>
          <path
            d="M 2 9 L 20 9"
            fill="none"
            stroke={defaultTheme.colors.gray400}
            strokeWidth="1.3"
            markerEnd="url(#diagram-between-arrow)"
          />
        </svg>
      </Pane>

      <Pane
        position="relative"
        flex="1 1 420px"
        border={`1px solid ${defaultTheme.colors.gray300}`}
        borderRadius={8}
        padding={20}
        backgroundColor={defaultTheme.colors.gray50}
        minHeight={304}
      >
        <Pane
          position="absolute"
          top={-14}
          left={18}
          background="white"
          paddingX={8}
        >
          <Text size={500} color={defaultTheme.colors.gray700}>
            After force publication
          </Text>
        </Pane>
        <Pane position="relative" height={260}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <defs>
              <marker
                id="future-panel-green-arrow"
                markerWidth="7"
                markerHeight="7"
                refX="5.5"
                refY="3"
                orient="auto"
              >
                <path
                  d="M 0 0 L 6 3 L 0 6"
                  fill={defaultTheme.colors.green500}
                />
              </marker>
            </defs>
            <path
              d="M 40 27 C 47 27 50 34 54 39 S 57 44 59 46"
              fill="none"
              stroke={defaultTheme.colors.green500}
              strokeWidth="0.85"
              strokeLinecap="round"
              markerEnd="url(#future-panel-green-arrow)"
            />
            <path
              d="M 40 72 C 46 72 49 65 52 60 S 54 57 55.8 56"
              fill="none"
              stroke={defaultTheme.colors.red500}
              strokeWidth="0.85"
              strokeLinecap="round"
            />
            <circle
              cx="56.8"
              cy="56.2"
              r="3.8"
              fill="white"
              stroke={defaultTheme.colors.red500}
              strokeWidth="0.75"
            />
            <path
              d="M 55.1 54.5 L 58.5 57.9"
              fill="none"
              stroke={defaultTheme.colors.red500}
              strokeWidth="0.95"
              strokeLinecap="round"
            />
            <path
              d="M 58.5 54.5 L 55.1 57.9"
              fill="none"
              stroke={defaultTheme.colors.red500}
              strokeWidth="0.95"
              strokeLinecap="round"
            />
          </svg>
          <Pane position="relative" width="100%" height="100%">
            <ConflictDiagramNode
              title="New LAB"
              description="published"
              borderColor={defaultTheme.colors.green500}
              top="10%"
              left="4%"
              width="35%"
              height="38%"
            />
            <ConflictDiagramNode
              title="Current LAB"
              description="replaced"
              borderColor={defaultTheme.colors.red500}
              top="56%"
              left="4%"
              width="35%"
              height="38%"
            />
            <ConflictDiagramNode
              title={"National Address\nPlatform"}
              borderColor={defaultTheme.colors.blue400}
              top="10%"
              left="59%"
              width="37%"
              height="80%"
            />
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
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
            <PublicationConflictDiagram />

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
