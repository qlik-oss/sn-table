import { useMemo } from 'react';
import { memoize } from 'qlik-chart-modules';

export interface MeasureTextHook {
  estimateWidth: (length: number) => number;
  measureText: (text: string) => number;
}

const MAGIC_DEFAULT_CHAR = 'M';

const ACCOUNT_FOR_PADDING = 32; // Default left and right padding is 2 * 14px, make some extra room for that

export default function useMeasureText(fontSize: string | undefined, fontFamily: string | undefined): MeasureTextHook {
  const { estimateWidth, measureText } = useMemo((): MeasureTextHook => {
    const context = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
    context.font = `${fontSize} ${fontFamily}`;

    const memoizedMeasureText = memoize(context.measureText.bind(context)) as (text: string) => TextMetrics;

    return {
      measureText: (text) => memoizedMeasureText(text).width + ACCOUNT_FOR_PADDING,
      estimateWidth: (length: number) => memoizedMeasureText(MAGIC_DEFAULT_CHAR).width * length + ACCOUNT_FOR_PADDING,
    };
  }, [fontSize, fontFamily]);

  return { estimateWidth, measureText };
}
