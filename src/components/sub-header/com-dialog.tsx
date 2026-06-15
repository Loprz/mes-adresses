import {
  Dialog,
  Pane,
  Heading,
  Strong,
  Paragraph,
  InlineAlert,
  Alert,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

interface COMDialogProps {
  baseLocaleId: string;
  handleClose: () => void;
}

function COMDialog({ baseLocaleId, handleClose }: COMDialogProps) {
  const t = useTranslations("comDialog");
  return (
    <Dialog
      isShown
      width={1200}
      preventBodyScrolling
      hasHeader={false}
      hasFooter={false}
      onCloseComplete={handleClose}
    >
      <Pane display="flex" flexDirection="column" marginY={16}>
        <Heading size={700} textAlign="center" marginBottom={8}>
          {t("title")}
        </Heading>
        <InlineAlert intent="warning" marginY={16}>
          {t("overseasWarning")}
        </InlineAlert>

        <Alert intent="none" title={t("pleaseContact")}>
          <Paragraph marginTop={8}>
            {t.rich("contactBody", {
              s: (chunks) => <Strong>{chunks}</Strong>,
              link: (chunks) => (
                <a href="mailto:support@nap.us.gov">{chunks}</a>
              ),
            })}
          </Paragraph>
          <Paragraph>
            {t.rich("includeId", {
              id: baseLocaleId,
              s: (chunks) => <Strong>{chunks}</Strong>,
            })}
          </Paragraph>
        </Alert>
      </Pane>
    </Dialog>
  );
}

export default COMDialog;
