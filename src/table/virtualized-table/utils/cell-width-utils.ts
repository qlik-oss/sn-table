import { Column } from '../../../types';
import { BORDER_WIDTH, PADDING_LEFT_RIGHT } from '../constants';

// Actual padding is 12px * 2, but as this is used when measuring text an extra pixels are added as the measurement is not perfect
const AMPLIFIED_PADDING = PADDING_LEFT_RIGHT + 2;
const SORT_ICON_WIDTH = 20;
const LOCK_ICON_WIDTH = 24;
const MENU_ITEM_WIDTH = 28;

export const subtractCellPaddingAndBorder = (width: number) => width - AMPLIFIED_PADDING * 2 - BORDER_WIDTH;

export const subtractCellPaddingIconsAndBorder = (width: number, column: Column) => {
  let newWidth = width - AMPLIFIED_PADDING * 2 - BORDER_WIDTH - SORT_ICON_WIDTH;
  newWidth -= column.isLocked ? 24 : LOCK_ICON_WIDTH;
  newWidth -= column.isDim && !column.isMasterItem ? MENU_ITEM_WIDTH : 0;

  return newWidth;
};

export const appendCellPaddingAndBorder = (width: number) => width + AMPLIFIED_PADDING * 2 + BORDER_WIDTH;
