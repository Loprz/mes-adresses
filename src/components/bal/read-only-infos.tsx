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
          This Local Address Base is read-only because you are not signed in as
          an administrator.
        </Text>
        <Text is="p">
          If you are an administrator of this Local Address Base, you can
          recover your access by clicking the button below.
        </Text>
        <Button appearance="primary" onClick={openRecoveryDialog}>
          Recover admin access
        </Button>
      </Alert>
    </Pane>
  );
}

export default BALReadOnly;
