import { Pane, Badge, Position, Tooltip, Icon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import { computeStatus } from "@/lib/statuses";
import { BaseLocale, BaseLocaleSync } from "@/lib/openapi-api-bal";

interface StatusBadgeProps {
  status: BaseLocale.status;
  sync: Partial<BaseLocaleSync>;
  isHabilitationValid: boolean;
  isAdmin?: boolean;
}

function StatusBadge({ status, sync, isHabilitationValid }: StatusBadgeProps) {
  const t = useTranslations("balStatusInfo");
  const { color, key, icon, textColor } =
    computeStatus(status, sync, isHabilitationValid) || {};

  return (
    <Tooltip
      position={Position.BOTTOM_RIGHT}
      content={key ? t(`${key}.content`) : ""}
    >
      <Badge
        data-testid="status-badge"
        display="flex"
        justifyContent="center"
        color={color}
        height="100%"
        width="100%"
      >
        <Pane display="flex" alignItems="center" color={textColor}>
          {key ? t(`${key}.label`) : ""}{" "}
          <Icon icon={icon} size={14} marginLeft={4} />
        </Pane>
      </Badge>
    </Tooltip>
  );
}

export default StatusBadge;
