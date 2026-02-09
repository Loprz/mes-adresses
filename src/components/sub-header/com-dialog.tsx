import {
  Dialog,
  Pane,
  Heading,
  Strong,
  Paragraph,
  InlineAlert,
  Alert,
} from "evergreen-ui";

interface COMDialogProps {
  baseLocaleId: string;
  handleClose: () => void;
}

function COMDialog({ baseLocaleId, handleClose }: COMDialogProps) {
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
          Publishing your Local Address Base
        </Heading>
        <InlineAlert intent="warning" marginY={16}>
          Your jurisdiction is part of an overseas territory for
          which automatic authentication is currently under
          development.
        </InlineAlert>

        <Alert intent="none" title="Please contact us">
          <Paragraph marginTop={8}>
            In the meantime, in order to publish your addresses in the{" "}
            <Strong>National Address Database</Strong>, you must contact us at
            the following address:{" "}
            <a href="mailto:support@nap.us.gov">adresse@data.gouv.fr</a>.
          </Paragraph>
          <Paragraph>
            In your email, please include the identifier of your
            Local Address Base <Strong>({baseLocaleId})</Strong>.
          </Paragraph>
        </Alert>
      </Pane>
    </Dialog>
  );
}

export default COMDialog;
