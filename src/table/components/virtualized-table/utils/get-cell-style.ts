import { SelectionStates, SELECTION_STYLING, StylingDefaults } from '../../../constants';
import { GeneratedStyling } from '../../../types';
import { BodyStyle } from '../types';

const getHoverStyle = (bodyStyle: GeneratedStyling) => ({
  background: bodyStyle.hoverBackgroundColor,
  color: bodyStyle.hoverFontColor,
});

const getSelectionStyle = (cellSelectionState: SelectionStates, background: string) => {
  switch (cellSelectionState) {
    case SelectionStates.SELECTED:
      return SELECTION_STYLING.SELECTED;
    case SelectionStates.POSSIBLE:
      return SELECTION_STYLING.POSSIBLE;
    case SelectionStates.EXCLUDED:
      return {
        background: `${StylingDefaults.EXCLUDED_BACKGROUND}, ${background}`,
      };
    default:
      return {};
  }
};

const getCellStyle = (
  showHover: boolean,
  hoverIndex: number,
  rowIndex: number,
  cellSelectionState: SelectionStates,
  bodyStyle: BodyStyle
) => {
  const isHoveringOnRow = showHover && hoverIndex === rowIndex;
  const hoverStyle = isHoveringOnRow ? getHoverStyle(bodyStyle) : undefined;

  const shouldUseSelectionStyle =
    cellSelectionState === SelectionStates.SELECTED ||
    cellSelectionState === SelectionStates.EXCLUDED ||
    !isHoveringOnRow;

  const overrideBodyStyle = shouldUseSelectionStyle
    ? getSelectionStyle(cellSelectionState, hoverStyle?.background ?? bodyStyle.background)
    : hoverStyle;

  return {
    ...bodyStyle,
    ...overrideBodyStyle,
  };
};

export default getCellStyle;
