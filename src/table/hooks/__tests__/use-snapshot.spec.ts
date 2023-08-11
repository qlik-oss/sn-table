import { generateLayout } from '../../../__test__/generate-test-data';
import { TableLayout, ViewService } from '../../../types';
import { getVisibleHeight, getViewState } from '../use-snapshot';
import * as visibleRowsUtils from '../../utils/find-visible-rows';
import * as handleData from '../../../handle-data';

describe('use-snapshot', () => {
  describe('getVisibleHeight', () => {
    let visibleRowEndIndex: number;
    let visibleRowStartIndex: number;
    let layout: TableLayout;
    let viewService: ViewService;
    let rowCount: number;
    const dimensionCount = 2;
    const measureCount = 1;

    beforeEach(() => {
      visibleRowStartIndex = 0;
      visibleRowEndIndex = 79;
      viewService = {
        scrollTopRatio: 1,
        visibleTop: 0,
        visibleHeight: 80,
        page: 0,
        rowsPerPage: 100,
        qTop: 0,
        qHeight: 100,
      };
      rowCount = 50;
    });

    it('should check if qcy is used', async () => {
      layout = generateLayout(dimensionCount, measureCount, rowCount);

      const result = getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService);
      expect(result).toBe(rowCount);
    });

    it('should check if rowsPerPage is used', async () => {
      visibleRowEndIndex = 13;
      layout = generateLayout(dimensionCount, measureCount, rowCount);
      viewService = {
        ...viewService,
        visibleHeight: 14,
        rowsPerPage: 10,
      };

      const result = getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService);
      expect(result).toBe(viewService.rowsPerPage);
    });

    it('should add extra rows when row count is larger than rowsPerPage', async () => {
      visibleRowEndIndex = 5;
      layout = generateLayout(dimensionCount, measureCount, rowCount);
      viewService = { ...viewService, visibleHeight: 6, rowsPerPage: 10 };

      const result = getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService);
      expect(result).toBe(9);
    });

    it('should return 0 when visibleRowEndIndex < 0 ', async () => {
      visibleRowEndIndex = -1;
      layout = generateLayout(dimensionCount, measureCount, rowCount);

      const result = getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService);
      expect(result).toBe(0);
    });
  });

  describe('getViewState', () => {
    let layout: TableLayout;
    let viewService: ViewService;
    let rootElement: HTMLElement;

    beforeEach(() => {
      layout = {} as TableLayout;
      viewService = {
        scrollLeft: 100,
        visibleLeft: 1,
        visibleWidth: 10,
        scrollTopRatio: 1,
        page: 0,
        rowsPerPage: 100,
        qTop: 0,
        qHeight: 100,
      };
      rootElement = document.createElement('p');
      jest.spyOn(visibleRowsUtils, 'findVirtualizedVisibleRows').mockReturnValue({});
      jest.spyOn(visibleRowsUtils, 'findPaginationVisibleRows').mockReturnValue({});
      jest.spyOn(handleData, 'getTotalPosition').mockReturnValue({ atTop: false, atBottom: false });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should run correct functions in virtualized table mode', async () => {
      getViewState(layout, viewService, rootElement);
      expect(handleData.getTotalPosition).toHaveBeenCalledTimes(0);
      expect(visibleRowsUtils.findPaginationVisibleRows).toHaveBeenCalledTimes(0);
      expect(visibleRowsUtils.findVirtualizedVisibleRows).toHaveBeenCalledTimes(1);
    });

    it('should return correct result in virtualized table mode', async () => {
      const result = getViewState(layout, viewService, rootElement);
      expect(result).toEqual({
        scrollLeft: 100,
        visibleLeft: 1,
        visibleWidth: 10,
        visibleTop: -1,
        visibleHeight: 0,
        scrollTopRatio: 1,
        rowsPerPage: 100,
        page: 0,
      });
    });

    it('should run correct functions in pagination table mode', async () => {
      layout.usePagination = true;
      getViewState(layout, viewService, rootElement);
      expect(handleData.getTotalPosition).toHaveBeenCalledTimes(1);
      expect(visibleRowsUtils.findPaginationVisibleRows).toHaveBeenCalledTimes(1);
      expect(visibleRowsUtils.findVirtualizedVisibleRows).toHaveBeenCalledTimes(0);
    });

    it('should return correct result in pagination table mode', async () => {
      layout.usePagination = true;
      const result = getViewState(layout, viewService, rootElement);
      expect(result).toEqual({
        rowPartialHeight: undefined,
        scrollLeft: 100,
        visibleTop: -1,
        visibleHeight: 0,
        rowsPerPage: 100,
        page: 0,
      });
    });
  });
});
