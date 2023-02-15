/* eslint-disable import/no-cycle */
import React from 'react';
import { MenuItemGroup } from '../../../types';
import { StyledDivider } from '../styles';
import MenuGroup from './MenuGroup';

interface MenuItemsProps {
  itemGroups: MenuItemGroup[];
}

const MenuGroupWrapper = ({ itemGroups }: MenuItemsProps) => {
  return itemGroups.map((group, index) => [
    MenuGroup({ menuGroup: group }),
    index < itemGroups.length - 1 ? (
      <StyledDivider data-testid="group-divider" variant="middle" key="divider" />
    ) : undefined,
  ]);
};

export default MenuGroupWrapper;
