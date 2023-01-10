import { SelectionStates, SELECTION_STYLING, StylingDefaults } from '../../../constants';
import { BodyStyle } from '../types';

const getCellStyle = (
  isRowHovered: boolean,
  showHoverEffect: boolean,
  cellSelectionState: SelectionStates,
  bodyStyle: BodyStyle
): BodyStyle => {
  const isHoveringOnRow = isRowHovered && showHoverEffect;

  if (cellSelectionState === SelectionStates.SELECTED) {
    return {
      ...bodyStyle,
      ...SELECTION_STYLING.SELECTED,
    };
  }

  if (cellSelectionState === SelectionStates.EXCLUDED) {
    return {
      ...bodyStyle,
      color: isHoveringOnRow ? bodyStyle.hoverFontColor : bodyStyle.color,
      background: `${StylingDefaults.EXCLUDED_BACKGROUND}, ${
        isHoveringOnRow ? bodyStyle.hoverBackgroundColor : bodyStyle.background
      }`,
    };
  }

  if (isHoveringOnRow) {
    return {
      ...bodyStyle,
      background: bodyStyle.hoverBackgroundColor,
      color: bodyStyle.hoverFontColor,
    } as BodyStyle;
  }

  return bodyStyle;
};

export default getCellStyle;
