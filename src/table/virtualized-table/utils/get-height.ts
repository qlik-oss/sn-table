import { COMMON_CELL_STYLING } from '../../styling-defaults';
import { GeneratedStyling } from '../../types';
import { fontSizeToRowHeight } from '../../utils/styling-utils';
import { MIN_BODY_ROW_HEIGHT, MIN_HEADER_HEIGHT, PADDING_TOP_BOTTOM } from '../constants';
import { BodyStyle, Rect, Totals } from '../types';

const getHeaderRowHeight = ({ fontSize = COMMON_CELL_STYLING.fontSize }: GeneratedStyling) =>
  Math.max(MIN_HEADER_HEIGHT, fontSizeToRowHeight(fontSize) + PADDING_TOP_BOTTOM) * 2;

const getBodyRowHeight = ({ fontSize = COMMON_CELL_STYLING.fontSize }: BodyStyle) =>
  Math.max(MIN_BODY_ROW_HEIGHT, fontSizeToRowHeight(fontSize));

const getHeights = (headerStyle: GeneratedStyling, bodyStyle: BodyStyle, totals: Totals) => {
  const headerRowHeight = getHeaderRowHeight(headerStyle);
  const bodyRowHeight = getBodyRowHeight(bodyStyle);
  const headerAndTotalsHeight = totals.atTop || totals.atBottom ? headerRowHeight + bodyRowHeight : headerRowHeight;

  return {
    headerRowHeight,
    bodyRowHeight,
    headerAndTotalsHeight,
  };
};

export const getBodyHeight = (
  rect: Rect,
  headerAndTotalsHeight: number,
  deferredRowCount: number,
  estimatedRowHeight: number
) => {
  let { height: bodyHeight } = rect;
  bodyHeight -= headerAndTotalsHeight;
  if (deferredRowCount * estimatedRowHeight < bodyHeight) {
    bodyHeight = Math.min(deferredRowCount * estimatedRowHeight, bodyHeight);
  }

  return bodyHeight;
};

export default getHeights;
