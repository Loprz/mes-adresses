import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { Button, Pane, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";
import NextLink from "next/link";

interface PublishedBALMesAdressesProps {
  revision: Revision;
  commune: CommuneType;
  buttonPosition?: "left" | "right";
}

function PublishedBALMesAdresses({
  revision,
  commune,
  buttonPosition = "left",
}: PublishedBALMesAdressesProps) {
  const t = useTranslations("publishConflict");
  const publishedBALId = revision.context?.extras?.balId || null;

  return (
    <Pane marginLeft={35}>
      <Paragraph marginTop={8}>
        {t("publishedForJurisdiction", { communeName: commune.nom })}
      </Paragraph>
      <Paragraph marginTop={8}>{t("continueFromPublished")}</Paragraph>
      <Pane
        display="flex"
        justifyContent={buttonPosition === "left" ? "start" : "end"}
      >
        <Button
          marginTop={8}
          appearance="primary"
          is={NextLink}
          height={30}
          target="_blank"
          href={`${process.env.NEXT_PUBLIC_EDITEUR_URL}/bal/${publishedBALId}`}
        >
          {t("openPublished")}
        </Button>
      </Pane>
    </Pane>
  );
}

export default PublishedBALMesAdresses;
