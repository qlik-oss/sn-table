import { generateLayout } from '../../../__test__/generate-test-data';
import { TableLayout, ViewService } from '../../../types';
import { getVisibleHeight } from '../use-snapshot';

describe('use-snapshot', () => {
  let visibleRowEndIndex: number;
  let visibleRowStartIndex: number;
  let layout: TableLayout;
  let viewService: ViewService;
  const dimensionCount = 2;
  const measureCount = 1;
  let rowCount = 100;
  it('should check if qcy is use', async () => {
    visibleRowStartIndex = 0;
    visibleRowEndIndex = 111;
    layout = generateLayout(dimensionCount, measureCount, rowCount);
    viewService = {
      scrollTopRatio: 1,
      visibleTop: 0,
      visibleHeight: 112,
      page: 0,
      rowsPerPage: 100,
      qTop: 0,
      qHeight: 100,
    };
    const result = getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService);
    expect(result).toBe(rowCount);
  });

  it('should  check if rowsPerPage is used', async () => {
    visibleRowStartIndex = 0;
    visibleRowEndIndex = 13;
    rowCount = 22;
    layout = generateLayout(dimensionCount, measureCount, rowCount);
    viewService = {
      scrollTopRatio: 1,
      visibleTop: 0,
      visibleHeight: 14,
      page: 0,
      rowsPerPage: 10,
      qTop: 0,
      qHeight: 100,
    };

    const result = getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService);
    expect(result).toBe(viewService.rowsPerPage);
  });

  it('should  add extra rows when row count is larger than rowsPerPage', async () => {
    visibleRowStartIndex = 0;
    visibleRowEndIndex = 5;
    rowCount = 11;
    layout = generateLayout(dimensionCount, measureCount, rowCount);
    viewService = {
      scrollTopRatio: 1,
      visibleTop: 0,
      visibleHeight: 6,
      page: 0,
      rowsPerPage: 10,
      qTop: 0,
      qHeight: 100,
    };

    const result = getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService);
    expect(result).toBe(9);
  });

  it('should return 0 when visibleRowEndIndex < 0 ', async () => {
    visibleRowStartIndex = 0;
    visibleRowEndIndex = -1;
    rowCount = 10;
    layout = generateLayout(dimensionCount, measureCount, rowCount);
    viewService = {
      visibleTop: 0,
      visibleHeight: 10,
      rowsPerPage: 10,
      qTop: 0,
      qHeight: 100,
    };

    const result = getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService);
    expect(result).toBe(0);
  });
});
