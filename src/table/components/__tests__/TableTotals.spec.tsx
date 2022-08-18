import React from 'react';
import { render, fireEvent, Matcher } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';
import TableTotals from '../TableTotals';
import { TableContextProvider } from '../../context';
import { getTotalPosition } from '../../../handle-data';
import * as handleKeyPress from '../../utils/handle-key-press';
import * as handleAccessibility from '../../utils/handle-accessibility';
import { generateLayout } from '../../../__test__/generate-test-data';
import { TableData, ExtendedTheme, TableLayout } from '../../../types';

describe('<TableTotals />', () => {
  const rootElement = {} as HTMLElement;
  let tableData: TableData;
  let theme: ExtendedTheme;
  let layout: TableLayout;
  let selectionsAPI: stardust.ObjectSelections;
  let keyboard: stardust.Keyboard;

  const renderTableTotals = (cellCoordMock?: [number, number]) =>
    render(
      <TableContextProvider selectionsAPI={selectionsAPI} cellCoordMock={cellCoordMock}>
        {((getTotalPosition(layout) === 'top') as unknown as HTMLElement) && (
          <TableTotals
            rootElement={rootElement}
            tableData={tableData}
            theme={theme}
            layout={layout}
            keyboard={keyboard}
          />
        )}
      </TableContextProvider>
    );

  beforeEach(() => {
    tableData = {
      columns: [
        { id: 1, isDim: true, dataColIdx: 0, totalInfo: 'Totals' },
        { id: 2, isDim: false, dataColIdx: 1, totalInfo: '350' },
      ],
      rows: ['rowOne', 'rowTwo'],
    } as unknown as TableData;
    theme = {
      getColorPickerColor: () => undefined,
      name: () => undefined,
      getStyle: () => undefined,
      table: { body: { borderColor: '' } },
    } as unknown as ExtendedTheme;
    layout = generateLayout(2, 2, 10, [], [{ qText: '350' }, { qText: '-' }]);
    keyboard = {
      enabled: false,
    } as stardust.Keyboard;
    selectionsAPI = {
      isModal: () => false,
    } as stardust.ObjectSelections;
  });

  it('should show the total row when table total is rendered', () => {
    layout.totals.position = 'top';
    const { queryByText } = renderTableTotals();
    expect(queryByText(tableData.columns[0].totalInfo as Matcher)).toHaveTextContent('Totals');
    expect(queryByText(tableData.columns[1].totalInfo as Matcher)).toHaveTextContent('350');
  });

  describe('Handle keys call when TableTotals is rendered', () => {
    beforeEach(() => {
      layout.totals.position = 'top';
    });
    afterEach(() => jest.clearAllMocks());
    it('should call handleTotalKeyDown when keyDown on a total cell', () => {
      jest.spyOn(handleKeyPress, 'handleTotalKeyDown').mockImplementation(() => jest.fn());
      const { queryByText } = renderTableTotals();
      fireEvent.keyDown(queryByText(tableData.columns[0].totalInfo as Matcher) as Element);
      expect(handleKeyPress.handleTotalKeyDown).toHaveBeenCalledTimes(1);
    });

    it('should call removeAndFocus when clicking a total cell', () => {
      jest.spyOn(handleAccessibility, 'removeAndFocus').mockImplementation(() => jest.fn());
      const { queryByText } = renderTableTotals();
      fireEvent.mouseDown(queryByText(tableData.columns[0].totalInfo as Matcher) as Element);
      expect(handleAccessibility.removeAndFocus).toHaveBeenCalledTimes(1);
    });
  });
});
