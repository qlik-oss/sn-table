import { Palette } from '@mui/material';
import { createV5ThemeOptions, COLORS } from '@qlik-trial/sprout/theme';
import { SelectionStates } from './constants';

const palette = createV5ThemeOptions().palette as Palette;

export const SELECTION_STYLING = {
  SELECTED: {
    color: COLORS.GREYSCALE_100,
    background: palette.primary.light,
    // Setting a specific class for selected cells styling to override hover effect
    selectedCellClass: SelectionStates.SELECTED,
  },
  POSSIBLE: {
    color: palette.text.primary,
    background: COLORS.GREYSCALE_100,
  },
  EXCLUDED_BACKGROUND:
    'repeating-linear-gradient(-45deg, rgba(200,200,200,0.08), rgba(200,200,200,0.08) 2px, rgba(200,200,200,0.3) 2.5px, rgba(200,200,200,0.08) 3px, rgba(200,200,200,0.08) 5px)',
};

export const PADDING = 4;
export const BORDER_WIDTH = 1;
export const LINE_HEIGHT = 4 / 3;
export const DEFAULT_FONT_SIZE = '12px';

export const COMMON_CELL_STYLING = {
  height: 'auto',
  fontSize: DEFAULT_FONT_SIZE,
  lineHeight: 'unset',
  padding: `${PADDING}px`,
  borderStyle: 'solid',
  borderWidth: '0px 1px 1px 0px',
  userSelect: 'none',
  outline: 'none',
  '&:focus-visible': {
    boxShadow: '0 0 0 2px #177fe6 inset, 0 0 0 3px #fff inset',
  },
  '&:focus:not(:focus-visible)': {
    boxShadow: 'none',
  },
  '&:last-child': {
    borderRightWidth: '0px',
  },
};

const HEADER_CELL_BUTTON_PADDING = 8 * 2;
const HEADER_CELL_PADDING = 4 * 2;
const SORT_ICON = 12 + 8 - 2;
const MENU_BUTTON = 24;
export const FLEX_BOX_GAP = 4;
export const LOOK_BUTTON_AND_AUTO_MARGIN = 20 + 4;
export const ADJUSTED_HEADER_WIDTH =
  HEADER_CELL_BUTTON_PADDING + HEADER_CELL_PADDING + SORT_ICON + MENU_BUTTON + FLEX_BOX_GAP + BORDER_WIDTH;
export const TOTALS_PADDING = 12 * 2;
