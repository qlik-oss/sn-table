import { Palette } from '@mui/material';
import { createV5ThemeOptions, COLORS } from '@qlik-trial/sprout/theme';
import { SelectionStates } from './constants';

const palette = createV5ThemeOptions().palette as Palette;

export const COLORING = {
  TEXT: palette.text.primary,
  DISABLED: palette.text.disabled,
  HOVER: palette.action.hover,
  WHITE: COLORS.GREYSCALE_100,
  BORDER_LIGHT: COLORS.GREYSCALE_90,
  BORDER_MEDIUM: COLORS.GREYSCALE_85,
  BORDER_HEAVY: COLORS.GREYSCALE_50,
  DARK_MODE_TEXT: COLORS.GREYSCALE_95,
  DARK_MODE_BORDER: COLORS.GREYSCALE_95,
  DARK_MODE_DISABLED: COLORS.GREYSCALE_70,
  DARK_MODE_BACKGROUND: COLORS.GREYSCALE_20,
};

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

export const COMMON_CELL_STYLING = {
  height: 'auto',
  fontSize: '12px',
  lineHeight: 'unset',
  padding: `${PADDING}PX`,
  borderStyle: 'solid',
  borderWidth: '0px 1px 1px 0px',
  userSelect: 'none',
  '&:focus': {
    boxShadow: '0 0 0 2px #177fe6 inset, 0 0 0 3px #fff inset',
    outline: 'none',
  },
};
