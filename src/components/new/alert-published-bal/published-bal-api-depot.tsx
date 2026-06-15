import { Paragraph, Strong } from "evergreen-ui";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("publishConflict");
  const client: PublicClient = revision.client;
  const isOutdatedClient = outdatedApiDepotClients.includes(client.id);

  return (
    <>
      <Paragraph marginTop={16}>
        {t.rich("publishedBy", {
          communeName: commune.nom,
          publisher: client.chefDeFile ? client.chefDeFile : client.mandataire,
          s: (chunks) => <Strong>{chunks}</Strong>,
        })}
      </Paragraph>
      {isOutdatedClient ? (
        <Paragraph marginTop={16}>{t("outdatedNoLongerMaintained")}</Paragraph>
      ) : client.chefDeFileEmail ? (
        <Paragraph marginTop={16}>
          {t.rich("recommendContactingEmail", {
            email: client.chefDeFileEmail,
            s: (chunks) => <Strong>{chunks}</Strong>,
          })}
        </Paragraph>
      ) : null}
      <Paragraph marginTop={16}>{t("jurisdictionAuthority")}</Paragraph>
    </>
  );
}

export default PublishedBALApiDepot;
