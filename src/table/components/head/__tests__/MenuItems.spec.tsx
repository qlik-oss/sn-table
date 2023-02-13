import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MenuItems from '../MenuItems';
import { MenuItemGroup } from '../../../types';
import { ExtendedSelectionAPI } from '../../../../types';
import TestWithProviders from '../../../../__test__/test-with-providers';

describe('<MenuGroup />', () => {
  let selectionsAPI: ExtendedSelectionAPI;
  const direction: 'ltr' | 'rtl' = 'ltr';
  let menuItemGroups: MenuItemGroup[];

  const renderMenuGroup = (itemGroups: MenuItemGroup[]) =>
    render(
      <TestWithProviders selectionsAPI={selectionsAPI} direction={direction}>
        <>{MenuItems({ itemGroups })}</>
      </TestWithProviders>
    );

  it('should render given menu group', () => {
    menuItemGroups = [
      [
        {
          id: 1,
          itemTitle: 'menu#01',
          onClick: jest.fn(),
          icon: <></>,
          enabled: true,
        },
      ],
      [
        {
          id: 2,
          itemTitle: 'menu#02',
          onClick: jest.fn(),
          icon: <></>,
          enabled: true,
        },
      ],
    ];
    renderMenuGroup(menuItemGroups);
    expect(screen.getAllByRole('menuitem').length).toBe(2);
    expect(screen.getByText('menu#01')).toBeVisible();
    expect(screen.getByText('menu#02')).toBeVisible();
    fireEvent.click(screen.getByText('menu#01'));
    expect(menuItemGroups[0][0].onClick).toHaveBeenCalledTimes(1);
  });
});
