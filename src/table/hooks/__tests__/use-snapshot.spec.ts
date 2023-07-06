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
  const rowCount = 100;

  beforeEach(() => {
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
  });

  it('should return the minimum value for the row number', async () => {
    const result = getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService);
    expect(result).toBe(rowCount);
  });
});
