import { useMemo, useRef } from 'react';
import { memoize } from 'qlik-chart-modules';
import { EstimateWidth } from '../types';

const MAGIC_DEFAULT_CHAR = 'M';
const LEEWAY_WIDTH = 25; // Used to make sure there is some leeway in the measurement of a text

export default function useEstimateWidth(fontSize: string, fontFamily: string): EstimateWidth {
  const context = useRef<CanvasRenderingContext2D | null>(null);

  useMemo(() => {
    if (context.current === null) {
      context.current = document.createElement('canvas').getContext('2d');
    }
  }, [context]);

  const estimateWidth = useMemo((): EstimateWidth => {
    if (context.current === null) {
      return () => 0;
    }

    context.current.font = `${fontSize} ${fontFamily}`;
    const memoizedMeasureText = memoize(context.current.measureText.bind(context.current)) as (
      text: string
    ) => TextMetrics;

    return ({ label, qApprMaxGlyphCount }) =>
      Math.max(memoizedMeasureText(label).width, memoizedMeasureText(MAGIC_DEFAULT_CHAR).width * qApprMaxGlyphCount) +
      LEEWAY_WIDTH;
  }, [context, fontSize, fontFamily]);

  return estimateWidth;
}
