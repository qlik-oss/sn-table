import { renderHook } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';
import useMeasureText, { MeasureTextHook } from '../use-measure-text';
import useColumnSize from '../use-column-size';
import { Column } from '../../../../../types';
import { GeneratedStyling } from '../../../../types';

jest.mock('../use-measure-text');

describe('useColumnSize', () => {
  let rect: stardust.Rect;
  let mockedUseMeasureText: jest.MockedFunction<(size: string | undefined, fam: string | undefined) => MeasureTextHook>;
  let mockedMeasureText: MeasureTextHook;
  let columns: Column[];
  let headerStyle: GeneratedStyling;
  let bodyStyle: GeneratedStyling;

  beforeEach(() => {
    rect = { width: 200, height: 100 } as stardust.Rect;
    mockedUseMeasureText = useMeasureText as jest.MockedFunction<typeof useMeasureText>;
    mockedMeasureText = {
      measureText: jest.fn() as jest.MockedFunction<(text: string) => number>,
      estimateWidth: jest.fn() as jest.MockedFunction<(length: number) => number>,
    };
    mockedUseMeasureText.mockReturnValue(mockedMeasureText);
    columns = [{}, {}, {}] as Column[];
    headerStyle = {} as GeneratedStyling;
    bodyStyle = {} as GeneratedStyling;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should fill up available space given a single column', () => {
    columns = [{}] as Column[];
    rect.width = 200;
    (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
    (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(25);
    const { result } = renderHook(() => useColumnSize(rect, columns, headerStyle, bodyStyle));

    expect(result.current.width).toEqual([200]);
  });

  test('should fill up available space given multiple columns', () => {
    rect.width = 300;
    (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
    (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(25);
    const { result } = renderHook(() => useColumnSize(rect, columns, headerStyle, bodyStyle));

    expect(result.current.width).toEqual([100, 100, 100]);
  });

  test('fill width should not be included when space available is filled', () => {
    rect.width = 1000;
    (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(1000);
    (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
    (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);
    const { result } = renderHook(() => useColumnSize(rect, columns, headerStyle, bodyStyle));

    expect(result.current.width).toEqual([1000, 50, 50]);
  });

  test('should use estimated width given it produces the largest value', () => {
    (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(500);
    (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(400);
    (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(300);
    (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(25);
    const { result } = renderHook(() => useColumnSize(rect, columns, headerStyle, bodyStyle));

    expect(result.current.width).toEqual([500, 400, 300]);
  });

  test('should use measured text width given it produces the largest value', () => {
    (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
    (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValueOnce(500);
    (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValueOnce(400);
    (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValueOnce(300);
    const { result } = renderHook(() => useColumnSize(rect, columns, headerStyle, bodyStyle));

    expect(result.current.width).toEqual([500, 400, 300]);
  });
});
