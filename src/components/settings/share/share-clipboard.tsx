import {
  Pane,
  TextInputField,
  ClipboardIcon,
  SmallTickIcon,
  IconButton,
} from "evergreen-ui";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

interface ShareClipBoardProps {
  url: string;
}

function ShareClipBoard({ url }: ShareClipBoardProps) {
  const t = useTranslations("settings");
  const [copySuccess, setCopySuccess] = useState(false);
  const textAreaRef = useRef(null);

  function copyToClipboard() {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  }

  return (
    <Pane display="flex" alignItems="end">
      <TextInputField
        label={t("adminLoginLink")}
        ref={textAreaRef}
        flex={1}
        marginBottom={0}
        value={url}
      />

      {copySuccess ? (
        <IconButton
          marginLeft={4}
          icon={SmallTickIcon}
          intent="success"
          title={t("copied")}
        />
      ) : (
        <IconButton
          marginLeft={4}
          icon={ClipboardIcon}
          onClick={copyToClipboard}
          title={t("copyUrl")}
        />
      )}
    </Pane>
  );
}

export default ShareClipBoard;
