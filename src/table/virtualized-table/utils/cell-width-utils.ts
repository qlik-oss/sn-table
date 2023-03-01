import { Column } from '../../../types';
import { BORDER_WIDTH, PADDING_LEFT_RIGHT } from '../constants';

// Actual padding is 12px * 2, but as this is used when measuring text an extra pixels are added as the measurement is not perfect
const AMPLIFIED_PADDING = PADDING_LEFT_RIGHT + 2;
const SORT_ICON_WIDTH = 18;
const LOCK_ICON_WIDTH = 24;
const MENU_BUTTON_WIDTH = 28;

export const subtractCellPaddingAndBorder = (width: number) => width - AMPLIFIED_PADDING * 2 - BORDER_WIDTH;

export const subtractCellPaddingIconsAndBorder = (width: number, column: Column) => {
  let newWidth = width - AMPLIFIED_PADDING * 2 - BORDER_WIDTH - SORT_ICON_WIDTH;
  newWidth -= column.isLocked ? LOCK_ICON_WIDTH : 0;
  newWidth -= column.isDim ? MENU_BUTTON_WIDTH : 0;

  return newWidth;
};

export const appendCellPaddingAndBorder = (width: number) => width + AMPLIFIED_PADDING * 2 + BORDER_WIDTH;
