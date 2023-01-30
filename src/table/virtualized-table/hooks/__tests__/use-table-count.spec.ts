import { stardust } from '@nebula.js/stardust';
import { renderHook } from '@testing-library/react';
import { PageInfo, TableLayout } from '../../../../types';
import { MIN_BODY_ROW_HEIGHT, MAX_PAGE_SIZE } from '../../constants';
import useTableCount from '../use-table-count';

describe('useTableCount', () => {
  let layout: TableLayout;
  let pageInfo: PageInfo;
  let rect: stardust.Rect;
  let columnWidth: number[];

  beforeEach(() => {
    layout = {
      qHyperCube: {
        qSize: {
          qcx: 10,
          qcy: 20,
        },
      },
    } as TableLayout;

    pageInfo = {
      page: 0,
      rowsPerPage: MAX_PAGE_SIZE,
      rowsPerPageOptions: [],
    };

    rect = {
      left: 0,
      top: 0,
      width: 200,
      height: 10 * MIN_BODY_ROW_HEIGHT,
    };

    columnWidth = [50, 150, 200];
  });

  describe('rowCount', () => {
    test('should be capped at max page size', () => {
      layout.qHyperCube.qSize.qcy = MAX_PAGE_SIZE * 2;
      const { result } = renderHook(() => useTableCount(layout, pageInfo, rect, columnWidth, MIN_BODY_ROW_HEIGHT));

      expect(result.current.rowCount).toEqual(MAX_PAGE_SIZE);
    });

    test('should return rowCount for current page', () => {
      const expectedRowCount = 100;
      layout.qHyperCube.qSize.qcy = MAX_PAGE_SIZE + expectedRowCount;
      pageInfo.page = 1;

      const { result } = renderHook(() => useTableCount(layout, pageInfo, rect, columnWidth, MIN_BODY_ROW_HEIGHT));

      expect(result.current.rowCount).toEqual(expectedRowCount);
    });

    test('should return rowCount when number of data rows is less than max page size', () => {
      layout.qHyperCube.qSize.qcy = 2500;

      const { result } = renderHook(() => useTableCount(layout, pageInfo, rect, columnWidth, MIN_BODY_ROW_HEIGHT));

      expect(result.current.rowCount).toEqual(2500);
    });
  });

  describe('visibleRowCount', () => {
    test('should handle when number of rows is less than the number of rows that can be rendered', () => {
      const expectedVisibleRowCount = 10;
      layout.qHyperCube.qSize.qcy = expectedVisibleRowCount;
      rect.height = 20 * MIN_BODY_ROW_HEIGHT; // number of rows that can be rendered

      const { result } = renderHook(() => useTableCount(layout, pageInfo, rect, columnWidth, MIN_BODY_ROW_HEIGHT));

      expect(result.current.visibleRowCount).toEqual(expectedVisibleRowCount);
    });

    test('should handle when number of rows is more than the number of rows that can be rendered', () => {
      const expectedVisibleRowCount = 10;
      layout.qHyperCube.qSize.qcy = 20 * MIN_BODY_ROW_HEIGHT; // number of rows
      rect.height = expectedVisibleRowCount * MIN_BODY_ROW_HEIGHT; // number of rows that can be rendered

      const { result } = renderHook(() => useTableCount(layout, pageInfo, rect, columnWidth, MIN_BODY_ROW_HEIGHT));

      expect(result.current.visibleRowCount).toEqual(expectedVisibleRowCount);
    });
  });

  describe('visibleColumnCount', () => {
    test('should handle when number of columns is less than the number of columns that can be rendered', () => {
      columnWidth = [50, 50, 50, 50];
      layout.qHyperCube.qSize.qcx = columnWidth.length;
      rect.width = 50 * columnWidth.length + 50;

      const { result } = renderHook(() => useTableCount(layout, pageInfo, rect, columnWidth, MIN_BODY_ROW_HEIGHT));

      expect(result.current.visibleColumnCount).toEqual(columnWidth.length);
    });

    test('should handle when number of columns is more than the number of columns that can be rendered', () => {
      columnWidth = [50, 50, 50, 50];
      layout.qHyperCube.qSize.qcx = columnWidth.length;
      rect.width = 50 * columnWidth.length - 50;

      const { result } = renderHook(() => useTableCount(layout, pageInfo, rect, columnWidth, MIN_BODY_ROW_HEIGHT));

      expect(result.current.visibleColumnCount).toEqual(columnWidth.length - 1);
    });
  });
});
