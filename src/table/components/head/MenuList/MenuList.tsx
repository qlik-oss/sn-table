/* eslint-disable import/no-cycle */
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
  transformOrigin?: PopoverOrigin; // eslint-disable-line react/require-default-props
  anchorOrigin?: PopoverOrigin; // eslint-disable-line react/require-default-props
}

const MenuList = ({ anchorEl, open, onClose, menuGroups, transformOrigin, anchorOrigin }: MenuListProps) => {
  if (!menuGroups.length) return null;
  return (
    <Menu
      className="sn-table-head-menu"
      aria-labelledby="sn-table-head-menu-button"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      autoFocus={false}
      {...(anchorOrigin ? { anchorOrigin } : {})}
      {...(transformOrigin ? { transformOrigin } : {})}
    >
      {MenuGroupWrapper({ itemGroups: menuGroups })}
    </Menu>
  );
};

export default MenuList;
