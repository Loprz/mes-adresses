import React from "react";
import {
  Table,
  Popover,
  Menu,
  Position,
  IconButton,
  MoreIcon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

interface TableRowActionsProps {
  children: React.ReactNode;
}

const TableRowActions = React.memo(function TableRowActions({
  children,
}: TableRowActionsProps) {
  const t = useTranslations("common");
  return (
    <Table.TextCell flex="0 1 1">
      <Popover
        position={Position.BOTTOM_LEFT}
        content={
          <Menu>
            <Menu.Group>{children}</Menu.Group>
          </Menu>
        }
      >
        <IconButton
          type="button"
          height={24}
          icon={MoreIcon}
          appearance="minimal"
          title={t("actions")}
        />
      </Popover>
    </Table.TextCell>
  );
});

export default TableRowActions;
