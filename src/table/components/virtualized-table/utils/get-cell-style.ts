import { SelectionStates, SELECTION_STYLING, StylingDefaults } from '../../../constants';
import { BodyStyle } from '../types';

const getCellStyle = (
  showHoverEffect: boolean,
  cellSelectionState: SelectionStates,
  bodyStyle: BodyStyle
): BodyStyle => {
  if (cellSelectionState === SelectionStates.SELECTED) {
    return {
      ...bodyStyle,
      ...SELECTION_STYLING.SELECTED,
    };
  }

  if (cellSelectionState === SelectionStates.EXCLUDED) {
    return {
      ...bodyStyle,
      color: showHoverEffect ? bodyStyle.hoverFontColor : bodyStyle.color,
      background: `${StylingDefaults.EXCLUDED_BACKGROUND}, ${
        showHoverEffect ? bodyStyle.hoverBackgroundColor : bodyStyle.background
      }`,
    };
  }

  if (showHoverEffect) {
    return {
      ...bodyStyle,
      background: bodyStyle.hoverBackgroundColor,
      color: bodyStyle.hoverFontColor,
    } as BodyStyle;
  }

  return bodyStyle;
};

export default getCellStyle;
