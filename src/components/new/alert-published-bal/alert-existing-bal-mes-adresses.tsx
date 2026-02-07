import BALRecoveryContext from "@/contexts/bal-recovery";
import { CommuneType } from "@/types/commune";
import { Alert, Button, Pane, Paragraph } from "evergreen-ui";
import { useContext } from "react";

interface AlertExistingBALMesAdressesProps {
  existingBALCount: number;
  commune: CommuneType;
}

function AlertExistingBALMesAdresses({
  existingBALCount,
  commune,
}: AlertExistingBALMesAdressesProps) {
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  return (
    <Alert
      title={`Unpublished Local Address Bases already exist for ${commune.nom}`}
      intent="info"
      marginTop={16}
    >
      <Paragraph marginTop={8}>
        There are already <b>{existingBALCount} unpublished LAB(s)</b> pour{" "}
        {commune.nom}. Tout le monde peut créer une BAL, s&apos;il s&apos;agit
        d&apos;un brouillon de votre mairie, peut-être souhaitez-vous le
        récupérer ?
      </Paragraph>
      <Pane marginTop={8} display="flex" gap={8}>
        <Button onClick={() => setIsRecoveryDisplayed(true)} type="button">
          Recover a LAB with an email
        </Button>
      </Pane>
    </Alert>
  );
}

export default AlertExistingBALMesAdresses;
