import React from 'react';
import Menu from '@mui/material/Menu';
import { PopoverOrigin } from '@mui/material';
import { MenuItemGroup } from '../../../types';
import MenuGroupWrapper from './MenuGroupWrapper';

interface MenuListProps {
  open: boolean;
  anchorRef: Element | ((element: Element) => Element) | null;
  onClose: () => void;
  menuGroups: MenuItemGroup[];
  popoverProps?: {
    transformOrigin: PopoverOrigin;
    anchorOrigin: PopoverOrigin;
  };
}

// TODO:
// forward ref
const MenuList = ({ anchorRef, open, onClose, menuGroups, popoverProps }: MenuListProps) => {
  return (
    <Menu
      className="sn-table-head-menu"
      aria-labelledby="sn-table-head-menu-button"
      open={open}
      anchorEl={anchorRef}
      onClose={onClose}
      autoFocus={false}
      {...(popoverProps?.anchorOrigin ? { anchorOrigin: popoverProps.anchorOrigin } : {})}
      {...(popoverProps?.transformOrigin ? { transformOrigin: popoverProps.transformOrigin } : {})}
    >
      {MenuGroupWrapper({ itemGroups: menuGroups })}
    </Menu>
  );
};

export default MenuList;
