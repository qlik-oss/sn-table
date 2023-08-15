/* eslint-disable import/no-cycle */
import { PopoverOrigin } from "@mui/material";
import Menu from "@mui/material/Menu";
import React from "react";
import { MenuItemGroup } from "../../../types";
import MenuGroupWrapper from "./MenuGroupWrapper";

interface RecursiveMenuListProps {
  open: boolean;
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  menuGroups: MenuItemGroup[];
  transformOrigin?: PopoverOrigin; // eslint-disable-line react/require-default-props
  anchorOrigin?: PopoverOrigin; // eslint-disable-line react/require-default-props
  ariaLabel?: string; // eslint-disable-line react/require-default-props
}

const RecursiveMenuList = ({
  anchorEl,
  open,
  onClose,
  ariaLabel,
  menuGroups,
  transformOrigin,
  anchorOrigin,
}: RecursiveMenuListProps) => {
  if (!menuGroups.length) return null;
  return (
    <Menu
      className="sn-table-head-menu"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      aria-labelledby={ariaLabel}
      {...(anchorOrigin ? { anchorOrigin } : {})}
      {...(transformOrigin ? { transformOrigin } : {})}
    >
      {MenuGroupWrapper({ itemGroups: menuGroups })}
    </Menu>
  );
};

export default RecursiveMenuList;
