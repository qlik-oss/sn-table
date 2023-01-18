import React from 'react';
import { stardust } from '@nebula.js/stardust';
import { render, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExtendedTranslator, ExtendedSelectionAPI, SortDirection, TableLayout } from '../../../../types';
import { GeneratedStyling } from '../../../types';
import HeadCellMenu from '../HeadCellMenu';
import TestWithProviders from '../../../../__test__/test-with-providers';

describe('<HeadCellMenu />', () => {
  let translator: ExtendedTranslator;
  let selectionsAPI: ExtendedSelectionAPI;
  let headerStyle: GeneratedStyling;
  let sortFromMenu: (evt: React.MouseEvent, sortOrder: string) => void;
  const sortDirection: SortDirection = 'A';
  let isInteractionEnabled: boolean = true;
  let isCurrentColumnActive: boolean = false;
  let embed: stardust.Embed;
  let layout: TableLayout;
  const columnIndex = 0;
  const direction: 'ltr' | 'rtl' = 'ltr';

  const renderTableHeadCellMenu = (cellCoordMock?: [number, number]) =>
    render(
      <TestWithProviders selectionsAPI={selectionsAPI} cellCoordMock={cellCoordMock} direction={direction}>
        <HeadCellMenu
          isDimension
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
      </TestWithProviders>
    );

  beforeEach(() => {
    selectionsAPI = {
      isModal: () => false,
    } as ExtendedSelectionAPI;
    translator = { get: (s) => s } as ExtendedTranslator;
    headerStyle = {
      borderBottomColor: '#4287f5',
      borderRightColor: '#4287f5',
      borderLeftColor: '#4287f5',
      borderTopColor: '#4287f5',
    };
    sortFromMenu = jest.fn();
    embed = {
      field: jest.fn().mockResolvedValueOnce({ mount: jest.fn(), unmount: jest.fn() }),
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

  it('should render head cell menu button but the opacity is 0', () => {
    renderTableHeadCellMenu();

    const element = screen.getByRole('button');
    expect(element).toBeInTheDocument();
    expect(element).not.toBeVisible();
  });

  it('should open the menu only when the button is clicked', () => {
    renderTableHeadCellMenu();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toBeVisible();
    expect(screen.getByText('SNTable.MenuItem.SortAscending')).toBeVisible();
    expect(screen.getByText('SNTable.MenuItem.SortDescending')).toBeVisible();
  });

  it.skip('should disable sorting option when the column order is already set on that option', () => {
    isCurrentColumnActive = true;
    const { getByRole, getByText } = renderTableHeadCellMenu();
    fireEvent.click(getByRole('button'));
    const element = getByText('SNTable.MenuItem.SortAscending').closest('.sn-table-head-menu-item-button');
    expect(element).toHaveAttribute('aria-disabled', 'true');
    userEvent.click(element as HTMLElement);
    expect(sortFromMenu).not.toHaveBeenCalled();
  });

  it.skip('should disable sorting option when the column is in selection mode', () => {
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

  it('should close the menu when the menu item is clicked', async () => {
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole('button'));
    const menu = screen.queryByRole('menu');
    await waitFor(() => {
      expect(menu).toBeVisible();
    });
    fireEvent.click(screen.getByText('SNTable.MenuItem.SortAscending'));
    await waitForElementToBeRemoved(menu);
  });

  it('should close the menu by clicking the menu button when the context menu is open', async () => {
    renderTableHeadCellMenu();

    const button = screen.getByRole('button');
    fireEvent.click(button);
    const menu = screen.queryByRole('menu');
    await waitFor(() => {
      expect(menu).toBeVisible();
    });
    fireEvent.click(button);
    await waitForElementToBeRemoved(menu);
  });

  it.skip('should call changeSortOrder when the sort item is clicked', () => {
    const { getByRole, getByText } = renderTableHeadCellMenu();
    fireEvent.click(getByRole('button'));
    fireEvent.click(getByText('SNTable.MenuItem.SortAscending'));
    expect(sortFromMenu).toHaveBeenCalled();
    fireEvent.click(getByText('SNTable.MenuItem.SortDescending'));
    expect(sortFromMenu).toHaveBeenCalled();
  });

  it('should call `embed.field` once while trying to open listbox filter for a library dimension', async () => {
    layout = {
      qHyperCube: {
        qDimensionInfo: [{ qLibraryId: 'id' }],
      },
    } as TableLayout;
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole('button'));
    const menu = screen.queryByRole('menu');
    fireEvent.click(screen.getByText('SNTable.MenuItem.Search'));
    await waitForElementToBeRemoved(menu);
    expect(embed?.field).toHaveBeenCalledTimes(1);
    expect(embed?.field).toHaveBeenCalledWith({ qLibraryId: 'id', type: 'dimension' });
  });

  it('should call `embed.field` once while trying to open listbox filter for a dimension', async () => {
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole('button'));
    const menu = screen.queryByRole('menu');
    fireEvent.click(screen.getByText('SNTable.MenuItem.Search'));
    await waitForElementToBeRemoved(menu);
    expect(embed?.field).toHaveBeenCalledTimes(1);
    expect(embed?.field).toHaveBeenCalledWith('someTitle');
  });

  it('should not call `embed.field` if field ID is not found', async () => {
    layout = {
      qHyperCube: {
        qDimensionInfo: [],
      },
    } as unknown as TableLayout;
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole('button'));
    const menu = screen.queryByRole('menu');
    fireEvent.click(screen.getByText('SNTable.MenuItem.Search'));
    await waitForElementToBeRemoved(menu);
    expect(embed?.field).toHaveBeenCalledTimes(0);
  });
});
