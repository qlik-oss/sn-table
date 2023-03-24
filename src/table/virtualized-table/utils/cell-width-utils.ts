import { Column } from '../../../types';
import { BORDER_WIDTH, PADDING_LEFT_RIGHT } from '../constants';

const HEAD_CELL_PADDING = 4 * 2;
const HEAD_BUTTON_PADDING = 8 * 2;
const SORT_ICON_WIDTH = 18;
const LOCK_ICON_WIDTH = 24;
const MENU_BUTTON_WIDTH = 24;
const GRID_GAP = 4;

export const getAdjustedCellWidth = (width: number) => width - PADDING_LEFT_RIGHT * 2 - BORDER_WIDTH;

export const getAdjustedHeadCellWidth = (width: number, column: Column) => {
  let newWidth = width;
  newWidth -= HEAD_CELL_PADDING;
  newWidth -= HEAD_BUTTON_PADDING;
  newWidth -= BORDER_WIDTH;
  newWidth -= SORT_ICON_WIDTH;
  newWidth -= MENU_BUTTON_WIDTH;
  newWidth -= GRID_GAP;
  newWidth -= column.isLocked ? LOCK_ICON_WIDTH : 0;

  return newWidth;
};
