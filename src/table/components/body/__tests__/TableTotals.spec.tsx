import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';
import TableTotals from '../TableTotals';
import { TableContextProvider } from '../../../context';
import manageData from '../../../../handle-data';
import * as handleKeyPress from '../../../utils/handle-key-press';
import * as handleAccessibility from '../../../utils/accessibility-utils';
import { generateDataPages, generateLayout } from '../../../../__test__/generate-test-data';
import { TableData, ExtendedTheme, ExtendedSelectionAPI, PageInfo } from '../../../../types';

describe('<TableTotals />', () => {
  const rootElement = {} as HTMLElement;
  const model = { getHyperCubeData: async () => generateDataPages(2, 2) } as unknown as EngineAPI.IGenericObject;
  const layout = generateLayout(1, 1, 2, [], [{ qText: '350' }]);
  let tableData: TableData;
  let theme: ExtendedTheme;
  let selectionsAPI: ExtendedSelectionAPI;
  let keyboard: stardust.Keyboard;
  let areBasicFeaturesEnabled: boolean;

  const renderTableTotals = (cellCoordMock?: [number, number]) =>
    render(
      <TableContextProvider selectionsAPI={selectionsAPI} cellCoordMock={cellCoordMock}>
        <TableTotals
          rootElement={rootElement}
          tableData={tableData}
          theme={theme}
          layout={layout}
          keyboard={keyboard}
          selectionsAPI={selectionsAPI}
          areBasicFeaturesEnabled={areBasicFeaturesEnabled}
        />
      </TableContextProvider>
    );

  beforeEach(async () => {
    tableData = (await manageData(
      model,
      layout,
      { top: 0, height: 100 } as unknown as PageInfo,
      () => undefined
    )) as TableData;
    theme = {
      getColorPickerColor: () => undefined,
      name: () => undefined,
      getStyle: () => undefined,
      background: { isDark: false },
    } as unknown as ExtendedTheme;
    keyboard = {
      enabled: false,
    } as stardust.Keyboard;
    selectionsAPI = {
      isModal: () => false,
    } as ExtendedSelectionAPI;
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
