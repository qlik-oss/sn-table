import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TableHeadWrapper from '../TableHeadWrapper';
import * as handleKeyPress from '../../utils/handle-key-press';
import * as handleAccessibility from '../../utils/handle-accessibility';

describe('<TableHeadWrapper />', () => {
  const rootElement = {};
  const setFocusedCellCoord = () => {};
  let tableData;
  let theme;
  let layout;
  let changeSortOrder;
  let constraints;
  let selectionsAPI;
  let keyboard;
  let translator;
  let focusedCellCoord;

  beforeEach(() => {
    tableData = {
      columns: [
        { id: 1, align: 'left', label: 'someDim', sortDirection: 'asc', isDim: true, dataColIdx: 0 },
        { id: 2, align: 'right', label: 'someMsr', sortDirection: 'desc', isDim: false, dataColIdx: 1 },
      ],
    };
    theme = {
      getColorPickerColor: () => {},
      name: () => {},
    };
    layout = {
      qHyperCube: {
        qEffectiveInterColumnSortOrder: [0, 1],
      },
    };
    changeSortOrder = jest.fn();
    constraints = {
      active: false,
    };
    selectionsAPI = {
      isModal: () => false,
    };
    keyboard = {
      enabled: false,
    };
    translator = { get: (s) => s };
    focusedCellCoord = [0, 0];
  });

  it('should render table head', () => {
    const { queryByText } = render(
      <TableHeadWrapper
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );

    expect(queryByText(tableData.columns[0].label)).toBeVisible();
    expect(queryByText(tableData.columns[1].label)).toBeVisible();
  });

  it('should call changeSortOrder when clicking a header cell', () => {
    const { queryByText } = render(
      <TableHeadWrapper
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).toHaveBeenCalledWith(layout, tableData.columns[0]);
  });

  it('should not call changeSortOrder when clicking a header cell in edit mode', () => {
    constraints = {
      active: true,
    };
    const { queryByText } = render(
      <TableHeadWrapper
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).not.toHaveBeenCalled();
  });

  it('should not call changeSortOrder when clicking a header cell and cells are selected', () => {
    selectionsAPI = {
      isModal: () => true,
    };
    const { queryByText } = render(
      <TableHeadWrapper
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).not.toHaveBeenCalled();
  });

  it('should call headHandleKeyPress when keyDown on a header cell', () => {
    jest.spyOn(handleKeyPress, 'headHandleKeyPress').mockImplementation(() => jest.fn());

    const { queryByText } = render(
      <TableHeadWrapper
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );
    fireEvent.keyDown(queryByText(tableData.columns[0].label));

    expect(handleKeyPress.headHandleKeyPress).toHaveBeenCalledTimes(1);
  });

  it('should call handleClickToFocusHead when clicking a header cell', () => {
    jest.spyOn(handleAccessibility, 'handleClickToFocusHead').mockImplementation(() => jest.fn());

    const { queryByText } = render(
      <TableHeadWrapper
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );
    fireEvent.mouseDown(queryByText(tableData.columns[0].label));

    expect(handleAccessibility.handleClickToFocusHead).toHaveBeenCalledTimes(1);
  });

  it('should change `aria-pressed` and `aria-sort` when we sort by second column', () => {
    tableData = {
      columns: [
        { ...tableData.columns[0], sortDirection: 'desc' },
        { ...tableData.columns[1], sortDirection: 'asc' },
      ],
      columnOrder: tableData.columnOrder,
    };
    layout = {
      qHyperCube: {
        qEffectiveInterColumnSortOrder: [1, 0],
      },
    };

    const { queryByText } = render(
      <TableHeadWrapper
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );

    const firstColQuery = queryByText(tableData.columns[0].label).closest('th');
    const secondColQuery = queryByText(tableData.columns[1].label).closest('th');

    expect(firstColQuery.getAttribute('aria-sort')).toBeNull();
    expect(firstColQuery.getAttribute('aria-pressed')).toEqual('false');
    expect(secondColQuery.getAttribute('aria-sort')).toEqual('ascending');
    expect(secondColQuery.getAttribute('aria-pressed')).toEqual('true');
  });

  it('should render the visually hidden text instead of `aria-label` and has correct `scope` properly', () => {
    const { queryByText, queryByTestId } = render(
      <TableHeadWrapper
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );

    // check scope
    const tableColumn = queryByText(tableData.columns[0].label).closest('th');
    expect(tableColumn.getAttribute('scope')).toEqual('col');

    // check label
    const tableColumnSortlabel = queryByTestId('VHL-for-col-0');
    expect(tableColumnSortlabel).toHaveTextContent('SNTable.SortLabel.PressSpaceToSort');
  });

  it('should not render visually hidden text while we are out of table header', () => {
    focusedCellCoord = [1, 1];
    const { queryByTestId } = render(
      <TableHeadWrapper
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );

    const firstColHiddenLabel = queryByTestId('VHL-for-col-0');
    const secondColHiddenLabel = queryByTestId('VHL-for-col-1');

    expect(firstColHiddenLabel).toBeNull();
    expect(secondColHiddenLabel).toBeNull();
  });
});
