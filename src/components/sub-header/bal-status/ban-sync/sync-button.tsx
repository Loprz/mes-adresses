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

import RefreshIconRotate from "../refresh-icon-rotate/refresh-icon-rotate";

function SyncButtonIsLoading() {
  return (
    <Pane display="flex" alignItems="center">
      Synchronization in progress <RefreshIconRotate />
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
          Force update
        </Button>
        <Checkbox
          checked={isManualActionConfirmed}
          label="I understand that my Local Address Base will replace the one currently synchronized with the National Address Platform"
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
        Restart automatic updates
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
          "Update"
        ) : (
          "Automatic update"
        )}
      </Button>
      <Button appearance="minimal" iconAfter={PauseIcon} onClick={togglePause}>
        Pause automatic updates
      </Button>
    </Pane>
  );
}

export default SyncButton;
