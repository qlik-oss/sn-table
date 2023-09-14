import { generateLayout } from '../../../__test__/generate-test-data';
import { TableLayout, ViewService } from '../../../types';
import getVisibleHeight from '../get-visible-height';

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
      estimatedRowHeight: 25,
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

  it('should return 0 when visibleRowEndIndex < 0', async () => {
    visibleRowEndIndex = -1;
    layout = generateLayout(dimensionCount, measureCount, rowCount);

    const result = getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService);
    expect(result).toBe(0);
  });
});
