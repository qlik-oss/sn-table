import React from 'react';
import { stardust } from '@nebula.js/stardust';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { TableContextProvider } from '../../../context';
import { ExtendedTranslator, ExtendedSelectionAPI, SortDirection, TableLayout } from '../../../../types';
import { GeneratedStyling } from '../../../types';
import HeadCellMenu from '../HeadCellMenu';
import muiSetup from '../../../mui-setup';

describe('<HeadCellMenu />', () => {
  let translator: ExtendedTranslator;
  let selectionsAPI: ExtendedSelectionAPI;
  let headerStyle: GeneratedStyling;
  let sortFromMenu: (evt: React.MouseEvent, sortOrder: string) => void;
  const sortDirection: SortDirection = 'A';
  let isInteractionEnabled: boolean = true;
  let isCurrentColumnActive: boolean = false;
  let embed: stardust.Embed | undefined;
  let layout: TableLayout;
  let columnIndex: number;
  const direction: 'ltr' | 'rtl' = 'ltr';

  const renderTableHeadCellMenu = (cellCoordMock?: [number, number]) =>
    render(
      <ThemeProvider theme={muiSetup(direction)}>
        <TableContextProvider selectionsAPI={selectionsAPI} cellCoordMock={cellCoordMock}>
          <HeadCellMenu
            headerStyle={headerStyle}
            translator={translator}
            sortDirection={sortDirection}
            sortFromMenu={sortFromMenu}
            isInteractionEnabled={isInteractionEnabled}
            isCurrentColumnActive={isCurrentColumnActive}
            embed={embed}
            layout={layout}
            columnIndex={columnIndex}
          />
        </TableContextProvider>
      </ThemeProvider>
    );

  beforeEach(() => {
    selectionsAPI = {
      isModal: () => false,
    } as ExtendedSelectionAPI;
    translator = { get: (s) => s } as ExtendedTranslator;
    headerStyle = {
      sortLabelColor: '#4287f5',
      borderColor: '#4287f5',
    };
    sortFromMenu = jest.fn();
    embed = {
      field: jest.fn().mockResolvedValueOnce({ instance: true }),
      render: jest.fn(),
      selections: jest.fn(),
      context: jest.fn(),
      getRegisteredTypes: jest.fn(),
    };
    layout = {
      qHyperCube: {
        qDimensionInfo: [{ qFallbackTitle: 'someTitle' }],
      },
    } as TableLayout;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render head cell menu button', () => {
    const { container } = renderTableHeadCellMenu();
    const element = container.querySelector('#sn-table-head-menu-button');
    expect(element).toBeTruthy();
    expect(element).not.toBeVisible();
  });

  it('should open the menu only when the button is clicked', () => {
    const { queryByRole, getByRole, getByText } = renderTableHeadCellMenu();

    expect(queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(getByRole('button'));
    expect(getByRole('menu')).toBeVisible();
    expect(getByText('SNTable.MenuItem.SortAscending')).toBeVisible();
    expect(getByText('SNTable.MenuItem.SortDescending')).toBeVisible();
  });

  it('should disable sorting option when the column order is already set on that option', () => {
    isCurrentColumnActive = true;
    const { getByRole, getByText } = renderTableHeadCellMenu();
    fireEvent.click(getByRole('button'));
    const element = getByText('SNTable.MenuItem.SortAscending').closest('.sn-table-head-menu-item-button');
    expect(element).toHaveAttribute('aria-disabled', 'true');
    userEvent.click(element as HTMLElement);
    expect(sortFromMenu).not.toHaveBeenCalled();
  });

  it('should disable sorting option when the column is in selection mode', () => {
    isInteractionEnabled = false;
    const { getByRole, getByText } = renderTableHeadCellMenu();
    fireEvent.click(getByRole('button'));
    const ascendingBtn = getByText('SNTable.MenuItem.SortAscending').closest('.sn-table-head-menu-item-button');
    const descendingBtn = getByText('SNTable.MenuItem.SortDescending').closest('.sn-table-head-menu-item-button');
    expect(ascendingBtn).toHaveAttribute('aria-disabled', 'true');
    expect(descendingBtn).toHaveAttribute('aria-disabled', 'true');
    userEvent.click(ascendingBtn as HTMLElement);
    expect(sortFromMenu).not.toHaveBeenCalled();
    userEvent.click(descendingBtn as HTMLElement);
    expect(sortFromMenu).not.toHaveBeenCalled();
  });

  it('should close the menu when the menu item is clicked', () => {
    const { getByRole, getByText } = renderTableHeadCellMenu();

    fireEvent.click(getByRole('button'));
    expect(getByRole('menu')).toBeVisible();
    fireEvent.click(getByText('SNTable.MenuItem.SortAscending'));
    expect(getByRole('menu')).not.toBeVisible();
  });

  it('should close the menu by clicking the menu button when the context menu is open', () => {
    const { getAllByRole, getByRole } = renderTableHeadCellMenu();

    fireEvent.click(getAllByRole('button')[0]);
    expect(getByRole('menu')).toBeVisible();
    fireEvent.click(getAllByRole('button')[0]);
    expect(getByRole('menu')).not.toBeVisible();
  });

  it('should call changeSortOrder when the sort item is clicked', () => {
    const { getByRole, getByText } = renderTableHeadCellMenu();
    fireEvent.click(getByRole('button'));
    fireEvent.click(getByText('SNTable.MenuItem.SortAscending'));
    expect(sortFromMenu).toHaveBeenCalled();
    fireEvent.click(getByText('SNTable.MenuItem.SortDescending'));
    expect(sortFromMenu).toHaveBeenCalled();
  });

  it('should call `embed.field` once while trying to open listbox filter', () => {
    renderTableHeadCellMenu();
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('SNTable.MenuItem.Search'));
    expect(screen.getByRole('menu')).not.toBeVisible();
    expect(embed?.field).toHaveBeenCalledTimes(1);
  });
});
