import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { HeadCellMenuItemProps } from '../../types';

export default function MenuItem({ children, itemTitle, isDisabled, onClick }: HeadCellMenuItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton disabled={isDisabled} className="sn-table-head-menu-item-button" onClick={onClick}>
        <ListItemIcon sx={{ minWidth: '25px' }}>{children}</ListItemIcon>
        <ListItemText primary={itemTitle} />
      </ListItemButton>
    </ListItem>
  );
}
