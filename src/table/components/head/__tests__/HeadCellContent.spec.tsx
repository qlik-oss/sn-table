import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeadCellContent from '../HeadCellContent';
import { TableLayout, ChangeSortOrder, Column } from '../../../../types';
import TestWithProviders from '../../../../__test__/test-with-providers';
import CellText from '../../CellText';

describe('<HeadCellContent />', () => {
  let column: Column;
  let isActive: boolean;
  let isInteractionEnabled: boolean;
  let layout: TableLayout;
  let changeSortOrder: ChangeSortOrder;

  const renderTableHead = (cellCoordMock?: [number, number]) =>
    render(
      <TestWithProviders cellCoordMock={cellCoordMock} layout={layout} changeSortOrder={changeSortOrder}>
        <HeadCellContent column={column} isActive={isActive} isInteractionEnabled={isInteractionEnabled}>
          <CellText>{column.label}</CellText>
        </HeadCellContent>
      </TestWithProviders>
    );

  beforeEach(() => {
    column = {
      id: '1',
      headTextAlign: 'left',
      totalsTextAlign: 'left',
      bodyTextAlign: 'left',
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
      qInfo: { qId: '12345' },
    } as TableLayout;
    changeSortOrder = jest.fn() as ChangeSortOrder;
    isActive = true;
    isInteractionEnabled = true;
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
    const { baseElement } = renderTableHead();

    const labelButton = screen.getByText(column.label);
    const menuButton = baseElement.querySelector('.sn-table-head-menu-button');
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
    column = {
      ...column,
      qLibraryId: 'someLibId',
    };
    const { baseElement } = renderTableHead();
    // TODO: add a proper title for the button
    expect(baseElement.querySelector('.sn-table-head-menu-button')).toBeInTheDocument();
  });

  it('should hide the sort icon when isInteractionEnabled is false and focus is within the head cell', () => {
    isInteractionEnabled = false;
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

  it('should hide the head menu button when isInteractionEnabled is false', () => {
    isInteractionEnabled = false;
    const { baseElement } = renderTableHead();

    expect(baseElement.querySelector('.sn-table-head-menu-button')).not.toBeInTheDocument();
  });

  it('should call changeSortOrder when clicking the head label', () => {
    renderTableHead();
    fireEvent.click(screen.getByText(column.label));

    expect(changeSortOrder).toHaveBeenCalledWith(column);
  });

  it('should not call changeSortOrder when clicking a header cell and isInteractionEnabled is false', () => {
    isInteractionEnabled = false;
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

  it('should render the visually hidden text instead of `aria-label` and has correct `scope` properly', () => {
    const { getByTestId } = renderTableHead();

    // check label
    const tableColumnSortLabel = getByTestId('VHL-for-col-0');
    expect(tableColumnSortLabel).toHaveTextContent('SNTable.SortLabel.PressSpaceToSort');
  });

  it('should not render visually hidden text while you are out of table header', () => {
    const { queryByTestId } = renderTableHead([1, 1]);

    const firstColHiddenLabel = queryByTestId('VHL-for-col-0');
    const secondColHiddenLabel = queryByTestId('VHL-for-col-1');

    expect(firstColHiddenLabel).toBeNull();
    expect(secondColHiddenLabel).toBeNull();
  });
});
