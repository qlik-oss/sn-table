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

export enum FocusTypes {
  FOCUS = 'focus',
  FOCUS_BUTTON = 'focusButton',
  BLUR = 'blur',
  ADD_TAB = 'addTab',
  REMOVE_TAB = 'removeTab',
}

export enum FullSortDirection {
  A = 'ascending',
  D = 'descending',
}

export enum ColumnWidthTypes {
  PIXELS = 'pixels',
  PERCENTAGE = 'percentage',
  FIT_TO_CONTENT = 'fitToContent',
  AUTO = 'auto',
}

export const MIN_COLUMN_WIDTH = 120;
export const MAX_COLUMN_WIDTH = 7680;
export const MAX_COLUMN_PERCENTAGE_WIDTH = 100;
export const DEFAULT_COLUMN_PIXEL_WIDTH = 200;
export const DEFAULT_COLUMN_PERCENTAGE_WIDTH = 20;
export const DEFAULT_COLUMN_MENU_ICON_WIDTH = 25;
export const DEFAULT_COLUMN_LOCK_ICON_WIDTH = 20;

export const PAGINATION_HEIGHT = 40;

export const INITIAL_DATA_FETCH_WIDTH = 50;
export const INITIAL_DATA_FETCH_HEIGHT = 100;

export const FIRST_HEADER_CELL_COORD: [number, number] = [0, 0];
export const FIRST_BODY_CELL_COORD: [number, number] = [1, 0];
