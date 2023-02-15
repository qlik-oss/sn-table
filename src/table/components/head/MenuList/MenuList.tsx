import React from 'react';
import Menu from '@mui/material/Menu';
import { PopoverOrigin } from '@mui/material';
import { MenuItemGroup } from '../../../types';
import MenuGroupWrapper from './MenuGroupWrapper';

interface MenuListProps {
  open: boolean;
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  menuGroups: MenuItemGroup[];
  popoverProps?: {
    transformOrigin: PopoverOrigin;
    anchorOrigin: PopoverOrigin;
  };
}

const MenuList = ({ anchorEl, open, onClose, menuGroups, popoverProps }: MenuListProps) => {
  return (
    <Menu
      className="sn-table-head-menu"
      aria-labelledby="sn-table-head-menu-button"
      open={open}
      anchorEl={anchorEl}
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
