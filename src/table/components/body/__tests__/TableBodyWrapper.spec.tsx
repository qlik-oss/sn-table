import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { generateDataPages, generateLayout } from '../../../../__test__/generate-test-data';
import manageData from '../../../../handle-data';
import TableBodyWrapper from '../TableBodyWrapper';
import * as selectionsUtils from '../../../utils/selections-utils';
import * as getCellRenderer from '../../../utils/get-cell-renderer';
import * as handleKeyPress from '../../../utils/handle-key-press';
import * as handleClick from '../../../utils/handle-click';
import { TableData, ExtendedSelectionAPI, PageInfo, Cell } from '../../../../types';
import TestWithProviders from '../../../../__test__/test-with-providers';

describe('<TableBodyWrapper />', () => {
  const setShouldRefocus = () => undefined;
  const tableWrapperRef = {} as React.MutableRefObject<HTMLDivElement | null>;
  const announce = () => undefined;
  const model = { getHyperCubeData: async () => generateDataPages(2, 2) } as unknown as EngineAPI.IGenericObject;

  let tableData: TableData;
  let selectionsAPI: ExtendedSelectionAPI;
  let tableFirstRow: Cell;
  let tableSecondRow: Cell;
  let areBasicFeaturesEnabled: boolean;

  const renderTableBody = () =>
    render(
      <TestWithProviders selectionsAPI={selectionsAPI}>
        <TableBodyWrapper
          tableData={tableData}
          setShouldRefocus={setShouldRefocus}
          tableWrapperRef={tableWrapperRef}
          announce={announce}
          areBasicFeaturesEnabled={areBasicFeaturesEnabled}
        />
      </TestWithProviders>
    );

  beforeEach(async () => {
    jest.spyOn(selectionsUtils, 'addSelectionListeners').mockImplementation();
    tableData = (await manageData(
      model,
      generateLayout(1, 1, 2, [], [{ qText: '100' }]),
      { top: 0, height: 100 } as unknown as PageInfo,
      () => undefined
    )) as TableData;
    tableFirstRow = tableData.rows[0]['col-0'] as Cell;
    tableSecondRow = tableData.rows[0]['col-1'] as Cell;
    areBasicFeaturesEnabled = true;
    jest.spyOn(getCellRenderer, 'default');
  });

  afterEach(() => jest.clearAllMocks());

  it('should render 2x2 table body and call CellRenderer, without totals', () => {
    const { queryByText } = renderTableBody();

    expect(getCellRenderer.default).toHaveBeenCalledTimes(2);
    expect(queryByText(tableFirstRow.qText as string)).toBeVisible();
    expect(queryByText(tableSecondRow.qText as string)).toBeVisible();
    expect(queryByText(tableFirstRow.qText as string)).toBeVisible();
    expect(queryByText(tableSecondRow.qText as string)).toBeVisible();
    expect(queryByText(tableData.columns[0].totalInfo as string)).toBeNull();
  });

  it('should render table with totals', () => {
    tableData.totalsPosition.atTop = true;
    const { queryByText } = renderTableBody();

    expect(queryByText(tableFirstRow.qText as string)).toBeVisible();
    expect(queryByText(tableSecondRow.qText as string)).toBeVisible();
    expect(queryByText(tableFirstRow.qText as string)).toBeVisible();
    expect(queryByText(tableSecondRow.qText as string)).toBeVisible();
    expect(queryByText(tableData.columns[0].totalInfo as string)).toBeVisible();
  });

  it('should call handleBodyKeyDown on key down', () => {
    jest.spyOn(handleKeyPress, 'handleBodyKeyDown');

    const { getByText } = renderTableBody();
    fireEvent.keyDown(getByText(tableFirstRow.qText as string));

    expect(handleKeyPress.handleBodyKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should call handleClickToFocusBody on mouseDown', () => {
    jest.spyOn(handleClick, 'handleClickToFocusBody').mockImplementation();

    const { getByText } = renderTableBody();
    fireEvent.mouseDown(getByText(tableFirstRow.qText as string));

    expect(handleClick.handleClickToFocusBody).toHaveBeenCalledTimes(1);
  });

  it('should call handleBodyKeyUp on key up', () => {
    jest.spyOn(handleKeyPress, 'handleBodyKeyUp');

    const { getByText } = renderTableBody();
    fireEvent.keyUp(getByText(tableFirstRow.qText as string));

    expect(handleKeyPress.handleBodyKeyUp).toHaveBeenCalledTimes(1);
  });
});
