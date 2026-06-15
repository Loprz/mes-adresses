"use client";

import { useState, useCallback, useContext } from "react";
import { Pane, Dialog, Paragraph, Alert } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import LocalStorageContext from "@/contexts/local-storage";
import TokenContext from "@/contexts/token";

interface RenewTokenDialogProps {
  baseLocaleId: string;
  isShown: boolean;
  setIsShown: (isShown: boolean) => void;
  setError: (error: string) => void;
}

function RenewTokenDialog({
  baseLocaleId,
  isShown,
  setIsShown,
  setError,
}: RenewTokenDialogProps) {
  const t = useTranslations("dialogs");
  const tc = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const { toaster } = useContext(LayoutContext);
  const { addBalAccess } = useContext(LocalStorageContext);
  const { reloadEmails } = useContext(TokenContext);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);

    const renewTokenBaseLocale = toaster(
      () => BasesLocalesService.renewTokenBaseLocale(baseLocaleId),
      t("renewSuccess"),
      t("renewError"),
      (err) => {
        setError(err.message);
      }
    );

    const bal: BaseLocale = await renewTokenBaseLocale();

    addBalAccess(bal.id, bal.token);
    reloadEmails();
    setIsLoading(false);
    setIsShown(false);
  }, [
    baseLocaleId,
    setError,
    setIsShown,
    toaster,
    addBalAccess,
    reloadEmails,
    t,
  ]);

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title={t("renewTitle")}
        intent="success"
        cancelLabel={tc("cancel")}
        confirmLabel={tc("confirm")}
        isConfirmLoading={isLoading}
        onConfirm={() => handleConfirm()}
        onCloseComplete={() => setIsShown(false)}
      >
        <Paragraph>{t("renewBody")}</Paragraph>
        <Alert title={t("irreversibleAction")} marginY={8} intent="warning">
          {t("renewWarning")}
        </Alert>
      </Dialog>
    </Pane>
  );
}

export default RenewTokenDialog;
