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
        pour {commune.nom}.
        {isOutdatedClient ? (
          <>
            The published Local Address Base is outdated and no longer
            maintained. You may proceed with creating your LAB.
          </>
        ) : client.chefDeFileEmail ? (
          <>
            We recommend contacting{" "}
            <Strong>{client.chefDeFileEmail}</Strong> avant de poursuivre la
            création de votre BAL.
          </>
        ) : null}
      </Paragraph>
      <Paragraph marginTop={16}>
        La commune reste toutefois l’autorité compétente en matière d’adressage,
        et vous pouvez décider à tout moment de reprendre la main sur la
        publication de votre BAL.
      </Paragraph>
    </>
  );
}

export default PublishedBALApiDepot;
