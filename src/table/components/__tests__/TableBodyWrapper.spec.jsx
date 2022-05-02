import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { generateDataPages, generateLayout } from '../../../__test__/generate-test-data';
import manageData from '../../../handle-data';
import TableBodyWrapper from '../TableBodyWrapper';
import * as selectionsUtils from '../../utils/selections-utils';
import * as getCellRenderer from '../renderer';
import * as handleKeyPress from '../../utils/handle-key-press';
import * as handleAccessibility from '../../utils/handle-accessibility';

describe('<TableBodyWrapper />', () => {
  const rootElement = {};
  const setFocusedCellCoord = () => {};
  const setShouldRefocus = () => {};
  const keyboard = {};
  const tableWrapperRef = {};
  const announce = () => {};
  const model = { getHyperCubeData: async () => generateDataPages(2, 2, 2) };

  let tableData;
  let constraints;
  let selectionsAPI;
  let layout;
  let theme;
  let cellRendererSpy;

  beforeEach(async () => {
    jest.spyOn(selectionsUtils, 'addSelectionListeners').mockImplementation(() => jest.fn());

    tableData = await manageData(model, generateLayout(1, 1, 2), { top: 0, height: 100 });
    constraints = {};
    selectionsAPI = {
      isModal: () => true,
    };
    theme = {
      getColorPickerColor: () => {},
      name: () => {},
      getStyle: () => {},
      table: {
        body: { borderColor: '' },
      },
    };
    layout = {};
    cellRendererSpy = jest.fn();
  });

  afterEach(() => jest.clearAllMocks());

  it('should render 2x2 table body and call CellRenderer', () => {
    jest.spyOn(getCellRenderer, 'default').mockImplementation(() => {
      cellRendererSpy();
      return 'test';
    });

    const { queryByText } = render(
      <TableBodyWrapper
        tableData={tableData}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        layout={layout}
        theme={theme}
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        setShouldRefocus={setShouldRefocus}
        keyboard={keyboard}
        tableWrapperRef={tableWrapperRef}
        announce={announce}
      />
    );

    expect(cellRendererSpy).toHaveBeenCalledTimes(4);
    expect(queryByText(tableData.rows[0]['col-0'].qText)).toBeVisible();
    expect(queryByText(tableData.rows[0]['col-1'].qText)).toBeVisible();
    expect(queryByText(tableData.rows[1]['col-0'].qText)).toBeVisible();
    expect(queryByText(tableData.rows[1]['col-1'].qText)).toBeVisible();
  });

  it('should call bodyHandleKeyPress on key down', () => {
    jest.spyOn(handleKeyPress, 'bodyHandleKeyPress').mockImplementation(() => jest.fn());

    const { queryByText } = render(
      <TableBodyWrapper
        tableData={tableData}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        theme={theme}
        layout={layout}
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        setShouldRefocus={setShouldRefocus}
        keyboard={keyboard}
        tableWrapperRef={tableWrapperRef}
        announce={announce}
      />
    );
    fireEvent.keyDown(queryByText(tableData.rows[0]['col-0'].qText));

    expect(handleKeyPress.bodyHandleKeyPress).toHaveBeenCalledTimes(1);
  });

  it('should call handleClickToFocusBody on mouseDown', () => {
    jest.spyOn(handleAccessibility, 'handleClickToFocusBody').mockImplementation(() => jest.fn());

    const { queryByText } = render(
      <TableBodyWrapper
        tableData={tableData}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        theme={theme}
        layout={layout}
        rootElement={rootElement}
        setFocusedCellCoord={setFocusedCellCoord}
        setShouldRefocus={setShouldRefocus}
        keyboard={keyboard}
        tableWrapperRef={tableWrapperRef}
        announce={announce}
      />
    );
    fireEvent.mouseDown(queryByText(tableData.rows[0]['col-0'].qText));

    expect(handleAccessibility.handleClickToFocusBody).toHaveBeenCalledTimes(1);
  });
});
