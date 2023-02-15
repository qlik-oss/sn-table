import React from 'react';
import Typography from '@mui/material/Typography';
import { HeadCellMenuItem, MenuItemGroup } from '../../types';
import { StyledMenuItem, StyledListItemIcon, StyledDivider } from './styles';

/**
 * Gets the menu items for the head cell menu from provided array of item groups
 * Creates a menu item component for each item, and a divider between each item group
 */
export default function MenuItems({ itemGroups }: { itemGroups: MenuItemGroup[] }) {
  const getItemComponents = (items: HeadCellMenuItem[]) =>
    items.map(({ id, icon, itemTitle, enabled, onClick }) => (
      <StyledMenuItem key={id} className="sn-table-head-menu-item" onClick={onClick} disabled={!enabled}>
        <StyledListItemIcon>{icon}</StyledListItemIcon>
        <Typography variant="body2">{itemTitle}</Typography>
      </StyledMenuItem>
    ));

  return itemGroups.map((group, index) => [
    getItemComponents(group),
    index < itemGroups.length - 1 ? <StyledDivider variant="middle" key="divider" /> : undefined,
  ]);
}
