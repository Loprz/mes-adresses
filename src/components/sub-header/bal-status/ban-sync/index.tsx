import {
  Popover,
  Pane,
  Alert,
  Button,
  Position,
  CaretDownIcon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import { computeStatus } from "@/lib/statuses";

import BANHistory from "@/components/sub-header/bal-status/ban-sync/ban-history";
import SyncButton from "@/components/sub-header/bal-status/ban-sync/sync-button";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { useContext } from "react";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";

interface BANSyncProps {
  baseLocale: ExtendedBaseLocaleDTO;
  commune: CommuneType;
  isHabilitationValid: boolean;
  handleSync: () => void;
  togglePause: () => void;
}

function BANSync({
  baseLocale,
  commune,
  isHabilitationValid,
  handleSync,
  togglePause,
}: BANSyncProps) {
  const t = useTranslations("balStatus");
  const ts = useTranslations("balStatusInfo");
  const { isMobile } = useContext(LayoutContext);
  const { intent, key } = computeStatus(
    baseLocale.status,
    baseLocale.sync,
    isHabilitationValid
  );

  return (
    <Pane>
      <Popover
        content={
          <Pane
            width={isMobile ? "100vw" : 500}
            display="flex"
            flexDirection="column"
            gap={8}
            padding={8}
          >
            <Alert intent={intent} title={ts(`${key}.title`)}>
              {ts(`${key}.content`)}
            </Alert>

            <BANHistory
              baseLocaleId={baseLocale.id}
              syncStatus={baseLocale.sync.status}
              commune={commune}
            />

            <SyncButton
              isSync={baseLocale.sync.status === "synced"}
              isConflicted={baseLocale.sync.status === "conflict"}
              isPaused={baseLocale.sync.isPaused}
              handleSync={handleSync}
              togglePause={togglePause}
            />
          </Pane>
        }
        position={Position.BOTTOM_RIGHT}
      >
        <Button height={28} appearance="primary" iconAfter={CaretDownIcon}>
          {isMobile ? t("statusShort") : t("syncStatus")}
        </Button>
      </Popover>
    </Pane>
  );
}

export default BANSync;
