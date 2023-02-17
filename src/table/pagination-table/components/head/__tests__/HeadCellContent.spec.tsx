import React from 'react';
import { stardust } from '@nebula.js/stardust';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import useEvent from '@testing-library/user-event';
import HeadCellContent from '../../../../components/head/HeadCellContent';
import { TableLayout, ChangeSortOrder, ExtendedSelectionAPI, Column } from '../../../../../types';
import TestWithProviders from '../../../../../__test__/test-with-providers';

describe('<HeadCellContent />', () => {
  let column: Column;
  let columnIndex: number;
  let isActive: boolean;
  let layout: TableLayout;
  let changeSortOrder: ChangeSortOrder;
  let constraints: stardust.Constraints;
  let selectionsAPI: ExtendedSelectionAPI;
  let areBasicFeaturesEnabled: boolean;

  const renderTableHead = (cellCoordMock?: [number, number]) =>
    render(
      <TestWithProviders
        selectionsAPI={selectionsAPI}
        cellCoordMock={cellCoordMock}
        constraints={constraints}
        layout={layout}
        changeSortOrder={changeSortOrder}
      >
        <HeadCellContent
          column={column}
          columnIndex={columnIndex}
          isActive={isActive}
          areBasicFeaturesEnabled={areBasicFeaturesEnabled}
        />
      </TestWithProviders>
    );

  beforeEach(() => {
    column = {
      id: '1',
      align: 'left',
      label: 'someDim',
      sortDirection: 'A',
      isDim: true,
      isLocked: false,
      colIdx: 0,
      qReverseSort: false,
    } as Column;
    columnIndex = 0;
    layout = {
      qHyperCube: {
        qEffectiveInterColumnSortOrder: [0, 1],
      },
    } as TableLayout;
    changeSortOrder = jest.fn() as ChangeSortOrder;
    constraints = {
      active: false,
    } as stardust.Constraints;
    selectionsAPI = {
      isModal: () => false,
    } as ExtendedSelectionAPI;
    areBasicFeaturesEnabled = false;
  });

  it('should show the menu button when the head cell is on focus', () => {
    areBasicFeaturesEnabled = true;
    const { baseElement } = renderTableHead();

    const labelButton = screen.getByText(column.label);
    // TODO: add a proper title for the button
    expect(baseElement.querySelector('#sn-table-head-menu-button')).not.toBeVisible();
    labelButton.focus();
    waitFor(async () => {
      expect(baseElement.querySelector('#sn-table-head-menu-button')).toBeVisible();
    });
  });

  it('should not show the menu button when column is a master dimension', () => {
    areBasicFeaturesEnabled = true;
    column = {
      ...column,
      isMasterItem: true,
    };
    const { baseElement } = renderTableHead();
    // TODO: add a proper title for the button
    expect(baseElement.querySelector('#sn-table-head-menu-button')).not.toBeInTheDocument();
  });

  it('should show the menu button when the head cell is hovered', () => {
    areBasicFeaturesEnabled = true;
    const { baseElement } = renderTableHead();

    expect(baseElement.querySelector('#sn-table-head-menu-button')).not.toBeVisible();
    useEvent.hover(baseElement);
    waitFor(async () => {
      expect(baseElement.querySelector('#sn-table-head-menu-button')).toBeVisible();
    });
    useEvent.unhover(baseElement);
    waitFor(async () => {
      expect(baseElement.querySelector('#sn-table-head-menu-button')).not.toBeVisible();
    });
  });

  it('should call changeSortOrder when clicking the head label', () => {
    renderTableHead();
    fireEvent.click(screen.getByText(column.label));

    expect(changeSortOrder).toHaveBeenCalledWith(column);
  });

  it('should not call changeSortOrder when clicking a header cell and constraints.active is true', () => {
    constraints = {
      active: true,
    };
    renderTableHead();
    fireEvent.click(screen.getByText(column.label));

    expect(changeSortOrder).not.toHaveBeenCalled();
  });

  it('should not call changeSortOrder when clicking a header cell and cells are selected', () => {
    selectionsAPI = {
      isModal: () => true,
    } as ExtendedSelectionAPI;
    renderTableHead();
    fireEvent.click(screen.getByText(column.label));

    expect(changeSortOrder).not.toHaveBeenCalled();
  });

  it('should show the lock icon only when the selections on dimensions are locked', () => {
    renderTableHead();
    expect(screen.queryByTestId('head-cell-lock-icon')).toBeNull();
    column.isLocked = true;
    renderTableHead();
    expect(screen.queryByTestId('head-cell-lock-icon')).toBeTruthy();
  });

  // it('should call handleHeadKeyDown when keyDown on a header cell', () => {
  //   jest.spyOn(handleKeyPress, 'handleHeadKeyDown').mockImplementation(() => jest.fn());

  //   const { getByText } = renderTableHead();
  //   fireEvent.keyDown(getByText(tableData.columns[0].label));

  //   expect(handleKeyPress.handleHeadKeyDown).toHaveBeenCalledTimes(1);
  // });

  // it('should call handleClickToFocusHead and handleMouseDownLabelToFocusHeadCell when clicking a header cell label', () => {
  //   jest.spyOn(handleClick, 'handleClickToFocusHead').mockImplementation(() => jest.fn());
  //   jest.spyOn(handleClick, 'handleMouseDownLabelToFocusHeadCell').mockImplementation(() => jest.fn());

  //   const { getByText } = renderTableHead();
  //   fireEvent.mouseDown(getByText(column.label));

  //   expect(handleClick.handleClickToFocusHead).toHaveBeenCalledTimes(1);
  //   expect(handleClick.handleMouseDownLabelToFocusHeadCell).toHaveBeenCalledTimes(1);
  // });

  // it('should render the visually hidden text instead of `aria-label` and has correct `scope` properly', () => {
  //   const { getByText, getByTestId } = renderTableHead();

  //   // check scope
  //   const tableColumn = getByText(column.label).closest('th');
  //   expect(tableColumn?.getAttribute('scope')).toBe('col');

  //   // check label
  //   const tableColumnSortLabel = getByTestId('VHL-for-col-0');
  //   expect(tableColumnSortLabel).toHaveTextContent('SNTable.SortLabel.PressSpaceToSort');
  // });

  // it('should not render visually hidden text while you are out of table header', () => {
  //   const { queryByTestId } = renderTableHead([1, 1]);

  //   const firstColHiddenLabel = queryByTestId('VHL-for-col-0');
  //   const secondColHiddenLabel = queryByTestId('VHL-for-col-1');

  //   expect(firstColHiddenLabel).toBeNull();
  //   expect(secondColHiddenLabel).toBeNull();
  // });
});
