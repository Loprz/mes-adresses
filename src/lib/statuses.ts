import {
  TimeIcon,
  TickCircleIcon,
  PauseIcon,
  ErrorIcon,
  ManuallyEnteredDataIcon,
  LabTestIcon,
  IconComponent,
  EyeOpenIcon,
} from "evergreen-ui";

import { BaseLocale, BaseLocaleSync } from "./openapi-api-bal";

type StatusType = {
  label: string;
  title?: string;
  content: string;
  color:
    | "neutral"
    | "blue"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "purple";
  textColor?: string;
  intent?: string;
  icon: IconComponent;
};

const STATUSES: { [key: string]: StatusType } = {
  consultation: {
    label: "View only",
    title: "You are viewing this Local Address Base",
    content:
      "You are viewing this Local Address Base. No changes will be reflected in the National Address Platform.",
    color: "yellow",
    intent: "none",
    icon: EyeOpenIcon,
  },
  paused: {
    label: "Paused",
    title:
      "Automatic updates for this Local Address Base are currently paused. It is no longer syncing with the National Address Platform.",
    content:
      "Automatic updates for this Local Address Base are currently paused. You can restart synchronization at any time.",
    color: "yellow",
    intent: "warning",
    icon: PauseIcon,
  },
  "no-habilitation": {
    label: "No authorization",
    title:
      "This Local Address Base needs authorization to sync with the National Address Platform",
    content:
      "Changes will not be reflected in the National Address Platform.",
    color: "yellow",
    intent: "none",
    icon: TimeIcon,
  },
  outdated: {
    label: "Update scheduled",
    title: "This Local Address Base will sync with the National Address Platform",
    content:
      "New changes have been detected. They will be automatically reflected in the National Address Platform within the next few hours.",
    color: "blue",
    intent: "none",
    icon: TimeIcon,
  },
  synced: {
    label: "Up to date",
    title: "This Local Address Base is syncing with the National Address Platform",
    content:
      "This Local Address Base is up to date with the National Address Platform. Any changes will be automatically reflected within the next few hours.",
    color: "green",
    intent: "success",
    icon: TickCircleIcon,
  },
  replaced: {
    label: "Replaced",
    title:
      "This Local Address Base is no longer syncing with the National Address Platform",
    content:
      "Another Local Address Base is also synchronized with the National Address Platform. Please contact the administrators of the other Local Address Base or our support: support@addressplatform.gov",
    color: "red",
    intent: "danger",
    icon: ErrorIcon,
  },
  draft: {
    content: "This Local Address Base is under construction",
    label: "Draft",
    color: "neutral",
    icon: ManuallyEnteredDataIcon,
  },
  demo: {
    content:
      "Demo Local Address Base — no addresses will be transmitted to the National Address Platform",
    label: "Demo",
    color: "orange",
    textColor: "black",
    intent: "danger",
    icon: LabTestIcon,
  },
};

export function computeStatus(
  balStatus: BaseLocale.status,
  sync: Partial<BaseLocaleSync>,
  isHabilitationValid: boolean
): StatusType {
  if (sync?.isPaused && balStatus !== BaseLocale.status.REPLACED) {
    return STATUSES.paused;
  }

  if (balStatus === BaseLocale.status.PUBLISHED && sync.status) {
    if (!isHabilitationValid) {
      return STATUSES["no-habilitation"];
    }
    return STATUSES[sync.status];
  }

  return STATUSES[balStatus];
}
