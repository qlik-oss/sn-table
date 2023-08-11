import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import MenuGroup, { interceptClickOnMenuItems } from '../MenuGroup';
import { HeadCellMenuItem, MenuItemGroup } from '../../../../types';

describe('MenuGroup', () => {
  describe('interceptClickOnMenuItems', () => {
    let menuGroups: MenuItemGroup[];
    let cache: Record<string, any>;

    it('should return proper values per menu', () => {
      menuGroups = [
        [{ id: 1, icon: <i />, itemTitle: 'Menu#01', enabled: true }],
        [{ id: 2, icon: <i />, itemTitle: 'Menu#02', enabled: true }],
      ];
      const result = interceptClickOnMenuItems(menuGroups, cache);
      expect(result).toMatchObject(menuGroups);
    });

    it('should include onClick property if it was provided', () => {
      menuGroups = [[{ id: 1, icon: <i />, enabled: true, itemTitle: 'Menu#01', onClick: () => {} }]];
      const result = interceptClickOnMenuItems(menuGroups, cache);
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
      const result = interceptClickOnMenuItems(menuGroups, cache);
      expect(result).toMatchObject(menuGroups);
    });
  });

  describe('<MenuGroup />', () => {
    let menuGroup: HeadCellMenuItem[];

    const renderer = (group: HeadCellMenuItem[]) => {
      // @ts-expect-error calling like component here for test, but it's being called as function where it's been used
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

    it('should render menu items with subMenu with correct keyboard navigation', () => {
      menuGroup = [
        { id: 1, icon: <i />, itemTitle: 'Menu#01', enabled: true },
        {
          id: 2,
          icon: <i />,
          itemTitle: 'Menu#02',
          enabled: true,
          subMenus: [
            [
              { id: 3, icon: <i />, itemTitle: 'SubMenu#01', enabled: true },
              { id: 4, icon: <i />, itemTitle: 'SubMenu#02', enabled: true },
            ],
            [{ id: 5, icon: <i />, itemTitle: 'SubMenu#03', enabled: true }],
          ],
        },
      ];
      renderer(menuGroup);

      expect(screen.getByText('Menu#01')).toBeVisible();
      expect(screen.getByText('Menu#02')).toBeVisible();

      act(() => {
        screen.getByTestId('menu-item-1').focus();
      });
      fireEvent.keyDown(screen.getByTestId('menu-item-1'), {
        key: 'ArrowDown',
      });
      expect(screen.getByTestId('menu-item-2')).toHaveFocus();
      fireEvent.keyDown(screen.getByTestId('menu-item-2'), {
        key: 'ArrowDown',
      });
      expect(screen.getByTestId('menu-item-1')).toHaveFocus();
      fireEvent.keyDown(screen.getByTestId('menu-item-1'), {
        key: 'ArrowUp',
      });
      expect(screen.getByTestId('menu-item-2')).toHaveFocus();

      fireEvent.click(screen.getByText('Menu#02'));
      expect(screen.getByText('SubMenu#01')).toBeVisible();

      fireEvent.keyDown(screen.getByTestId('menu-item-3'), { key: 'ArrowUp' });
      expect(screen.getByTestId('menu-item-5')).toHaveFocus();

      fireEvent.keyDown(screen.getByTestId('menu-item-5'), { key: 'ArrowUp' });
      expect(screen.getByTestId('menu-item-4')).toHaveFocus();

      fireEvent.keyDown(screen.getByTestId('menu-item-4'), { key: 'ArrowDown' });
      expect(screen.getByTestId('menu-item-5')).toHaveFocus();

      fireEvent.keyDown(screen.getByTestId('menu-item-5'), { key: 'ArrowDown' });
      expect(screen.getByTestId('menu-item-3')).toHaveFocus();
    });
  });
});
