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
  const { openRecovery } = useContext(BALRecoveryContext);

  return (
    <Alert
      title={`Unpublished Local Address Bases already exist for ${commune.nom}`}
      intent="info"
      marginTop={16}
    >
      <Paragraph marginTop={8}>
        There are already <b>{existingBALCount} unpublished LAB(s)</b> for{" "}
        {commune.nom}. Anyone can create a LAB. If this is
        a draft from your jurisdiction, perhaps you would like to
        recover it?
      </Paragraph>
      <Pane marginTop={8} display="flex" gap={8}>
        <Button
          onClick={() => openRecovery({ commune })}
          type="button"
        >
          Recover a LAB with an email
        </Button>
      </Pane>
    </Alert>
  );
}

export default AlertExistingBALMesAdresses;
