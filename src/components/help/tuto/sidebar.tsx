import { Paragraph, IconButton, ChevronRightIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import Tuto from "@/components/help/tuto";

function Sidebar() {
  const t = useTranslations("helpCommon");
  return (
    <Tuto title={t("cantSeeSidebarTitle")}>
      <Paragraph marginTop="default">{t("sidebarHidden")}</Paragraph>
      <Paragraph marginTop="default">
        {t("sidebarReappearPre")}{" "}
        <IconButton display="inline-block" margin={8} icon={ChevronRightIcon} />
        {t("sidebarReappearPost")}
      </Paragraph>
    </Tuto>
  );
}

export default Sidebar;
