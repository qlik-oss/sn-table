import { SelectionStates, SELECTION_STYLING, StylingDefaults } from '../../../constants';
import { BodyStyle } from '../types';

const getCellStyle = (
  showHoverEffect: boolean,
  cellSelectionState: SelectionStates,
  bodyStyle: BodyStyle
): BodyStyle => {
  const { hoverColors, lastRowBottomBorder, ...styling } = bodyStyle;

  if (cellSelectionState === SelectionStates.SELECTED) {
    return {
      ...styling,
      ...SELECTION_STYLING.SELECTED,
    };
  }

  if (cellSelectionState === SelectionStates.EXCLUDED) {
    return {
      ...styling,
      // TODO: proper typing for each styling (header, totals, body)
      color: showHoverEffect ? hoverColors?.color : styling.color,
      background: `${StylingDefaults.EXCLUDED_BACKGROUND}, ${
        showHoverEffect ? hoverColors?.background : bodyStyle.background
      }`,
    };
  }

  if (showHoverEffect) {
    return {
      ...styling,
      ...hoverColors,
    } as BodyStyle;
  }

  return styling;
};

export default getCellStyle;
