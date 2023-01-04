import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TableContextProvider } from '../../../context';
import { ExtendedTranslator, ExtendedSelectionAPI, SortDirection } from '../../../../types';
import { GeneratedStyling } from '../../../types';
import HeadCellMenu from '../HeadCellMenu';

describe('<HeadCellMenu />', () => {
  let translator: ExtendedTranslator;
  let selectionsAPI: ExtendedSelectionAPI;
  let headerStyle: GeneratedStyling;
  let sortFromMenu: (evt: React.MouseEvent, sortOrder: string) => void;
  const sortDirection: SortDirection = 'A';
  let isInteractionEnabled: boolean = true;
  let isCurrentColumnActive: boolean = false;

  const renderTableHeadCellMenu = (cellCoordMock?: [number, number]) =>
    render(
      <TableContextProvider selectionsAPI={selectionsAPI} cellCoordMock={cellCoordMock}>
        <HeadCellMenu
          headerStyle={headerStyle}
          translator={translator}
          sortDirection={sortDirection}
          sortFromMenu={sortFromMenu}
          isInteractionEnabled={isInteractionEnabled}
          isCurrentColumnActive={isCurrentColumnActive}
        />
      </TableContextProvider>
    );

  beforeEach(() => {
    selectionsAPI = {
      isModal: () => false,
    } as ExtendedSelectionAPI;
    translator = { get: (s) => s } as ExtendedTranslator;
    headerStyle = {
      borderBottomColor: '#4287f5',
      borderRightColor: '#4287f5',
    };
    sortFromMenu = jest.fn();
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
});
