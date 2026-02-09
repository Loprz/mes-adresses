import { Alert, Strong, Link, Text, Button, Pane } from "evergreen-ui";

interface PublishBalRejectedStepProps {
  handleClose: () => void;
}

function PublishBalRejectedStep({ handleClose }: PublishBalRejectedStepProps) {
  return (
    <Pane display="flex" flexDirection="column" gap={16}>
      <Alert
        intent="danger"
        title="Your Local Address Base could not be published"
        marginTop={16}
        width="100%"
      >
        <Text is="div" color="muted" marginTop={8}>
          We recommend{" "}
          <Strong>
            contacting the administrators of the other Local Address Base
          </Strong>{" "}
          or our support team:{" "}
          <Link href="mailto:support@nationaladdressplatform.us">
            support@nationaladdressplatform.us
          </Link>
        </Text>
      </Alert>

      <Pane display="flex" flexDirection="row" justifyContent="end" gap={16}>
        <Button intent="primary" onClick={handleClose}>
          Close
        </Button>
      </Pane>
    </Pane>
  );
}

export default PublishBalRejectedStep;
