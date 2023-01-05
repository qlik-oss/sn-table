import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { TableContextProvider } from '../../../context';
import MenuGroup from '../MenuGroup';
import muiSetup from '../../../mui-setup';
import { MenuGroupProps } from '../../../types';
import { ExtendedSelectionAPI } from '../../../../types';

describe('<MenuGroup />', () => {
  let selectionsAPI: ExtendedSelectionAPI;
  const direction: 'ltr' | 'rtl' = 'ltr';
  let menuGroup: MenuGroupProps;

  const renderMenuGroup = (menuGroupProp: MenuGroupProps) =>
    render(
      <ThemeProvider theme={muiSetup(direction)}>
        <TableContextProvider selectionsAPI={selectionsAPI}>
          <MenuGroup {...menuGroupProp} />
        </TableContextProvider>
      </ThemeProvider>
    );

  it('should render given menu group', () => {
    menuGroup = {
      id: 1,
      shouldShowDevider: false,
      menus: [
        {
          id: 1,
          itemTitle: 'menu#01',
          onClick: jest.fn(),
          icon: <></>,
          isDisabled: false,
        },
      ],
    };
    renderMenuGroup(menuGroup);
    expect(screen.getAllByRole('button').length).toBe(1);
    expect(screen.getByText('menu#01')).toBeVisible();
    fireEvent.click(screen.getByText('menu#01'));
    expect(menuGroup.menus[0].onClick).toHaveBeenCalledTimes(1);
  });
});
