import React from 'react';
import { stardust } from '@nebula.js/stardust';
import { render, fireEvent, waitFor } from '@testing-library/react';
import useEvent from '@testing-library/user-event';
import TableHeadWrapper from '../TableHeadWrapper';
import { TableContextProvider } from '../../../context';
import * as handleKeyPress from '../../../utils/handle-key-press';
import * as handleClick from '../../../utils/handle-click';
import {
  TableData,
  TableLayout,
  ExtendedTheme,
  ChangeSortOrder,
  ExtendedTranslator,
  ExtendedSelectionAPI,
} from '../../../../types';

describe('<TableHeadWrapper />', () => {
  const rootElement = {} as HTMLElement;
  let tableData: TableData;
  let theme: ExtendedTheme;
  let layout: TableLayout;
  let changeSortOrder: ChangeSortOrder;
  let constraints: stardust.Constraints;
  let selectionsAPI: ExtendedSelectionAPI;
  let keyboard: stardust.Keyboard;
  let translator: ExtendedTranslator;
  let areBasicFeaturesEnabled: boolean;

  const renderTableHead = (cellCoordMock?: [number, number]) =>
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
          areBasicFeaturesEnabled={areBasicFeaturesEnabled}
        />
      </TableContextProvider>
    );

  beforeEach(() => {
    tableData = {
      columns: [
        {
          id: 1,
          align: 'left',
          label: 'someDim',
          sortDirection: 'A',
          isDim: true,
          isLocked: false,
          colIdx: 0,
          qReverseSort: false,
        },
        { id: 2, align: 'right', label: 'someMsr', sortDirection: 'D', isDim: false, colIdx: 1, qReverseSort: false },
      ],
    } as unknown as TableData;
    theme = {
      getColorPickerColor: () => undefined,
      name: () => undefined,
      getStyle: () => undefined,
      background: { isDark: false },
    } as unknown as ExtendedTheme;
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
    keyboard = {
      enabled: false,
    } as stardust.Keyboard;
    translator = { get: (s) => s } as ExtendedTranslator;
    areBasicFeaturesEnabled = false;
  });

  it('should render table head', () => {
    const { queryByText } = renderTableHead();

    expect(queryByText(tableData.columns[0].label)).toBeVisible();
    expect(queryByText(tableData.columns[1].label)).toBeVisible();
  });

  it('should show the menu button when the head cell is on focus', () => {
    areBasicFeaturesEnabled = true;
    const { getByText } = renderTableHead();

    const element = getByText(tableData.columns[0].label).closest('th') as HTMLTableCellElement;
    expect(element.querySelector('#sn-table-head-menu-button')).not.toBeVisible();
    element.focus();
    waitFor(async () => {
      expect(element.querySelector('#sn-table-head-menu-button')).toBeVisible();
    });
  });

  it('should show the menu button when the head cell is hovered', () => {
    areBasicFeaturesEnabled = true;
    const { getByText } = renderTableHead();

    const element = getByText(tableData.columns[0].label).closest('th') as HTMLTableCellElement;
    expect(element.querySelector('#sn-table-head-menu-button')).not.toBeVisible();
    useEvent.hover(element);
    waitFor(async () => {
      expect(element.querySelector('#sn-table-head-menu-button')).toBeVisible();
    });
    useEvent.unhover(element);
    waitFor(async () => {
      expect(element.querySelector('#sn-table-head-menu-button')).not.toBeVisible();
    });
  });

  it('should call changeSortOrder when clicking the header cell', () => {
    const { getByText } = renderTableHead();
    fireEvent.click(getByText(tableData.columns[0].label));

    expect(changeSortOrder).toHaveBeenCalledWith(tableData.columns[0]);
  });

  it('should not call changeSortOrder when clicking a header cell in edit mode', () => {
    constraints = {
      active: true,
    };
    const { getByText } = renderTableHead();
    fireEvent.click(getByText(tableData.columns[0].label));

    expect(changeSortOrder).not.toHaveBeenCalled();
  });

  it('should not call changeSortOrder when clicking a header cell and cells are selected', () => {
    selectionsAPI = {
      isModal: () => true,
    } as ExtendedSelectionAPI;
    const { getByText } = renderTableHead();
    fireEvent.click(getByText(tableData.columns[0].label));

    expect(changeSortOrder).not.toHaveBeenCalled();
  });

  it('should show the lock icon only when the selections on dimensions are locked', () => {
    const { queryByTestId } = renderTableHead();
    expect(queryByTestId('head-cell-lock-icon')).toBeNull();
    tableData.columns[0].isLocked = true;
    renderTableHead();
    expect(queryByTestId('head-cell-lock-icon')).toBeTruthy();
  });

  it('should call handleHeadKeyDown when keyDown on a header cell', () => {
    jest.spyOn(handleKeyPress, 'handleHeadKeyDown').mockImplementation(() => jest.fn());

    const { getByText } = renderTableHead();
    fireEvent.keyDown(getByText(tableData.columns[0].label));

    expect(handleKeyPress.handleHeadKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should call handleClickToFocusHead and handleMouseDownLabelToFocusHeadCell when clicking a header cell label', () => {
    jest.spyOn(handleClick, 'handleClickToFocusHead').mockImplementation(() => jest.fn());
    jest.spyOn(handleClick, 'handleMouseDownLabelToFocusHeadCell').mockImplementation(() => jest.fn());

    const { getByText } = renderTableHead();
    fireEvent.mouseDown(getByText(tableData.columns[0].label));

    expect(handleClick.handleClickToFocusHead).toHaveBeenCalledTimes(1);
    expect(handleClick.handleMouseDownLabelToFocusHeadCell).toHaveBeenCalledTimes(1);
  });

  it('should change `aria-pressed` and `aria-sort` when you sort by second column', () => {
    tableData = {
      columns: [
        { ...tableData.columns[0], sortDirection: 'D' },
        { ...tableData.columns[1], sortDirection: 'A' },
      ],
    } as unknown as TableData;
    layout = {
      qHyperCube: {
        qEffectiveInterColumnSortOrder: [1, 0],
      },
    } as TableLayout;

    const { getByText } = renderTableHead();
    const firstColQuery = getByText(tableData.columns[0].label).closest('th') as HTMLTableCellElement;
    const secondColQuery = getByText(tableData.columns[1].label).closest('th') as HTMLTableCellElement;

    expect(firstColQuery.getAttribute('aria-sort')).toBeNull();
    expect(firstColQuery.getAttribute('aria-pressed')).toBeNull();
    expect(secondColQuery.getAttribute('aria-sort')).toBe('ascending');
    expect(secondColQuery.getAttribute('aria-pressed')).toBe('true');
  });

  it('should render the visually hidden text instead of `aria-label` and has correct `scope` properly', () => {
    const { getByText, getByTestId } = renderTableHead();

    // check scope
    const tableColumn = getByText(tableData.columns[0].label).closest('th');
    expect(tableColumn?.getAttribute('scope')).toBe('col');

    // check label
    const tableColumnSortlabel = getByTestId('VHL-for-col-0');
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
