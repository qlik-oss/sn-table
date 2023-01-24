import { COMMON_CELL_STYLING } from '../../styling-defaults';
import { GeneratedStyling } from '../../types';
import { fontSizeToRowHeight } from '../../utils/styling-utils';
import { MIN_BODY_ROW_HEIGHT, MIN_HEADER_HEIGHT } from '../constants';
import { BodyStyle, Totals } from '../types';

const getHeaderRowHeight = ({ fontSize = COMMON_CELL_STYLING.fontSize }: GeneratedStyling) =>
  Math.max(MIN_HEADER_HEIGHT, Math.round(fontSizeToRowHeight(fontSize)));

const getBodyRowHeight = ({ fontSize = COMMON_CELL_STYLING.fontSize }: BodyStyle) =>
  Math.max(MIN_BODY_ROW_HEIGHT, Math.round(fontSizeToRowHeight(fontSize)));

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

export default getHeights;
