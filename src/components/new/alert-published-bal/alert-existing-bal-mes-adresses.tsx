import BALRecoveryContext from "@/contexts/bal-recovery";
import { CommuneType } from "@/types/commune";
import { Alert, Button, Pane, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { useContext } from "react";

interface AlertExistingBALMesAdressesProps {
  existingBALCount: number;
  commune: CommuneType;
}

function AlertExistingBALMesAdresses({
  existingBALCount,
  commune,
}: AlertExistingBALMesAdressesProps) {
  const t = useTranslations("publishConflict");
  const { openRecovery } = useContext(BALRecoveryContext);

  return (
    <Alert
      title={t("existingDraftsTitle", { communeName: commune.nom })}
      intent="info"
      marginTop={16}
    >
      <Paragraph marginTop={8}>
        {t.rich("existingDraftsBody", {
          count: existingBALCount,
          communeName: commune.nom,
          b: (chunks) => <b>{chunks}</b>,
        })}
      </Paragraph>
      <Pane marginTop={8} display="flex" gap={8}>
        <Button onClick={() => openRecovery({ commune })} type="button">
          {t("recoverWithEmail")}
        </Button>
      </Pane>
    </Alert>
  );
}

export default AlertExistingBALMesAdresses;
