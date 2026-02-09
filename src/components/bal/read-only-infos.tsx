import React from "react";
import { Pane, Alert, Text, Button } from "evergreen-ui";

interface BALReadOnlyProps {
  openRecoveryDialog: () => void;
}

function BALReadOnly({ openRecoveryDialog }: BALReadOnlyProps) {
  return (
    <Pane backgroundColor="white" padding={8}>
      <Alert intent="warning" title="You are in read-only mode">
        <Text is="p">
          You cannot modify this Local Address Base because you are
          not authenticated as an administrator.
        </Text>
        <Text is="p">
          If you are an administrator of this Local Address Base, you can
          recover your access by clicking the button below.
        </Text>
        <Button appearance="primary" onClick={openRecoveryDialog}>
          Recover my access
        </Button>
      </Alert>
    </Pane>
  );
}

export default BALReadOnly;
