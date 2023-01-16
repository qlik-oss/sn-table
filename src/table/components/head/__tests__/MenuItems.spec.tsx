import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { TableContextProvider } from '../../../context';
import MenuItems from '../MenuItems';
import muiSetup from '../../../mui-setup';
import { MenuItemGroup } from '../../../types';
import { ExtendedSelectionAPI } from '../../../../types';

describe('<MenuGroup />', () => {
  let selectionsAPI: ExtendedSelectionAPI;
  const direction: 'ltr' | 'rtl' = 'ltr';
  let menuItemGroups: MenuItemGroup[];

  const renderMenuGroup = (itemGroups: MenuItemGroup[]) =>
    render(
      <ThemeProvider theme={muiSetup(direction)}>
        <TableContextProvider selectionsAPI={selectionsAPI}>
          <>{MenuItems({ itemGroups })}</>
        </TableContextProvider>
      </ThemeProvider>
    );

  it('should render given menu group', () => {
    menuItemGroups = [
      [
        {
          id: 1,
          itemTitle: 'menu#01',
          onClick: jest.fn(),
          icon: <></>,
          isDisabled: false,
        },
      ],
      [
        {
          id: 2,
          itemTitle: 'menu#02',
          onClick: jest.fn(),
          icon: <></>,
          isDisabled: false,
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
