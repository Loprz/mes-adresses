"use client";

import { useState, useEffect } from "react";
import {
  Pane,
  Heading,
  Button,
  Text,
  Icon,
  HistoryIcon,
  Spinner,
} from "evergreen-ui";

import { ApiDepotService } from "@/lib/api-depot";

import RevisionComponent from "@/components/sub-header/bal-status/ban-sync/ban-history/revision";
import { Revision } from "@/lib/api-depot/types";
import { BaseLocaleSync } from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";

interface BANHistoryProps {
  baseLocaleId: string;
  syncStatus: BaseLocaleSync.status;
  commune: CommuneType;
}

function BANHistory({ baseLocaleId, syncStatus, commune }: BANHistoryProps) {
  const [revisions, setRevisions] = useState<Revision[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLimited, setIsLimited] = useState(true);

  useEffect(() => {
    async function fetchRevision() {
      const revisions = await ApiDepotService.getRevisions(commune.code);
      const publishedRevisions = revisions
        .filter((r) => r.status === "published")
        .reverse(); // Sort by date

      setRevisions(publishedRevisions);
      setIsLoading(false);
    }

    setIsLoading(true);
    fetchRevision();
  }, [commune.code, syncStatus]);

  return (
    <Pane marginY={8}>
      <Heading is="h3" display="flex" alignItems="center" marginY={8}>
        Update history <Icon icon={HistoryIcon} marginLeft={4} />
      </Heading>

      {isLoading ? (
        <Pane display="flex">
          <Spinner marginRight={8} size={22} />
          <Text fontStyle="italic">Loading history</Text>
        </Pane>
      ) : (
        <>
          <Pane overflowY="scroll" maxHeight={500}>
            {revisions.length > 0 ? (
              <Pane
                display="flex"
                flexDirection="column"
                justifyContent="center"
                gap={4}
              >
                {revisions
                  .slice(0, isLimited ? 3 : revisions.length)
                  .map((revision) => (
                    <RevisionComponent
                      key={revision.id}
                      commune={commune}
                      baseLocaleId={baseLocaleId}
                      revision={revision}
                    />
                  ))}
              </Pane>
            ) : (
              <Text color="muted">No Local Address Bases found</Text>
            )}
          </Pane>

          {revisions.length > 3 && (
            <Pane display="flex" justifyContent="center">
              <Button
                appearance="minimal"
                marginTop={8}
                onClick={() => setIsLimited((isLimited) => !isLimited)}
              >
                {isLimited ? "Show full history" : "Collapse"}
              </Button>
            </Pane>
          )}
        </>
      )}
    </Pane>
  );
}

export default BANHistory;
