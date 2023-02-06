import { BORDER_WIDTH, PADDING_LEFT_RIGHT } from '../constants';

// Actual padding is 12px * 2, but as this is used when measuring text an extra pixels are added as the measurement is not perfect
const AMPLIFIED_PADDING = PADDING_LEFT_RIGHT + 2;

export const subtractCellPaddingAndBorder = (width: number) => width - AMPLIFIED_PADDING * 2 - BORDER_WIDTH;

export const appendCellPaddingAndBorder = (width: number) => width + AMPLIFIED_PADDING * 2 + BORDER_WIDTH;
