import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TableContextProvider } from '../../context';
import { ExtendedTranslator, ExtendedSelectionAPI } from '../../../types';
import { GeneratedStyling } from '../../types';
import HeadCellMenu from '../HeadCellMenu';

describe('<HeadCellMenu />', () => {
  let translator: ExtendedTranslator;
  let selectionsAPI: ExtendedSelectionAPI;
  let headerStyle: GeneratedStyling;
  let sortFromMenu: (evt: React.MouseEvent, sortOrder: string) => void;

  const renderTableHeadCellMenu = (cellCoordMock?: [number, number]) =>
    render(
      <TableContextProvider selectionsAPI={selectionsAPI} cellCoordMock={cellCoordMock}>
        <HeadCellMenu headerStyle={headerStyle} translator={translator} sortFromMenu={sortFromMenu} />
      </TableContextProvider>
    );

  beforeEach(() => {
    selectionsAPI = {
      isModal: () => false,
    } as ExtendedSelectionAPI;
    translator = { get: (s) => s } as ExtendedTranslator;
    headerStyle = {
      sortLabelColor: '#4287f5',
      borderStyle: 'solid',
      borderColor: '#4287f5',
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

  it('should call changeSortOrder when the sort item is clicked', () => {
    const { getByRole, getByText } = renderTableHeadCellMenu();
    fireEvent.click(getByRole('button'));
    fireEvent.click(getByText('SNTable.MenuItem.SortAscending'));
    expect(sortFromMenu).toHaveBeenCalled();
    fireEvent.click(getByText('SNTable.MenuItem.SortDescending'));
    expect(sortFromMenu).toHaveBeenCalled();
  });
});
