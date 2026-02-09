"use client";

import { useContext } from "react";
import { Alert, Button, Text } from "evergreen-ui";
import BALRecoveryContext from "@/contexts/bal-recovery";

function BALRecovery() {
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  return (
    <Alert>
      <Text>
        Can't find your Local Address Bases? Recover them by
        email
      </Text>
      <Button
        appearance="primary"
        marginLeft="1em"
        onClick={() => setIsRecoveryDisplayed(true)}
      >
        Click here
      </Button>
    </Alert>
  );
}

export default BALRecovery;
