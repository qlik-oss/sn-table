import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TableTotals from '../TableTotals';
import { getTotalPosition } from '../../../handle-data';
import { TableContextProvider } from '../../context';
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
        {(getTotalPosition(layout) === 'top' || getTotalPosition(layout) === 'bottom') && (
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

  describe('getTotalPosition:', () => {
    describe('When total auto mode is off', () => {
      it('should return noTotals and not to show totals when the position is set to none', () => {
        layout.totals.position = 'noTotals';
        expect(getTotalPosition(layout)).toBe('noTotals');
        const { queryByText } = renderTableTotals();
        expect(queryByText(tableData.columns[0].totalInfo)).not.toBeInTheDocument();
        expect(queryByText(tableData.columns[1].totalInfo)).not.toBeInTheDocument();
      });

      it('should return top and show totals when the position is set to top', () => {
        layout.totals.position = 'top';
        expect(getTotalPosition(layout)).toBe('top');
        const { queryByText } = renderTableTotals();
        expect(queryByText(tableData.columns[0].totalInfo)).toHaveTextContent('Totals');
        expect(queryByText(tableData.columns[1].totalInfo)).toHaveTextContent('350');
      });

      it('should return bottom when the position is set to bottom', () => {
        layout.totals.position = 'bottom';
        expect(getTotalPosition(layout)).toBe('bottom');
      });

      it('should not show totals when the position is set to be visible but there is no grandTotal', () => {
        layout.qHyperCube.qGrandTotalRow.length = 0;
        expect(getTotalPosition(layout)).toBe('noTotals');
        const { queryByText } = renderTableTotals();
        expect(queryByText(tableData.columns[0].totalInfo)).not.toBeInTheDocument();
        expect(queryByText(tableData.columns[1].totalInfo)).not.toBeInTheDocument();
      });

      it('should not show totals when position is set to be visible but table has only dimension', () => {
        tableData = {
          columns: [{ id: 0, isDim: true, dataColIdx: 0, totalInfo: 'Totals' }],
        };
        layout.qHyperCube.qMeasureInfo.length = 0;
        expect(getTotalPosition(layout)).toBe('noTotals');
        const { queryByText } = renderTableTotals();
        expect(queryByText(tableData.columns[0].totalInfo)).not.toBeInTheDocument();
      });

      it('should show totals when table has only measure', () => {
        tableData = {
          columns: [{ id: 0, isDim: false, dataColIdx: 0, totalInfo: '350' }],
        };
        layout.qHyperCube.qDimensionInfo.length = 0;
        layout.totals.position = 'top';
        expect(getTotalPosition(layout)).toBe('top');
        const { queryByText } = renderTableTotals();
        expect(queryByText(tableData.columns[0].totalInfo)).toHaveTextContent('350');
      });
    });

    describe('When total auto mode is on', () => {
      it('should show totals at top by default', () => {
        layout.totals.show = true;
        layout.totals.position = 'noTotals';
        expect(getTotalPosition(layout)).toBe('top');
        const { queryByText } = renderTableTotals();
        expect(queryByText(tableData.columns[0].totalInfo)).toHaveTextContent('Totals');
        expect(queryByText(tableData.columns[1].totalInfo)).toHaveTextContent('350');
      });

      it('should return not show totals when table has only measure', () => {
        tableData = {
          columns: [{ id: 0, isDim: false, dataColIdx: 0, totalInfo: '350' }],
        };
        layout.totals.show = true;
        layout.qHyperCube.qDimensionInfo.length = 0;
        expect(getTotalPosition(layout)).toBe('noTotals');
        const { queryByText } = renderTableTotals();
        expect(queryByText(tableData.columns[0].totalInfo)).not.toBeInTheDocument();
      });
    });
  });

  describe('Handle keys call when TableTotals is rendered', () => {
    beforeEach(() => {
      layout.totals.position = 'top';
    });
    it('should call totalHandleKeyPress when keyDown on a total cell', () => {
      jest.spyOn(handleKeyPress, 'totalHandleKeyPress').mockImplementation(() => jest.fn());
      const { queryByText } = renderTableTotals();
      fireEvent.keyDown(queryByText(tableData.columns[0].totalInfo));
      expect(handleKeyPress.totalHandleKeyPress).toHaveBeenCalledTimes(1);
    });

    it('should call removeAndFocus when clicking a total cell', () => {
      jest.spyOn(handleAccessibility, 'removeAndFocus').mockImplementation(() => jest.fn());
      const { queryByText } = renderTableTotals();
      fireEvent.mouseDown(queryByText(tableData.columns[0].totalInfo));
      expect(handleAccessibility.removeAndFocus).toHaveBeenCalledTimes(1);
    });
  });
});
