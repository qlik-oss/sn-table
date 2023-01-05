import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { MenuGroupProps } from '../../types';
import { MenuListDivider } from './styles';

export default function MenuGroup({ menus, shouldShowDevider }: MenuGroupProps) {
  return (
    <div>
      {menus.map(({ id, icon, itemTitle, isDisabled, subMenu, onClick }) => (
        <ListItem key={id} disablePadding>
          <ListItemButton
            disabled={isDisabled}
            className="sn-table-head-menu-item-button"
            onClick={(...args) => !subMenu && onClick(...args)}
          >
            <ListItemIcon sx={{ minWidth: '25px' }}>{icon}</ListItemIcon>
            <ListItemText primary={itemTitle} />
            {subMenu && <ArrowForwardIosIcon />}
          </ListItemButton>
        </ListItem>
      ))}
      {shouldShowDevider && <MenuListDivider />}
    </div>
  );
}
