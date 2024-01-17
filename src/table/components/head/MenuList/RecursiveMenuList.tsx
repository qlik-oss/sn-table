/* eslint-disable import/no-cycle */
import { PopoverOrigin } from "@mui/material";
import Menu from "@mui/material/Menu";
import React from "react";
import { MenuItemGroup } from "../../../types";
import MenuGroupWrapper from "./MenuGroupWrapper";

interface RecursiveMenuListProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  menuGroups: MenuItemGroup[];
  transformOrigin?: PopoverOrigin; // eslint-disable-line react/require-default-props
  anchorOrigin?: PopoverOrigin; // eslint-disable-line react/require-default-props
  buttonId?: string; // eslint-disable-line react/require-default-props
  menuId?: string; // eslint-disable-line react/require-default-props
}

const RecursiveMenuList = ({
  anchorEl,
  open,
  onClose,
  menuGroups,
  transformOrigin,
  anchorOrigin,
  buttonId,
  menuId,
}: RecursiveMenuListProps) => {
  if (!menuGroups.length) return null;
  return (
    <Menu
      className="sn-table-head-menu"
      id={menuId}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      aria-labelledby={buttonId}
      {...(anchorOrigin ? { anchorOrigin } : {})}
      {...(transformOrigin ? { transformOrigin } : {})}
    >
      {MenuGroupWrapper({ itemGroups: menuGroups })}
    </Menu>
  );
};

export default RecursiveMenuList;
