import React from "react";
import { Pane, Alert, Text, Button } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface BALReadOnlyProps {
  openRecoveryDialog: () => void;
}

function BALReadOnly({ openRecoveryDialog }: BALReadOnlyProps) {
  const t = useTranslations("panels");
  return (
    <Pane backgroundColor="white" padding={8}>
      <Alert intent="warning" title={t("readOnlyTitle")}>
        <Text is="p">{t("readOnlyBody1")}</Text>
        <Text is="p">{t("readOnlyBody2")}</Text>
        <Button appearance="primary" onClick={openRecoveryDialog}>
          {t("recoverAdminAccess")}
        </Button>
      </Alert>
    </Pane>
  );
}

export default BALReadOnly;
