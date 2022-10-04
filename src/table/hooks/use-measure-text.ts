import { useMemo, useRef } from 'react';
import { memoize } from 'qlik-chart-modules';

export interface MeasureTextHook {
  estimateWidth: (length: number) => number;
  measureText: (text: string) => number;
}

const MAGIC_DEFAULT_CHAR = 'M';

const LEEWAY_WIDTH = 25; // Used to make sure there is some leeway in the measurement of a text

export default function useMeasureText(fontSize: string, fontFamily: string): MeasureTextHook {
  const context = useRef<CanvasRenderingContext2D | null>(null);

  useMemo(() => {
    if (context.current === null) {
      context.current = document.createElement('canvas').getContext('2d');
    }
  }, [context]);

  const { estimateWidth, measureText } = useMemo((): MeasureTextHook => {
    if (context.current === null) {
      return {
        measureText: () => 0,
        estimateWidth: () => 0,
      };
    }

    context.current.font = `${fontSize} ${fontFamily}`;
    const memoizedMeasureText = memoize(context.current.measureText.bind(context.current)) as (
      text: string
    ) => TextMetrics;

    return {
      measureText: (text) => memoizedMeasureText(text).width + LEEWAY_WIDTH,
      estimateWidth: (length: number) => memoizedMeasureText(MAGIC_DEFAULT_CHAR).width * length + LEEWAY_WIDTH,
    };
  }, [context, fontSize, fontFamily]);

  return { estimateWidth, measureText };
}
