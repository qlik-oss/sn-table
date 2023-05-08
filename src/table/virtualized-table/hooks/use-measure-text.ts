import { useMemo } from 'react';
import { memoize } from 'qlik-chart-modules';
import { MAX_NBR_LINES_OF_TEXT } from '../constants';

type EstimateLineCountProps = {
  text: string;
  maxWidth: number;
  isNumeric?: boolean;
};

export type EstimateLineCount = ({ text, maxWidth, isNumeric }: EstimateLineCountProps) => number;

export interface MeasureTextHook {
  estimateWidth: (length: number) => number;
  measureText: (text: string) => number;
  estimateLineCount: EstimateLineCount;
}

const MAGIC_DEFAULT_CHAR = 'N';

function getNextLine(text: string, maxWidth: number, fixedMeasureText: (text: string) => number) {
  let left = 0;
  let right = text.length;

  if (text.length <= 1) {
    return null;
  }

  if (fixedMeasureText(text) <= maxWidth) {
    return null;
  }

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

export default function useMeasureText(fontSize?: string, fontFamily?: string, boldText?: boolean): MeasureTextHook {
  const { estimateWidth, measureText, estimateLineCount } = useMemo((): MeasureTextHook => {
    const context = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
    context.font = `${boldText ? '600' : ''} ${fontSize} ${fontFamily}`;

    const memoizedMeasureText = memoize(context.measureText.bind(context)) as (text: string) => TextMetrics;

    const fixedMeasureText = (text: string) => +memoizedMeasureText(text).width.toFixed(2);

    const toKey = ({ text, maxWidth, isNumeric }: EstimateLineCountProps) => `${text}-${maxWidth}-${isNumeric}`;

    const memoizedEstimateLineCount = memoize(({ text, maxWidth, isNumeric = false }: EstimateLineCountProps) => {
      if (isNumeric) {
        return 1;
      }

      let lineCount = 0;
      let nextLine: string | null = text;

      do {
        lineCount += 1;
        nextLine = getNextLine(nextLine, maxWidth, fixedMeasureText);
      } while (nextLine !== null && lineCount < MAX_NBR_LINES_OF_TEXT);

      return lineCount;
    }, toKey) as EstimateLineCount;

    return {
      measureText: (text) => memoizedMeasureText(text).width,
      estimateWidth: (length: number) => memoizedMeasureText(MAGIC_DEFAULT_CHAR).width * length,
      estimateLineCount: memoizedEstimateLineCount,
    };
  }, [fontSize, fontFamily, boldText]);

  return { estimateWidth, measureText, estimateLineCount };
}
