import { useCallback } from "react";
import { Dialog, Pane, Paragraph, Strong, VideoIcon } from "evergreen-ui";

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
  const onConfirm = useCallback(() => {
    handleConfirm();
    handleCancel(); // Pass isShown to false
  }, [handleConfirm, handleCancel]);

  return (
    <Dialog
      isShown={isShown}
      intent="danger"
      title="⚠️ A very large number of addresses have been deleted"
      cancelLabel="Cancel"
      confirmLabel="Continue"
      onConfirm={onConfirm}
      onCancel={handleCancel}
      onCloseComplete={onClose}
    >
      <Pane>
        <Paragraph>
          You have <Strong>deleted at least 50% of the known addresses</Strong>{" "}
          currently in the National Address Platform.
        </Paragraph>
        <Paragraph marginTop={8}>
          Please remember that your addresses should be published for{" "}
          <Strong>the entire jurisdiction</Strong>.
        </Paragraph>

        <Paragraph marginTop={8}>
          If you are having difficulty using our tool and would like
          assistance,{" "}
          <Strong>
            you can contact us at{" "}
            <a href="mailto:support@nap.us.gov">support@nap.us.gov</a>
          </Strong>
        </Paragraph>
        <Paragraph marginTop={8}>
          <a href={`${PEERTUBE_LINK}/c/base_adresse_locale/videos`}>
            <VideoIcon size={12} /> video tutorials
          </a>{" "}
          are also available to assist you during your
          addressing work.
        </Paragraph>
      </Pane>
    </Dialog>
  );
}

export default MassDeletionDialog;
