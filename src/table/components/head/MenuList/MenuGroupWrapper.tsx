import React from 'react';
import { MenuItemGroup } from '../../../types';
import { StyledDivider } from '../styles';
import MenuGroup from './MenuGroup';

interface MenuItemsProps {
  itemGroups: MenuItemGroup[];
}

const MenuGroupWrapper = ({ itemGroups }: MenuItemsProps) => {
  return itemGroups.map((group, index) => [
    MenuGroup(group),
    index < itemGroups.length - 1 ? <StyledDivider variant="middle" key="divider" /> : undefined,
  ]);
};

export default MenuGroupWrapper;
