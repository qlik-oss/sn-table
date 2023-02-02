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
    const context = document.createElement('canvas').getContext('2d');
    let memoizedMeasureText: (text: string) => { width: number };

    // When testing, context is undefined, so we mock measure text
    if (context) {
      context.font = `${fontSize} ${fontFamily}`;
      memoizedMeasureText = memoize(context.measureText.bind(context));
    } else {
      memoizedMeasureText = memoize(() => ({ width: 10 }));
    }

    return {
      measureText: (text) => memoizedMeasureText(text).width + ACCOUNT_FOR_PADDING,
      estimateWidth: (length: number) => memoizedMeasureText(MAGIC_DEFAULT_CHAR).width * length + ACCOUNT_FOR_PADDING,
    };
  }, [fontSize, fontFamily]);

  return { estimateWidth, measureText };
}
