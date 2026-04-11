"use client";

import { useContext } from "react";
import { Alert, Button, Text } from "evergreen-ui";
import BALRecoveryContext from "@/contexts/bal-recovery";

function BALRecovery() {
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  return (
    <Alert>
      <Text>
        Can't find one of your Local Address Bases? Recover access by email.
      </Text>
      <Button
        appearance="primary"
        marginLeft="1em"
        onClick={() => setIsRecoveryDisplayed(true)}
      >
        Recover access
      </Button>
    </Alert>
  );
}

export default BALRecovery;
