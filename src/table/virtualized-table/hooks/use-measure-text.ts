import { useMemo } from 'react';
import { memoize } from 'qlik-chart-modules';
import { MAX_NBR_LINES_OF_TEXT } from '../constants';

export interface MeasureTextHook {
  estimateWidth: (length: number) => number;
  measureText: (text: string) => number;
  estimateLineCount: (text: string, maxWidth: number, isNumeric?: boolean) => number;
}

const MAGIC_DEFAULT_CHAR = 'N';

function getNextLine(text: string, maxWidth: number, fixedMeasureText: (text: string) => number) {
  let left = 0;
  let right = text.length;

  while (left <= right) {
    const m = Math.floor((left + right) / 2);
    const chunk = text.slice(0, m);
    const prevChunk = text.slice(0, m - 1);
    const width = fixedMeasureText(chunk);
    const prevWidth = fixedMeasureText(prevChunk);

    if (width > maxWidth && prevWidth <= maxWidth) {
      return text.slice(m - 1) || null;
    }

    if (width === maxWidth) {
      return text.slice(m) || null;
    }

    if (width < maxWidth) {
      // Search right
      left = m + 1;
    } else {
      // Search left
      right = m;
    }
  }

  return null;
}

export default function useMeasureText(
  fontSize: string | undefined,
  fontFamily: string | undefined,
  boldText?: boolean
): MeasureTextHook {
  const { estimateWidth, measureText, estimateLineCount } = useMemo((): MeasureTextHook => {
    const context = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
    context.font = `${boldText ? '600' : ''} ${fontSize} ${fontFamily}`;

    const memoizedMeasureText = memoize(context.measureText.bind(context)) as (text: string) => TextMetrics;

    const fixedMeasureText = (text: string) => +memoizedMeasureText(text).width.toFixed(2);

    return {
      measureText: (text) => memoizedMeasureText(text).width,
      estimateWidth: (length: number) => memoizedMeasureText(MAGIC_DEFAULT_CHAR).width * length,
      estimateLineCount: (text: string, maxWidth: number, isNumeric = false) => {
        if (isNumeric) {
          return 1;
        }

        if (text.length <= 1) {
          return 1;
        }

        if (fixedMeasureText(text) <= maxWidth) {
          return 1;
        }

        let lineCount = 1;
        let nextLine = getNextLine(text, maxWidth, fixedMeasureText);

        while (nextLine !== null && lineCount < MAX_NBR_LINES_OF_TEXT) {
          lineCount += 1;
          nextLine = getNextLine(nextLine, maxWidth, fixedMeasureText);
        }

        return lineCount;
      },
    };
  }, [fontSize, fontFamily, boldText]);

  return { estimateWidth, measureText, estimateLineCount };
}
