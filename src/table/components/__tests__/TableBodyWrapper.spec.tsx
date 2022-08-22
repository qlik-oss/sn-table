import React from 'react';
import { stardust } from '@nebula.js/stardust';
import { render, fireEvent } from '@testing-library/react';
import { generateDataPages, generateLayout } from '../../../__test__/generate-test-data';
import manageData from '../../../handle-data';
import { TableContextProvider } from '../../context';
import TableBodyWrapper from '../TableBodyWrapper';
import * as selectionsUtils from '../../utils/selections-utils';
import * as getCellRenderer from '../../utils/get-cell-renderer';
import * as handleKeyPress from '../../utils/handle-key-press';
import * as handleAccessibility from '../../utils/handle-accessibility';
import {
  TableData,
  ExtendedSelectionAPI,
  TableLayout,
  ExtendedTheme,
  ChangeSortOrder,
  PageInfo,
  SetPageInfo,
  ExtendedTranslator,
  Cell,
  CellHOC,
} from '../../../types';

describe('<TableBodyWrapper />', () => {
  const rootElement = {} as HTMLElement;
  const setShouldRefocus = () => undefined;
  const keyboard = {} as stardust.Keyboard;
  const tableWrapperRef = {} as React.MutableRefObject<HTMLDivElement | undefined>;
  const announce = () => undefined;
  const model = { getHyperCubeData: async () => generateDataPages(2, 2) } as unknown as EngineAPI.IGenericObject;

  let tableData: TableData;
  let constraints: stardust.Constraints;
  let selectionsAPI: ExtendedSelectionAPI;
  let layout: TableLayout;
  let theme: ExtendedTheme;
  let children: JSX.Element;
  let tableFirstRow: Cell;
  let tableSecondRow: Cell;

  let cellRendererSpy: () => CellHOC;

  const renderTableBody = () =>
    render(
      <TableContextProvider selectionsAPI={selectionsAPI}>
        <TableBodyWrapper
          tableData={tableData}
          constraints={constraints}
          selectionsAPI={selectionsAPI}
          layout={layout}
          theme={theme}
          rootElement={rootElement}
          setShouldRefocus={setShouldRefocus}
          keyboard={keyboard}
          tableWrapperRef={tableWrapperRef}
          announce={announce}
        >
          {children}
        </TableBodyWrapper>
      </TableContextProvider>
    );

  beforeEach(async () => {
    jest.spyOn(selectionsUtils, 'addSelectionListeners').mockImplementation(() => jest.fn());
    tableData = (await manageData(
      model,
      generateLayout(1, 1, 2, [], [{ qText: '100' }]),
      { top: 0, height: 100 } as unknown as PageInfo,
      () => undefined
    )) as TableData;
    constraints = {};
    selectionsAPI = {
      isModal: () => true,
    } as ExtendedSelectionAPI;
    theme = {
      getColorPickerColor: () => undefined,
      name: () => undefined,
      getStyle: () => undefined,
      table: { body: { borderColor: '' } },
    } as unknown as ExtendedTheme;
    layout = {} as TableLayout;
    cellRendererSpy = jest.fn();
    tableFirstRow = tableData.rows[0]['col-0'] as Cell;
  });

  afterEach(() => jest.clearAllMocks());

  it('should render 2x2 table body and call CellRenderer', () => {
    jest.spyOn(getCellRenderer, 'default').mockImplementation(() => {
      cellRendererSpy();
      return 'td' as unknown as CellHOC;
    });

    const { queryByText } = renderTableBody();
    tableSecondRow = tableData.rows[0]['col-1'] as Cell;

    expect(cellRendererSpy).toHaveBeenCalledTimes(2);
    expect(queryByText(tableFirstRow.qText as string)).toBeVisible();
    expect(queryByText(tableSecondRow.qText as string)).toBeVisible();
    expect(queryByText(tableFirstRow.qText as string)).toBeVisible();
    expect(queryByText(tableSecondRow.qText as string)).toBeVisible();
  });

  it('should call handleBodyKeyDown on key down', () => {
    jest.spyOn(handleKeyPress, 'handleBodyKeyDown').mockImplementation(() => jest.fn());

    const { queryByText } = renderTableBody();
    fireEvent.keyDown(queryByText(tableFirstRow.qText as string) as unknown as HTMLElement);

    expect(handleKeyPress.handleBodyKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should call handleClickToFocusBody on mouseDown', () => {
    jest.spyOn(handleAccessibility, 'handleClickToFocusBody').mockImplementation(() => jest.fn());

    const { queryByText } = renderTableBody();
    fireEvent.mouseDown(queryByText(tableFirstRow.qText as string) as unknown as HTMLElement);

    expect(handleAccessibility.handleClickToFocusBody).toHaveBeenCalledTimes(1);
  });

  it('should call handleBodyKeyUp on key up', () => {
    jest.spyOn(handleKeyPress, 'handleBodyKeyUp').mockImplementation(() => jest.fn());

    const { queryByText } = renderTableBody();
    fireEvent.keyUp(queryByText(tableFirstRow.qText as string) as unknown as HTMLElement);

    expect(handleKeyPress.handleBodyKeyUp).toHaveBeenCalledTimes(1);
  });
});
