import { Alert, Strong, Link, Text, Button, Pane } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface PublishBalRejectedStepProps {
  handleClose: () => void;
}

function PublishBalRejectedStep({ handleClose }: PublishBalRejectedStepProps) {
  const t = useTranslations("publishBalRejected");
  const tc = useTranslations("common");
  return (
    <Pane display="flex" flexDirection="column" gap={16}>
      <Alert intent="danger" title={t("title")} marginTop={16} width="100%">
        <Text is="div" color="muted" marginTop={8}>
          {t.rich("body", {
            s: (chunks) => <Strong>{chunks}</Strong>,
            link: (chunks) => (
              <Link href="mailto:support@nationaladdressplatform.us">
                {chunks}
              </Link>
            ),
          })}
        </Text>
      </Alert>

      <Pane display="flex" flexDirection="row" justifyContent="end" gap={16}>
        <Button intent="primary" onClick={handleClose}>
          {tc("close")}
        </Button>
      </Pane>
    </Pane>
  );
}

export default PublishBalRejectedStep;
