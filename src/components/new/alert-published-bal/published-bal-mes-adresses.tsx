import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { Button, Pane, Paragraph } from "evergreen-ui";
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
  const publishedBALId = revision.context?.extras?.balId || null;

  return (
    <Pane marginLeft={35}>
      <Paragraph marginTop={8}>
        A Local Address Base is already published for {commune.nom}.
      </Paragraph>
      <Paragraph marginTop={8}>
        If you manage this jurisdiction, it is usually better to continue from
        the published LAB rather than replace it with a separate draft.
      </Paragraph>
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
          Open the published Local Address Base
        </Button>
      </Pane>
    </Pane>
  );
}

export default PublishedBALMesAdresses;
