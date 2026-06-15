import React from "react";
import { Pane, Badge } from "evergreen-ui";
import { useTranslations } from "next-intl";
import RefreshIconRotate from "./refresh-icon-rotate/refresh-icon-rotate";

function RefreshSyncBadge() {
  const t = useTranslations("balStatus");
  return (
    <Badge
      display="flex"
      justifyContent="center"
      color="neutral"
      height="100%"
      width="100%"
    >
      <Pane display="flex" alignItems="center">
        {t("syncInProgress")} <RefreshIconRotate />
      </Pane>
    </Badge>
  );
}

export default React.memo(RefreshSyncBadge);
