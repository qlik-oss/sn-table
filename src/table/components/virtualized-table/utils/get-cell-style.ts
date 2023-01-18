import { Cell, Column } from '../../../../types';
import { SelectionStates } from '../../../constants';
import { SELECTION_STYLING } from '../../../styling-defaults';
import { CellStyle } from '../../../types';
import { getColumnStyle } from '../../../utils/styling-utils';
import { BodyStyle } from '../types';

const getCellStyle = (
  cell: Cell,
  column: Column,
  showHoverEffect: boolean,
  cellSelectionState: SelectionStates,
  bodyStyle: BodyStyle
): BodyStyle => {
  const { hoverColors, lastRowBottomBorder, ...styling } = bodyStyle;

  const withColumnStyle = cell.qAttrExps
    ? (getColumnStyle(styling as CellStyle, cell.qAttrExps, column.stylingIDs) as BodyStyle)
    : styling;

  if (cellSelectionState === SelectionStates.SELECTED) {
    return {
      ...withColumnStyle,
      ...SELECTION_STYLING.SELECTED,
    };
  }

  if (cellSelectionState === SelectionStates.EXCLUDED) {
    return {
      ...withColumnStyle,
      // TODO: proper typing for each styling (header, totals, body)
      color: showHoverEffect ? hoverColors?.color : withColumnStyle.color,
      background: `${SELECTION_STYLING.EXCLUDED_BACKGROUND}, ${
        showHoverEffect ? hoverColors?.background : withColumnStyle.background
      }`,
    };
  }

  if (showHoverEffect) {
    return {
      ...withColumnStyle,
      ...hoverColors,
    } as BodyStyle;
  }

  return withColumnStyle;
};

export default getCellStyle;
