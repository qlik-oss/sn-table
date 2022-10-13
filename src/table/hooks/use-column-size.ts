import { stardust } from '@nebula.js/stardust';
import { useMemo } from 'react';
import { Column } from '../../types';
import useMeasureText from './use-measure-text';

const useColumnSize = (rect: stardust.Rect, columns: Column[]) => {
  const { measureText, estimateWidth } = useMeasureText('13px', 'Arial');

  const width = useMemo(
    () =>
      columns.map((c) => {
        const fillWidth = rect.width / columns.length;
        const maxWidth = Math.max(fillWidth, measureText(c.label), estimateWidth(c.qApprMaxGlyphCount));
        // return Math.min(500, maxWidth);
        return maxWidth;
      }),
    [rect, columns, measureText, estimateWidth]
  );

  return { width };
};

export default useColumnSize;
