import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TableContextProvider } from '../../../context';
import { ExtendedTranslator, ExtendedSelectionAPI } from '../../../../types';
import { GeneratedStyling } from '../../../types';
import HeadCellMenu from '../HeadCellMenu';

describe('<HeadCellMenu />', () => {
  let translator: ExtendedTranslator;
  let selectionsAPI: ExtendedSelectionAPI;
  let headerStyle: GeneratedStyling;

  const renderTableHeadCellMenu = (cellCoordMock?: [number, number]) =>
    render(
      <TableContextProvider selectionsAPI={selectionsAPI} cellCoordMock={cellCoordMock}>
        <HeadCellMenu headerStyle={headerStyle} translator={translator} />
      </TableContextProvider>
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
    expect(getByText('SNTable.SortItem.SortAscending')).toBeVisible();
    expect(getByText('SNTable.SortItem.SortDescending')).toBeVisible();
  });
});
