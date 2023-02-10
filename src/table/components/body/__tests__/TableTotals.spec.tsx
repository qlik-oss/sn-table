import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TableTotals from '../TableTotals';
import manageData from '../../../../handle-data';
import * as handleKeyPress from '../../../utils/handle-key-press';
import * as handleAccessibility from '../../../utils/accessibility-utils';
import { generateDataPages, generateLayout } from '../../../../__test__/generate-test-data';
import { TableData, ExtendedSelectionAPI, PageInfo } from '../../../../types';
import TestWithProviders from '../../../../__test__/test-with-providers';

describe('<TableTotals />', () => {
  const model = { getHyperCubeData: async () => generateDataPages(2, 2) } as unknown as EngineAPI.IGenericObject;
  const layout = generateLayout(1, 1, 2, [], [{ qText: '350' }]);
  let tableData: TableData;
  let selectionsAPI: ExtendedSelectionAPI;
  let areBasicFeaturesEnabled: boolean;

  const renderTableTotals = (cellCoordMock?: [number, number]) =>
    render(
      <TestWithProviders selectionsAPI={selectionsAPI} cellCoordMock={cellCoordMock}>
        <table>
          <tbody>
            <TableTotals tableData={tableData} areBasicFeaturesEnabled={areBasicFeaturesEnabled} />
          </tbody>
        </table>
      </TestWithProviders>
    );

  beforeEach(async () => {
    tableData = (await manageData(
      model,
      layout,
      { top: 0, height: 100 } as unknown as PageInfo,
      () => undefined
    )) as TableData;
  });

  afterEach(() => jest.clearAllMocks());

  it('should show the total row when table totals', () => {
    const { queryByText } = renderTableTotals();
    expect(queryByText(tableData.columns[0].totalInfo as string)).toBeVisible();
    expect(queryByText(tableData.columns[1].totalInfo as string)).toBeVisible();
  });

  it('should call handleTotalKeyDown when keyDown on a total cell', () => {
    jest.spyOn(handleKeyPress, 'handleTotalKeyDown').mockImplementation(() => jest.fn());
    const { getByText } = renderTableTotals();
    fireEvent.keyDown(getByText(tableData.columns[0].totalInfo as string));
    expect(handleKeyPress.handleTotalKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should call removeAndFocus when clicking a total cell', () => {
    jest.spyOn(handleAccessibility, 'removeTabAndFocusCell').mockImplementation(() => jest.fn());
    const { getByText } = renderTableTotals();
    fireEvent.mouseDown(getByText(tableData.columns[0].totalInfo as string));
    expect(handleAccessibility.removeTabAndFocusCell).toHaveBeenCalledTimes(1);
  });
});
