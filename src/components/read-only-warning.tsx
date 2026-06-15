import { useContext } from "react";
import { Pane, Text, WarningSignIcon, Button } from "evergreen-ui";
import { useTranslations } from "next-intl";

import LayoutContext from "@/contexts/layout";
import BALRecoveryContext from "@/contexts/bal-recovery";
import { CommuneType } from "@/types/commune";

interface ReadonlyWarningProps {
  commune: CommuneType;
}

function ReadonlyWarning({ commune }: ReadonlyWarningProps) {
  const t = useTranslations("readOnlyWarning");
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
      <Text fontSize={isMobile ? 10 : 14}>{t("message")}</Text>
      <Button
        height={24}
        marginX=".5em"
        width="fit-content"
        onClick={() => {
          openRecovery({ commune });
        }}
      >
        {t("recoverAdminAccess")}
      </Button>
    </Pane>
  );
}

export default ReadonlyWarning;
