"use client";

import { useState } from "react";
import {
  Pane,
  Button,
  Checkbox,
  CircleArrowUpIcon,
  PlayIcon,
  PauseIcon,
  AutomaticUpdatesIcon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import RefreshIconRotate from "../refresh-icon-rotate/refresh-icon-rotate";

function SyncButtonIsLoading() {
  const t = useTranslations("balStatus");
  return (
    <Pane display="flex" alignItems="center">
      {t("syncInProgress")} <RefreshIconRotate />
    </Pane>
  );
}

interface SyncButtonProps {
  isSync: boolean;
  isConflicted: boolean;
  isPaused: boolean;
  handleSync: () => void;
  togglePause: () => void;
}

function SyncButton({
  isSync,
  isConflicted,
  isPaused,
  handleSync,
  togglePause,
}: SyncButtonProps) {
  const t = useTranslations("balStatus");
  const [isActionHovered, setIsActionHovered] = useState(false);
  const [isManualActionConfirmed, setIsManuelActionConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSync = async () => {
    setIsLoading(true);
    await handleSync();
    setIsLoading(false);
  };

  if (isConflicted) {
    return (
      <Pane>
        <Button
          width="100%"
          intent="danger"
          appearance="primary"
          onClick={onSync}
          disabled={!isManualActionConfirmed || isLoading}
        >
          {t("takeOverPublication")}
        </Button>
        <Checkbox
          checked={isManualActionConfirmed}
          label={t("takeOverConfirm")}
          onChange={() => setIsManuelActionConfirmed(!isManualActionConfirmed)}
        />
      </Pane>
    );
  }

  if (isPaused) {
    return (
      <Button
        width="100%"
        appearance="primary"
        intent="success"
        iconAfter={PlayIcon}
        onClick={togglePause}
      >
        {t("restartUpdates")}
      </Button>
    );
  }

  return (
    <Pane display="flex" flexDirection="column">
      <Button
        width="100%"
        {...(!isLoading
          ? {
              iconAfter: isActionHovered
                ? CircleArrowUpIcon
                : AutomaticUpdatesIcon,
            }
          : {})}
        appearance={isLoading || isActionHovered ? "primary" : "default"}
        onMouseEnter={() => setIsActionHovered(true)}
        onMouseLeave={() => setIsActionHovered(false)}
        onClick={onSync}
        disabled={isSync || isLoading}
      >
        {isLoading ? (
          <SyncButtonIsLoading />
        ) : isActionHovered ? (
          t("update")
        ) : (
          t("automaticUpdate")
        )}
      </Button>
      <Button appearance="minimal" iconAfter={PauseIcon} onClick={togglePause}>
        {t("pauseUpdates")}
      </Button>
    </Pane>
  );
}

export default SyncButton;
