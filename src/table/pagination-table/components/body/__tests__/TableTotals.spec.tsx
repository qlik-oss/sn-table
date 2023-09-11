import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TableTotals from '../TableTotals';
import manageData from '../../../../../handle-data';
import * as handleKeyPress from '../../../../utils/handle-keyboard';
import * as handleAccessibility from '../../../../utils/accessibility-utils';
import { generateDataPages, generateLayout } from '../../../../../__test__/generate-test-data';
import { TableData, ExtendedSelectionAPI, PageInfo, ViewService } from '../../../../../types';
import TestWithProviders from '../../../../../__test__/test-with-providers';

describe('<TableTotals />', () => {
  const model = { getHyperCubeData: async () => generateDataPages(2, 2) } as unknown as EngineAPI.IGenericObject;
  const layout = generateLayout(1, 1, 2, [], [{ qText: '350' }]);
  let viewService: ViewService;
  let tableData: TableData;
  let selectionsAPI: ExtendedSelectionAPI;

  const renderTableTotals = () =>
    render(
      <TestWithProviders selectionsAPI={selectionsAPI} tableData={tableData}>
        <table>
          <tbody>
            <TableTotals />
          </tbody>
        </table>
      </TestWithProviders>
    );

  beforeEach(async () => {
    viewService = {} as ViewService;
    tableData = (await manageData(
      model,
      layout,
      { top: 0, height: 100 } as unknown as PageInfo,
      () => undefined,
      viewService
    )) as TableData;
  });

  afterEach(() => jest.clearAllMocks());

  it('should show the total row when table totals', () => {
    const { queryByText } = renderTableTotals();
    expect(queryByText(tableData.columns[0].totalInfo)).toBeVisible();
    expect(queryByText(tableData.columns[1].totalInfo)).toBeVisible();
  });

  it('should call handleTotalKeyDown when keyDown on a total cell', () => {
    jest.spyOn(handleKeyPress, 'handleTotalKeyDown').mockImplementation(() => jest.fn());
    const { getByText } = renderTableTotals();
    fireEvent.keyDown(getByText(tableData.columns[0].totalInfo));
    expect(handleKeyPress.handleTotalKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should call removeAndFocus when clicking a total cell', () => {
    jest.spyOn(handleAccessibility, 'removeTabAndFocusCell').mockImplementation(() => jest.fn());
    const { getByText } = renderTableTotals();
    fireEvent.mouseDown(getByText(tableData.columns[0].totalInfo));
    expect(handleAccessibility.removeTabAndFocusCell).toHaveBeenCalledTimes(1);
  });
});
