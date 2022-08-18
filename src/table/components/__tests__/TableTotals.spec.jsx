import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TableTotals from '../TableTotals';
import { TableContextProvider } from '../../context';
import { getTotalPosition } from '../../../handle-data';
import * as handleKeyPress from '../../utils/handle-key-press';
import * as handleAccessibility from '../../utils/handle-accessibility';
import { generateLayout } from '../../../__test__/generate-test-data';

describe('<TableTotals />', () => {
  const rootElement = {};
  let tableData;
  let theme;
  let layout;
  let selectionsAPI;
  let keyboard;
  let translator;

  const renderTableTotals = (cellCoordMock) =>
    render(
      <TableContextProvider selectionsAPI={selectionsAPI} cellCoordMock={cellCoordMock}>
        {getTotalPosition(layout) === 'top' && (
          <TableTotals
            rootElement={rootElement}
            tableData={tableData}
            theme={theme}
            layout={layout}
            keyboard={keyboard}
            translator={translator}
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
    };
    theme = {
      getColorPickerColor: () => {},
      name: () => {},
      getStyle: () => {},
      table: { body: { borderColor: '' } },
    };
    layout = generateLayout(2, 2, 10, [], [{ qText: '350' }, { qText: '-' }]);
    keyboard = {
      enabled: false,
    };
    translator = { get: (s) => s };
    selectionsAPI = {
      isModal: () => false,
    };
  });

  it('should show the total row when table total is rendered', () => {
    layout.totals.position = 'top';
    const { queryByText } = renderTableTotals();
    expect(queryByText(tableData.columns[0].totalInfo)).toHaveTextContent('Totals');
    expect(queryByText(tableData.columns[1].totalInfo)).toHaveTextContent('350');
  });

  describe('Handle keys call when TableTotals is rendered', () => {
    beforeEach(() => {
      layout.totals.position = 'top';
    });
    afterEach(() => jest.clearAllMocks());
    it('should call handleTotalKeyDown when keyDown on a total cell', () => {
      jest.spyOn(handleKeyPress, 'handleTotalKeyDown').mockImplementation(() => jest.fn());
      const { queryByText } = renderTableTotals();
      fireEvent.keyDown(queryByText(tableData.columns[0].totalInfo));
      expect(handleKeyPress.handleTotalKeyDown).toHaveBeenCalledTimes(1);
    });

    it('should call removeAndFocus when clicking a total cell', () => {
      jest.spyOn(handleAccessibility, 'removeAndFocus').mockImplementation(() => jest.fn());
      const { queryByText } = renderTableTotals();
      fireEvent.mouseDown(queryByText(tableData.columns[0].totalInfo));
      expect(handleAccessibility.removeAndFocus).toHaveBeenCalledTimes(1);
    });
  });
});
