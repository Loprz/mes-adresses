import { useContext } from "react";
import { Pane, Text, WarningSignIcon, Button } from "evergreen-ui";

import LayoutContext from "@/contexts/layout";
import BALRecoveryContext from "@/contexts/bal-recovery";

function ReadonlyWarning() {
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const { isMobile } = useContext(LayoutContext);

  return (
    <Pane
      width="100%"
      textAlign="center"
      backgroundColor="orange"
      position="fixed"
      bottom={0}
      height={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <WarningSignIcon
        size={20}
        marginX=".5em"
        style={{ verticalAlign: "sub" }}
      />
      <Text fontSize={isMobile ? 10 : 14}>
        You are in read-only mode and cannot modify this Local Address
        Base
      </Text>
      <Button
        height={24}
        marginX=".5em"
        width="fit-content"
        onClick={() => {
          setIsRecoveryDisplayed(true);
        }}
      >
        Recover my access
      </Button>
    </Pane>
  );
}

export default ReadonlyWarning;
