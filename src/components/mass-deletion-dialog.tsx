import { useCallback } from "react";
import { Dialog, Pane, Paragraph, Strong, VideoIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import { PEERTUBE_LINK } from "@/components/help/video-container";

interface MassDeletionDialogProps {
  isShown: boolean;
  handleConfirm: () => void;
  handleCancel: () => void;
  onClose: () => void;
}

function MassDeletionDialog({
  isShown,
  handleConfirm,
  handleCancel,
  onClose,
}: MassDeletionDialogProps) {
  const t = useTranslations("dialogs");
  const tc = useTranslations("common");
  const onConfirm = useCallback(() => {
    handleConfirm();
    handleCancel(); // Pass isShown to false
  }, [handleConfirm, handleCancel]);

  return (
    <Dialog
      isShown={isShown}
      intent="danger"
      title={t("massDeleteTitle")}
      cancelLabel={tc("cancel")}
      confirmLabel={t("continue")}
      onConfirm={onConfirm}
      onCancel={handleCancel}
      onCloseComplete={onClose}
    >
      <Pane>
        <Paragraph>
          {t.rich("massDeleteBody1", {
            s: (chunks) => <Strong>{chunks}</Strong>,
          })}
        </Paragraph>
        <Paragraph marginTop={8}>
          {t.rich("massDeleteBody2", {
            s: (chunks) => <Strong>{chunks}</Strong>,
          })}
        </Paragraph>

        <Paragraph marginTop={8}>
          {t.rich("massDeleteBody3", {
            s: (chunks) => <Strong>{chunks}</Strong>,
            link: (chunks) => (
              <a href="mailto:support@nap.us.gov">{chunks}</a>
            ),
          })}
        </Paragraph>
        <Paragraph marginTop={8}>
          {t.rich("massDeleteVideos", {
            link: (chunks) => (
              <a href={`${PEERTUBE_LINK}/c/base_adresse_locale/videos`}>
                <VideoIcon size={12} /> {chunks}
              </a>
            ),
          })}
        </Paragraph>
      </Pane>
    </Dialog>
  );
}

export default MassDeletionDialog;
