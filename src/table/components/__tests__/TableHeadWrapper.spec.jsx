import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TableHeadWrapper from '../TableHeadWrapper';
import { TableContextProvider } from '../../context';
import * as handleKeyPress from '../../utils/handle-key-press';
import * as handleAccessibility from '../../utils/handle-accessibility';

describe('<TableHeadWrapper />', () => {
  const rootElement = {};
  let tableData;
  let theme;
  let layout;
  let changeSortOrder;
  let constraints;
  let selectionsAPI;
  let keyboard;
  let translator;

  const renderTableHead = (cellCoordMock) =>
    render(
      <TableContextProvider selectionsAPI={selectionsAPI} cellCoordMock={cellCoordMock}>
        <TableHeadWrapper
          rootElement={rootElement}
          constraints={constraints}
          selectionsAPI={selectionsAPI}
          tableData={tableData}
          theme={theme}
          layout={layout}
          changeSortOrder={changeSortOrder}
          keyboard={keyboard}
          translator={translator}
        />
      </TableContextProvider>
    );

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
      getStyle: () => {},
      table: { body: { borderColor: '' } },
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
  });

  it('should render table head', () => {
    const { queryByText } = renderTableHead();

    expect(queryByText(tableData.columns[0].label)).toBeVisible();
    expect(queryByText(tableData.columns[1].label)).toBeVisible();
  });

  it('should call changeSortOrder when clicking a header cell', () => {
    const { queryByText } = renderTableHead();
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).toHaveBeenCalledWith(layout, tableData.columns[0]);
  });

  it('should not call changeSortOrder when clicking a header cell in edit mode', () => {
    constraints = {
      active: true,
    };
    const { queryByText } = renderTableHead();
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).not.toHaveBeenCalled();
  });

  it('should not call changeSortOrder when clicking a header cell and cells are selected', () => {
    selectionsAPI = {
      isModal: () => true,
    };
    const { queryByText } = renderTableHead();
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).not.toHaveBeenCalled();
  });

  it('should call headHandleKeyPress when keyDown on a header cell', () => {
    jest.spyOn(handleKeyPress, 'headHandleKeyPress').mockImplementation(() => jest.fn());

    const { queryByText } = renderTableHead();
    fireEvent.keyDown(queryByText(tableData.columns[0].label));

    expect(handleKeyPress.headHandleKeyPress).toHaveBeenCalledTimes(1);
  });

  it('should call handleClickToFocusHead when clicking a header cell', () => {
    jest.spyOn(handleAccessibility, 'handleClickToFocusHead').mockImplementation(() => jest.fn());

    const { queryByText } = renderTableHead();
    fireEvent.mouseDown(queryByText(tableData.columns[0].label));

    expect(handleAccessibility.handleClickToFocusHead).toHaveBeenCalledTimes(1);
  });

  it('should change `aria-pressed` and `aria-sort` when you sort by second column', () => {
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

    const { queryByText } = renderTableHead();
    const firstColQuery = queryByText(tableData.columns[0].label).closest('th');
    const secondColQuery = queryByText(tableData.columns[1].label).closest('th');

    expect(firstColQuery.getAttribute('aria-sort')).toBeNull();
    expect(firstColQuery.getAttribute('aria-pressed')).toBe('false');
    expect(secondColQuery.getAttribute('aria-sort')).toBe('ascending');
    expect(secondColQuery.getAttribute('aria-pressed')).toBe('true');
  });

  it('should render the visually hidden text instead of `aria-label` and has correct `scope` properly', () => {
    const { queryByText, queryByTestId } = renderTableHead();

    // check scope
    const tableColumn = queryByText(tableData.columns[0].label).closest('th');
    expect(tableColumn.getAttribute('scope')).toBe('col');

    // check label
    const tableColumnSortlabel = queryByTestId('VHL-for-col-0');
    expect(tableColumnSortlabel).toHaveTextContent('SNTable.SortLabel.PressSpaceToSort');
  });

  it('should not render visually hidden text while you are out of table header', () => {
    const { queryByTestId } = renderTableHead([1, 1]);

    const firstColHiddenLabel = queryByTestId('VHL-for-col-0');
    const secondColHiddenLabel = queryByTestId('VHL-for-col-1');

    expect(firstColHiddenLabel).toBeNull();
    expect(secondColHiddenLabel).toBeNull();
  });
});
