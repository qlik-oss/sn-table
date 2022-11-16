import { stardust } from '@nebula.js/stardust';
import { useMemo } from 'react';
import { Column } from '../../../../types';
import { GeneratedStyling } from '../../../types';
import useMeasureText from './use-measure-text';

const useColumnSize = (
  rect: stardust.Rect,
  columns: Column[],
  headerStyle: GeneratedStyling,
  bodyStyle: GeneratedStyling
) => {
  const { measureText } = useMeasureText(headerStyle.fontSize, headerStyle.fontFamily);
  const { estimateWidth } = useMeasureText(bodyStyle.fontSize, bodyStyle.fontFamily);

  const width = useMemo(() => {
    let measuredWidths: number[] = [];
    let totalWidth = 0;
    columns.forEach((col) => {
      const colWidth = Math.max(measureText(col.label), estimateWidth(col.qApprMaxGlyphCount));
      measuredWidths.push(colWidth);
      totalWidth += colWidth;
    });

    if (totalWidth < rect.width) {
      // If the width of all columns is less then the available width, spread it evenly among all columns
      const diff = rect.width - totalWidth;
      const spread = diff / columns.length;
      measuredWidths = measuredWidths.map((w) => spread + w);
    }

    return measuredWidths;
  }, [rect, columns, measureText, estimateWidth]);

  return { width };
};

export default useColumnSize;
