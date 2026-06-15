import { useContext } from "react";
import { Button, MenuIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import DrawerContext from "@/contexts/drawer";
import LayoutContext from "@/contexts/layout";

function SettingsMenu() {
  const t = useTranslations("balStatus");
  const { isMobile } = useContext(LayoutContext);
  const { setDrawerDisplayed } = useContext(DrawerContext);

  return (
    <Button
      appearance="minimal"
      onClick={() => setDrawerDisplayed(true)}
      {...(!isMobile && { iconAfter: MenuIcon, marginRight: 16, height: 24 })}
    >
      {isMobile ? <MenuIcon /> : t("menu")}
    </Button>
  );
}

export default SettingsMenu;
