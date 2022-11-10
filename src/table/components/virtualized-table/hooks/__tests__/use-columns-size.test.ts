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
    columns = [{} as Column];
    headerStyle = {} as GeneratedStyling;
    bodyStyle = {} as GeneratedStyling;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should use fill width when there is space available', () => {
    rect.width = 200; // fillWidth => 200;
    (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
    (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(25);
    const { result } = renderHook(() => useColumnSize(rect, columns, headerStyle, bodyStyle));

    expect(result.current.width).toEqual([200]);
  });

  test('should use estimated width given it produces the largest value', () => {
    (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(500);
    (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(25);
    const { result } = renderHook(() => useColumnSize(rect, columns, headerStyle, bodyStyle));

    expect(result.current.width).toEqual([500]);
  });

  test('should use measured text width given it produces the largest value', () => {
    (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
    (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(250);
    const { result } = renderHook(() => useColumnSize(rect, columns, headerStyle, bodyStyle));

    expect(result.current.width).toEqual([250]);
  });
});
