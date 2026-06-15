"use client";

import { useContext } from "react";
import { Alert, Button, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";
import BALRecoveryContext from "@/contexts/bal-recovery";

function BALRecovery() {
  const { openRecovery } = useContext(BALRecoveryContext);
  const t = useTranslations("dialogs");

  return (
    <Alert>
      <Text>{t("cantFindBal")}</Text>
      <Button
        appearance="primary"
        marginLeft="1em"
        onClick={() => openRecovery()}
      >
        {t("recoverAccess")}
      </Button>
    </Alert>
  );
}

export default BALRecovery;
