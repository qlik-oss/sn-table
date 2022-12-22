import { useMemo } from 'react';
import { Column } from '../../../../types';
import { GeneratedStyling } from '../../../types';
import { TableRect } from '../types';
import useMeasureText from './use-measure-text';

const useColumnSize = (
  rect: TableRect,
  columns: Column[],
  headerStyle: GeneratedStyling,
  bodyStyle: GeneratedStyling
) => {
  const { measureText } = useMeasureText(headerStyle.fontSize, headerStyle.fontFamily);
  const { estimateWidth } = useMeasureText(bodyStyle.fontSize, bodyStyle.fontFamily);

  const width = useMemo(() => {
    const measuredWidths = columns.map((col) =>
      Math.max(measureText(col.label), estimateWidth(col.qApprMaxGlyphCount))
    );
    const totalWidth = measuredWidths.reduce((sum, w) => sum + w, 0);

    if (totalWidth < rect.width) {
      // If the width of all columns is less then the available width, spread it evenly among all columns
      const diff = rect.width - totalWidth;
      const spread = diff / columns.length;
      return measuredWidths.map((w) => spread + w);
    }

    return measuredWidths;
  }, [rect.width, columns, measureText, estimateWidth]);

  return { width };
};

export default useColumnSize;
