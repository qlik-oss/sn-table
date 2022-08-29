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
import { TableData, ExtendedSelectionAPI, TableLayout, ExtendedTheme, PageInfo, Cell } from '../../../types';

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
          engagedColumn={undefined}
        >
          {children}
        </TableBodyWrapper>
      </TableContextProvider>
    );

  beforeEach(async () => {
    jest.spyOn(selectionsUtils, 'addSelectionListeners').mockImplementation();
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
    tableFirstRow = tableData.rows[0]['col-0'] as Cell;
  });

  afterEach(() => jest.clearAllMocks());

  it('should render 2x2 table body and call CellRenderer', () => {
    jest.spyOn(getCellRenderer, 'default');
    const { getByText } = renderTableBody();
    tableSecondRow = tableData.rows[0]['col-1'] as Cell;

    expect(getCellRenderer.default).toHaveBeenCalledTimes(2);
    expect(getByText(tableFirstRow.qText as string)).toBeVisible();
    expect(getByText(tableSecondRow.qText as string)).toBeVisible();
    expect(getByText(tableFirstRow.qText as string)).toBeVisible();
    expect(getByText(tableSecondRow.qText as string)).toBeVisible();
  });

  it('should call handleBodyKeyDown on key down', () => {
    jest.spyOn(handleKeyPress, 'handleBodyKeyDown');

    const { getByText } = renderTableBody();
    fireEvent.keyDown(getByText(tableFirstRow.qText as string));

    expect(handleKeyPress.handleBodyKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should call handleClickToFocusBody on mouseDown', () => {
    jest.spyOn(handleAccessibility, 'handleClickToFocusBody').mockImplementation();

    const { getByText } = renderTableBody();
    fireEvent.mouseDown(getByText(tableFirstRow.qText as string));

    expect(handleAccessibility.handleClickToFocusBody).toHaveBeenCalledTimes(1);
  });

  it('should call handleBodyKeyUp on key up', () => {
    jest.spyOn(handleKeyPress, 'handleBodyKeyUp');

    const { getByText } = renderTableBody();
    fireEvent.keyUp(getByText(tableFirstRow.qText as string));

    expect(handleKeyPress.handleBodyKeyUp).toHaveBeenCalledTimes(1);
  });
});
