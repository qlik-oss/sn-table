import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MenuGroupProps } from '../../types';
import { MenuListDivider } from './styles';

export default function MenuGroup({ options, shouldShowDevider }: MenuGroupProps) {
  return (
    <div>
      {options.map(({ id, icon, itemTitle, isDisabled, onClick }) => (
        <ListItem key={id} disablePadding>
          <ListItemButton disabled={isDisabled} className="sn-table-head-menu-item-button" onClick={onClick}>
            <ListItemIcon sx={{ minWidth: '25px' }}>{icon}</ListItemIcon>
            <ListItemText primary={itemTitle} />
          </ListItemButton>
        </ListItem>
      ))}
      {shouldShowDevider && <MenuListDivider />}
    </div>
  );
}
