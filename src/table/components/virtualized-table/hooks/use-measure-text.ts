import { useMemo } from 'react';
import { memoize } from 'qlik-chart-modules';

export interface MeasureTextHook {
  estimateWidth: (length: number) => number;
  measureText: (text: string) => number;
}

const MAGIC_DEFAULT_CHAR = 'M';

const LEEWAY_WIDTH = 25; // Used to make sure there is some leeway in the measurement of a text

export default function useMeasureText(fontSize: string | undefined, fontFamily: string | undefined): MeasureTextHook {
  const { estimateWidth, measureText } = useMemo((): MeasureTextHook => {
    const context = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
    context.font = `${fontSize} ${fontFamily}`;

    const memoizedMeasureText = memoize(context.measureText.bind(context)) as (text: string) => TextMetrics;

    return {
      measureText: (text) => memoizedMeasureText(text).width + LEEWAY_WIDTH,
      estimateWidth: (length: number) => memoizedMeasureText(MAGIC_DEFAULT_CHAR).width * length + LEEWAY_WIDTH,
    };
  }, [fontSize, fontFamily]);

  return { estimateWidth, measureText };
}
