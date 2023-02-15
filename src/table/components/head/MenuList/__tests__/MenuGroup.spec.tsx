import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MenuGroup, { interceptClickOnMenuItems } from '../MenuGroup';
import { HeadCellMenuItem, MenuItemGroup } from '../../../../types';

describe('MenuGroup', () => {
  describe('interceptClickOnMenuItems', () => {
    let menuGroups: MenuItemGroup[];
    let setOpenMenu: jest.Mock<any, any>;

    beforeEach(() => {
      setOpenMenu = jest.fn();
    });

    it('should return proper values per menu', () => {
      menuGroups = [
        [{ id: 1, icon: <i />, itemTitle: 'Menu#01', enabled: true }],
        [{ id: 2, icon: <i />, itemTitle: 'Menu#02', enabled: true }],
      ];
      const result = interceptClickOnMenuItems(menuGroups, setOpenMenu);
      expect(result).toMatchObject(menuGroups);
    });

    it('should include onClick property if it was provided', () => {
      menuGroups = [[{ id: 1, icon: <i />, enabled: true, itemTitle: 'Menu#01', onClick: () => {} }]];
      const result = interceptClickOnMenuItems(menuGroups, setOpenMenu);
      // stringify because onClick function reference could be different in each call
      expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(menuGroups));
    });

    it('should include subMenus property if it was provided', () => {
      menuGroups = [
        [
          {
            id: 1,
            icon: <i />,
            itemTitle: 'SubMenu#01',
            enabled: true,
            subMenus: [[{ id: 1, icon: <i />, itemTitle: 'SubMenu#01', enabled: true }]],
          },
        ],
      ];
      const result = interceptClickOnMenuItems(menuGroups, setOpenMenu);
      expect(result).toMatchObject(menuGroups);
    });
  });

  describe('<MenuGroup />', () => {
    let menuGroup: HeadCellMenuItem[];

    const renderer = (group: HeadCellMenuItem[]) => {
      // @ts-ignore calling like component here for test, but it's being called as function where it's been used
      render(<MenuGroup menuGroup={group} />);
    };

    it('should render menu items', () => {
      menuGroup = [
        { id: 1, icon: <i />, itemTitle: 'Menu#01', enabled: true },
        { id: 2, icon: <i />, itemTitle: 'Menu#02', enabled: true },
      ];
      renderer(menuGroup);

      expect(screen.getByText('Menu#01')).toBeVisible();
      expect(screen.getByText('Menu#02')).toBeVisible();
    });

    it('should render menu items with subMenu', () => {
      menuGroup = [
        { id: 1, icon: <i />, itemTitle: 'Menu#01', enabled: true },
        {
          id: 2,
          icon: <i />,
          itemTitle: 'Menu#02',
          enabled: true,
          subMenus: [[{ id: 1, icon: <i />, itemTitle: 'SubMenu#01', enabled: true }]],
        },
      ];
      renderer(menuGroup);

      expect(screen.getByText('Menu#01')).toBeVisible();
      expect(screen.getByText('Menu#02')).toBeVisible();
      fireEvent.click(screen.getByText('Menu#02'));
      expect(screen.getByText('SubMenu#01')).toBeVisible();
    });
  });
});
