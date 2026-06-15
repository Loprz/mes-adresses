import { Alert, Dialog, Pane } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { BaseLocale } from "@/lib/openapi-api-bal";
import FondDeCarteForm from "./fond-de-carte-form";

interface FondDeCarteDialogProps {
  isShown: boolean;
  onCloseComplete: () => void;
}

export function FondDeCarteDialog({
  isShown,
  onCloseComplete,
}: FondDeCarteDialogProps) {
  const t = useTranslations("settings");
  return (
    <Dialog
      isShown={isShown}
      title={t("addMapBackground")}
      hasFooter={false}
      onCloseComplete={onCloseComplete}
    >
      <Pane paddingBottom={16}>
        <Alert marginBottom={8} intent="none" title={t("howToAddTitle")}>
          {t("howToAddBody")}
        </Alert>
        <FondDeCarteForm />
      </Pane>
    </Dialog>
  );
}

export default FondDeCarteDialog;
