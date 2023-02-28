import { renderHook } from '@testing-library/react';
import { Column } from '../../../types';
import { ColumnWidthTypes, MIN_COLUMN_WIDTH } from '../../constants';
import { TableStyling } from '../../types';
import useMeasureText, { MeasureTextHook } from '../../virtualized-table/hooks/use-measure-text';
import useColumnWidths from '../use-column-widths';

jest.mock('../../virtualized-table/hooks/use-measure-text');

describe('use-column-widths', () => {
  let mockedUseMeasureText: jest.MockedFunction<
    (size: string | undefined, fam: string | undefined, boldText?: boolean) => MeasureTextHook
  >;
  let mockedMeasureText: MeasureTextHook;
  let columns: Column[];
  let tableWidth: number;
  let styling: TableStyling;

  beforeEach(() => {
    mockedUseMeasureText = useMeasureText as jest.MockedFunction<typeof useMeasureText>;
    mockedMeasureText = {
      measureText: jest.fn() as jest.MockedFunction<(text: string) => number>,
      estimateWidth: jest.fn() as jest.MockedFunction<(length: number) => number>,
    };
    mockedUseMeasureText.mockReturnValue(mockedMeasureText);

    columns = [
      {
        label: 'col1',
        qApprMaxGlyphCount: 10,
        columnWidth: { type: ColumnWidthTypes.FILL, pixels: 150, percentage: 50 },
      } as Column,
      {
        label: 'col2',
        qApprMaxGlyphCount: 10,
        columnWidth: { type: ColumnWidthTypes.FILL, pixels: 150, percentage: 50 },
      } as Column,
      {
        label: 'col3',
        qApprMaxGlyphCount: 10,
        columnWidth: { type: ColumnWidthTypes.FILL, pixels: 150, percentage: 50 },
      } as Column,
    ];
    tableWidth = 600;
    styling = {
      body: { fontFamily: 'Arial', fontSize: '12px' },
      head: { fontFamily: 'Arial', fontSize: '12px' },
    } as unknown as TableStyling;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // only looking at the state not setState
  const getColumnWidthsState = () => renderHook(() => useColumnWidths(columns, tableWidth, styling)).result.current[0];
  const getTotalWidth = (widths: number[]) => widths.reduce((acc, w) => acc + w, 0);

  describe('getColumnWidths', () => {
    describe('all have same type', () => {
      it('should return equal sizes when all cols have fill type', () => {
        const widths = getColumnWidthsState();
        expect(widths).toEqual([200, 200, 200]);
      });

      it('should return equal sizes for all when all types are percentage', () => {
        columns[0].columnWidth.type = ColumnWidthTypes.PERCENTAGE;
        columns[1].columnWidth.type = ColumnWidthTypes.PERCENTAGE;
        columns[2].columnWidth.type = ColumnWidthTypes.PERCENTAGE;

        const widths = getColumnWidthsState();
        expect(widths).toEqual([300, 300, 300]);
        expect(getTotalWidth(widths)).toBe(tableWidth * 1.5);
      });

      it('should return equal sizes for all when all types are pixels', () => {
        columns[0].columnWidth.type = ColumnWidthTypes.PIXELS;
        columns[1].columnWidth.type = ColumnWidthTypes.PIXELS;
        columns[2].columnWidth.type = ColumnWidthTypes.PIXELS;

        const widths = getColumnWidthsState();
        expect(widths).toEqual([150, 150, 150]);
        expect(getTotalWidth(widths)).toBe(tableWidth * 0.75);
      });

      it('should return equal sizes when all types are hug', () => {
        (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(200);
        (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(200);
        columns[0].columnWidth.type = ColumnWidthTypes.HUG;
        columns[1].columnWidth.type = ColumnWidthTypes.HUG;
        columns[2].columnWidth.type = ColumnWidthTypes.HUG;

        const widths = getColumnWidthsState();
        expect(widths).toEqual([200, 200, 200]);
        expect(getTotalWidth(widths)).toBe(200 * 3);
      });
    });

    describe('all do not have same type', () => {
      it('should return one size for pixel value and equal sizes for two columns with fill', () => {
        columns[0].columnWidth.type = ColumnWidthTypes.PIXELS;

        const widths = getColumnWidthsState();
        expect(widths).toEqual([150, 225, 225]);
        expect(getTotalWidth(widths)).toBe(tableWidth);
      });

      it('should return one size for percentage and equal sizes for two columns with fill', () => {
        columns[1].columnWidth.type = ColumnWidthTypes.PERCENTAGE;

        const widths = getColumnWidthsState();
        expect(widths).toEqual([150, 300, 150]);
        expect(getTotalWidth(widths)).toBe(tableWidth);
      });

      it('should return one MIN_COLUMN_WIDTH for small percentage and equal sizes for two columns with fill', () => {
        columns[1].columnWidth.type = ColumnWidthTypes.PERCENTAGE;
        columns[1].columnWidth.percentage = 10;

        const widths = getColumnWidthsState();
        expect(widths).toEqual([240, MIN_COLUMN_WIDTH, 240]);
        expect(getTotalWidth(widths)).toBe(tableWidth);
      });

      it('should return one large column and equal sizes for two columns with fill, that areMIN_COLUMN_WIDTH', () => {
        columns[1].columnWidth.type = ColumnWidthTypes.PERCENTAGE;
        columns[1].columnWidth.percentage = 100;

        const widths = getColumnWidthsState();
        expect(widths).toEqual([MIN_COLUMN_WIDTH, 600, MIN_COLUMN_WIDTH]);
        expect(getTotalWidth(widths)).toBe(tableWidth + MIN_COLUMN_WIDTH * 2);
      });

      it('should return one size for hug and equal sizes for two columns with fill', () => {
        (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(150);
        (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(150);
        columns[2].columnWidth.type = ColumnWidthTypes.HUG;

        const widths = getColumnWidthsState();
        expect(widths).toEqual([225, 225, 150]);
        expect(getTotalWidth(widths)).toBe(tableWidth);
      });
    });
  });
});
