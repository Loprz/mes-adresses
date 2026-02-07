"use client";

import { useState, useCallback, useContext } from "react";
import { Pane, Dialog, Paragraph, Alert } from "evergreen-ui";
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
  const [isLoading, setIsLoading] = useState(false);
  const { toaster } = useContext(LayoutContext);
  const { addBalAccess } = useContext(LocalStorageContext);
  const { reloadEmails } = useContext(TokenContext);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);

    const renewTokenBaseLocale = toaster(
      () => BasesLocalesService.renewTokenBaseLocale(baseLocaleId),
      "Authorizations have been renewed successfully",
      "Unable to renew authorizations",
      (err) => {
        setError(err.message);
      }
    );

    const bal: BaseLocale = await renewTokenBaseLocale();

    addBalAccess(bal.id, bal.token);
    reloadEmails();
    setIsLoading(false);
    setIsShown(false);
  }, [baseLocaleId, setError, setIsShown, toaster, addBalAccess, reloadEmails]);

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Renew authorizations"
        intent="success"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        isConfirmLoading={isLoading}
        onConfirm={() => handleConfirm()}
        onCloseComplete={() => setIsShown(false)}
      >
        <Paragraph>
          You have removed one or more collaborators. Do you wish to
          proceed with renewing the authorizations ?
        </Paragraph>
        <Alert title="Irreversible action" marginY={8} intent="warning">
          You will no longer be able to modify the Local Address Base until you
          receive the new authorization by email.
        </Alert>
      </Dialog>
    </Pane>
  );
}

export default RenewTokenDialog;
