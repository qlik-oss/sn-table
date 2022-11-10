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

  const width = useMemo(
    () =>
      columns.map((c) => {
        const fillWidth = rect.width / columns.length;
        const maxWidth = Math.max(fillWidth, measureText(c.label), estimateWidth(c.qApprMaxGlyphCount));

        return maxWidth;
      }),
    [rect, columns, measureText, estimateWidth]
  );

  return { width };
};

export default useColumnSize;
