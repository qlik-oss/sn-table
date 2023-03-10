import React from 'react';
import { stardust } from '@nebula.js/stardust';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeadCellContent from '../HeadCellContent';
import { TableLayout, ChangeSortOrder, ExtendedSelectionAPI, Column, Align } from '../../../../types';
import TestWithProviders from '../../../../__test__/test-with-providers';
import CellText from '../../CellText';

describe('<HeadCellContent />', () => {
  let column: Column;
  let isActive: boolean;
  let align: Align;
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
          isActive={isActive}
          align={align}
          areBasicFeaturesEnabled={areBasicFeaturesEnabled}
        >
          <CellText>{column.label}</CellText>
        </HeadCellContent>
      </TestWithProviders>
    );

  beforeEach(() => {
    column = {
      id: '1',
      autoHeadCellTextAlign: 'left',
      autoTotalsCellTextAlgin: 'left',
      textAlign: {
        auto: true,
        align: 'left',
      },
      label: 'someDim',
      sortDirection: 'A',
      isDim: true,
      isLocked: false,
      colIdx: 0,
      qReverseSort: false,
      pageColIdx: 0,
    } as Column;
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
    isActive = true;
  });

  it('should show the sort icon when isActive is true', () => {
    const { baseElement } = renderTableHead();

    expect(baseElement.querySelector('.MuiButton-iconSizeSmall')).toBeVisible();
  });

  it('should show the sort icon when isActive is false but the cell is focused or hovered', () => {
    isActive = false;
    const { baseElement } = renderTableHead();

    const labelButton = screen.getByText(column.label);
    const sortIcon = baseElement.querySelector('.MuiButton-iconSizeSmall > svg') as Element;
    const style = window.getComputedStyle(sortIcon);
    expect(style.opacity).toEqual('0');

    labelButton.focus();
    waitFor(async () => {
      expect(sortIcon).toBeVisible();
    });
    labelButton.blur();
    waitFor(async () => {
      expect(sortIcon).not.toBeVisible();
    });

    userEvent.hover(sortIcon);
    waitFor(async () => {
      expect(sortIcon).toBeVisible();
    });
    userEvent.unhover(sortIcon);
    waitFor(async () => {
      expect(sortIcon).not.toBeVisible();
    });
  });

  it('should show the menu button when the head cell is focused or hovered', () => {
    areBasicFeaturesEnabled = true;
    const { baseElement } = renderTableHead();

    const labelButton = screen.getByText(column.label);
    const menuButton = baseElement.querySelector('#sn-table-head-menu-button');
    // TODO: add a proper title for the button
    expect(menuButton).not.toBeVisible();
    labelButton.focus();
    waitFor(async () => {
      expect(menuButton).toBeVisible();
    });
    labelButton.blur();
    waitFor(async () => {
      expect(labelButton).not.toBeVisible();
    });

    userEvent.hover(labelButton);
    waitFor(async () => {
      expect(menuButton).toBeVisible();
    });
    userEvent.unhover(labelButton);
    waitFor(async () => {
      expect(menuButton).not.toBeVisible();
    });
  });

  it('should show the menu button when column is a master dimension', () => {
    areBasicFeaturesEnabled = true;
    column = {
      ...column,
      qLibraryId: 'someLibId',
    };
    const { baseElement } = renderTableHead();
    // TODO: add a proper title for the button
    expect(baseElement.querySelector('#sn-table-head-menu-button')).toBeInTheDocument();
  });

  it('should hide the sort icon when constraints.active is true and focus is on the head cell', () => {
    selectionsAPI = {
      isModal: () => true,
    } as ExtendedSelectionAPI;
    const { baseElement } = renderTableHead();

    const sortIcon = baseElement.querySelector('.MuiButton-iconSizeSmall');
    expect(sortIcon).not.toBeVisible();
    expect(sortIcon).toBeInTheDocument();

    const labelButton = screen.getByText(column.label);
    labelButton.focus();
    waitFor(async () => {
      expect(sortIcon).not.toBeVisible();
    });
  });

  it('should hide the sort icon when cells are selected and focus is on the head cell', () => {
    selectionsAPI = {
      isModal: () => true,
    } as ExtendedSelectionAPI;
    const { baseElement } = renderTableHead();

    const sortIcon = baseElement.querySelector('.MuiButton-iconSizeSmall');
    expect(sortIcon).not.toBeVisible();
    expect(sortIcon).toBeInTheDocument();

    const labelButton = screen.getByText(column.label);
    labelButton.focus();
    waitFor(async () => {
      expect(sortIcon).not.toBeVisible();
    });
  });

  it('should hide the head menu button when constraints.active is true', () => {
    selectionsAPI = {
      isModal: () => true,
    } as ExtendedSelectionAPI;
    const { baseElement } = renderTableHead();

    expect(baseElement.querySelector('#sn-table-head-menu-button')).not.toBeInTheDocument();
  });

  it('should hide the head menu button when cells are selected', () => {
    selectionsAPI = {
      isModal: () => true,
    } as ExtendedSelectionAPI;
    const { baseElement } = renderTableHead();

    expect(baseElement.querySelector('#sn-table-head-menu-button')).not.toBeInTheDocument();
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
