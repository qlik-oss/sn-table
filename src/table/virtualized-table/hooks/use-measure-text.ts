import { useMemo } from 'react';
import { memoize } from 'qlik-chart-modules';
import { MAX_NBR_LINES_OF_TEXT } from '../constants';

export interface MeasureTextHook {
  estimateWidth: (length: number) => number;
  measureText: (text: string) => number;
  estimateLineCount: (text: string, maxWidth: number) => number;
}

const MAGIC_DEFAULT_CHAR = 'N';

export default function useMeasureText(
  fontSize: string | undefined,
  fontFamily: string | undefined,
  boldText?: boolean
): MeasureTextHook {
  const { estimateWidth, measureText, estimateLineCount } = useMemo((): MeasureTextHook => {
    const context = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
    context.font = `${boldText ? '600' : ''} ${fontSize} ${fontFamily}`;

    const memoizedMeasureText = memoize(context.measureText.bind(context)) as (text: string) => TextMetrics;

    return {
      measureText: (text) => memoizedMeasureText(text).width,
      estimateWidth: (length: number) => memoizedMeasureText(MAGIC_DEFAULT_CHAR).width * length,
      estimateLineCount: (text: string, maxWidth: number) => {
        let lineCount = 1;
        let startIndex = 0;

        for (let index = 1; index <= text.length; index++) {
          const chars = text.slice(startIndex, index);
          const { width } = memoizedMeasureText(chars);

          if (width > maxWidth) {
            lineCount += 1;
            startIndex = index - 1;
          }

          // No need to measure more text if max nbr of lines have already been reached
          if (lineCount >= MAX_NBR_LINES_OF_TEXT) {
            return MAX_NBR_LINES_OF_TEXT;
          }
        }

        return lineCount;
      },
    };
  }, [fontSize, fontFamily, boldText]);

  return { estimateWidth, measureText, estimateLineCount };
}
