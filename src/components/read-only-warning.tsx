import { useContext } from "react";
import { Pane, Text, WarningSignIcon, Button } from "evergreen-ui";

import LayoutContext from "@/contexts/layout";
import BALRecoveryContext from "@/contexts/bal-recovery";
import { CommuneType } from "@/types/commune";

interface ReadonlyWarningProps {
  commune: CommuneType;
}

function ReadonlyWarning({ commune }: ReadonlyWarningProps) {
  const { openRecovery } = useContext(BALRecoveryContext);
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
        This Local Address Base is read-only because you are not signed in as
        an administrator.
      </Text>
      <Button
        height={24}
        marginX=".5em"
        width="fit-content"
        onClick={() => {
          openRecovery({ commune });
        }}
      >
        Recover admin access
      </Button>
    </Pane>
  );
}

export default ReadonlyWarning;
