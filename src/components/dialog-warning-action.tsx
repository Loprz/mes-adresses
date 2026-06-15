import { Dialog } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface DialogWarningActionProps {
  confirmLabel: string;
  isShown: boolean;
  content: React.ReactNode;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DialogWarningAction({
  confirmLabel,
  isShown = false,
  content,
  isLoading,
  onCancel,
  onConfirm,
}: DialogWarningActionProps) {
  const t = useTranslations("dialogs");
  const tc = useTranslations("common");
  return (
    <Dialog
      isShown={isShown}
      title={t("attention")}
      cancelLabel={tc("cancel")}
      confirmLabel={confirmLabel}
      onCloseComplete={onCancel}
      onCancel={onCancel}
      onConfirm={onConfirm}
      hasCancel={!isLoading}
      hasClose={!isLoading}
      isConfirmLoading={isLoading}
      shouldCloseOnOverlayClick={!isLoading}
      shouldCloseOnEscapePress={!isLoading}
    >
      {content}
    </Dialog>
  );
}

export default DialogWarningAction;
