import React from 'react';
import Typography from '@mui/material/Typography';
import { HeadCellMenuGroup, HeadCellMenuItem } from '../../types';
import { StyledMenuItem, StyledDivider, StyledListItemIcon } from './styles';

export default function MenuGroup({ options }: HeadCellMenuGroup) {
  return (
    <>
      {options.map(({ id, icon, itemTitle, isDisabled, onClick, hasDivider }: HeadCellMenuItem) => (
        <>
          <StyledMenuItem key={id} className="sn-table-head-menu-item" onClick={onClick} disabled={isDisabled}>
            <StyledListItemIcon>{icon}</StyledListItemIcon>
            <Typography variant="body2">{itemTitle}</Typography>
          </StyledMenuItem>
          {hasDivider && <StyledDivider variant="middle" />}
        </>
      ))}
    </>
  );
}
