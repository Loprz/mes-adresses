import { Paragraph, Strong } from "evergreen-ui";

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
        A Local Address Base is already published for {commune.nom} by{" "}
        <Strong>
          {client.chefDeFile ? client.chefDeFile : client.mandataire}
        </Strong>.
      </Paragraph>
      {isOutdatedClient ? (
        <Paragraph marginTop={16}>
          That published LAB appears outdated and is no longer maintained. You
          may continue creating this LAB if you need to replace it.
        </Paragraph>
      ) : client.chefDeFileEmail ? (
        <Paragraph marginTop={16}>
          We recommend contacting <Strong>{client.chefDeFileEmail}</Strong>{" "}
          before replacing it so there is no overlap between two competing
          LABs.
        </Paragraph>
      ) : null}
      <Paragraph marginTop={16}>
        Your jurisdiction remains the official local addressing authority, so
        you can decide at any time to take over publication directly.
      </Paragraph>
    </>
  );
}

export default PublishedBALApiDepot;
