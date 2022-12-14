export enum SelectionStates {
  SELECTED = 'selected',
  POSSIBLE = 'possible',
  EXCLUDED = 'excluded',
  INACTIVE = 'inactive',
}

export enum SelectionActions {
  SELECT = 'select',
  SELECT_MOUSE_DOWN = 'selectMouseDown',
  SELECT_MOUSE_UP = 'selectMouseUp',
  SELECT_MULTI_ADD = 'selectMultiAdd',
  SELECT_MULTI_END = 'selectMultiEnd',
  RESET = 'reset',
  CLEAR = 'clear',
  UPDATE_PAGE_ROWS = 'updatePageRows',
}

export enum KeyCodes {
  ENTER = 'Enter',
  SPACE = ' ',
  ESC = 'Escape',
  TAB = 'Tab',
  SHIFT = 'Shift',
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight',
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
  C = 'c',
}

export enum StylingDefaults {
  HEAD_BACKGROUND_LIGHT = '#FAFAFA',
  HEAD_BACKGROUND_DARK = '#323232',
  SORT_LABEL_LIGHT = 'rgba(255,255,255,0.9)',
  SORT_LABEL_DARK = 'rgba(0, 0, 0, 0.54)',
  FONT_COLOR = '#404040',
  WHITE = '#fff',
  HOVER_BACKGROUND = '#f4f4f4',
  SELECTED_BACKGROUND = '#009845',
  EXCLUDED_BACKGROUND = 'repeating-linear-gradient(-45deg, rgba(200,200,200,0.08), rgba(200,200,200,0.08) 2px, rgba(200,200,200,0.3) 2.5px, rgba(200,200,200,0.08) 3px, rgba(200,200,200,0.08) 5px)',
}

export const COMMON_CELL_STYLING = {
  height: 'auto',
  lineHeight: 'unset',
  padding: '4px',
  borderStyle: 'solid',
  borderWidth: '0px 1px 1px 0px',
  userSelect: 'none',
  '&:focus': {
    boxShadow: '0 0 0 2px #177fe6 inset, 0 0 0 3px #fff inset',
    outline: 'none',
  },
};

export const SELECTION_STYLING = {
  SELECTED: {
    color: StylingDefaults.WHITE,
    background: StylingDefaults.SELECTED_BACKGROUND,
    // Setting a specific class for selected cells styling to override hover effect
    selectedCellClass: SelectionStates.SELECTED,
  },
  POSSIBLE: {
    color: StylingDefaults.FONT_COLOR,
    background: StylingDefaults.WHITE,
  },
};
