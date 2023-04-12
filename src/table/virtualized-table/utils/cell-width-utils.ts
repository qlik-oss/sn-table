import { Column } from '../../../types';
import { ADJUSTED_HEADER_WIDTH, LOOK_BUTTON_AND_AUTO_MARGIN } from '../../styling-defaults';
import { BORDER_WIDTH, PADDING_LEFT_RIGHT } from '../constants';

export const getAdjustedCellWidth = (width: number) => width - PADDING_LEFT_RIGHT * 2 - BORDER_WIDTH;

export const getAdjustedHeadCellWidth = (width: number, column: Column) => {
  let newWidth = width - ADJUSTED_HEADER_WIDTH;
  newWidth -= column.isLocked ? LOOK_BUTTON_AND_AUTO_MARGIN : 0;

  return newWidth;
};
