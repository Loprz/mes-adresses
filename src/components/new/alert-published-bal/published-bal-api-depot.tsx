import { Alert, Paragraph, Strong } from "evergreen-ui";

import { PublicClient, Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";

interface PublishedBALApiDepotProps {
  revision: Revision;
  outdatedApiDepotClients: string[];
  commune: CommuneType;
}

function PublishedBALApiDepot({
  revision,
  outdatedApiDepotClients,
  commune,
}: PublishedBALApiDepotProps) {
  const client: PublicClient = revision.client;
  const isOutdatedClient = outdatedApiDepotClients.includes(client.id);

  return (
    <>
      <Paragraph marginTop={16}>
        A Local Address Base has already been published by{" "}
        <Strong>
          {client.chefDeFile ? client.chefDeFile : client.mandataire}
        </Strong>{" "}
        for {commune.nom}.
        {isOutdatedClient ? (
          <>
            The published Local Address Base is outdated and no longer
            maintained. You may proceed with creating your LAB.
          </>
        ) : client.chefDeFileEmail ? (
          <>
            We recommend contacting{" "}
            <Strong>{client.chefDeFileEmail}</Strong> before proceeding with the
            creation of your LAB.
          </>
        ) : null}
      </Paragraph>
      <Paragraph marginTop={16}>
        However, the jurisdiction remains the competent addressing authority,
        and you can decide at any time to take back control of LAB publication.
      </Paragraph>
    </>
  );
}

export default PublishedBALApiDepot;
