import { useMemo } from 'react';
import { memoize } from 'qlik-chart-modules';

export interface MeasureTextHook {
  estimateWidth: (length: number) => number;
  measureText: (text: string) => number;
}

const MAGIC_DEFAULT_CHAR = 'M';

export default function useMeasureText(
  fontSize: string | undefined,
  fontFamily: string | undefined,
  boldText?: boolean
): MeasureTextHook {
  const { estimateWidth, measureText } = useMemo((): MeasureTextHook => {
    const context = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;

    context.font = `${boldText ? 'bold' : ''} ${fontSize} ${fontFamily}`;

    const memoizedMeasureText = memoize(context.measureText.bind(context)) as (text: string) => TextMetrics;

    return {
      measureText: (text) => memoizedMeasureText(text).width,
      estimateWidth: (length: number) => memoizedMeasureText(MAGIC_DEFAULT_CHAR).width * length,
    };
  }, [fontSize, fontFamily]);

  return { estimateWidth, measureText };
}
