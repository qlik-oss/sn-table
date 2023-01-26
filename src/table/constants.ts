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

export enum FullSortDirection {
  A = 'ascending',
  D = 'descending',
}

export const PAGINATION_HEIGHT = 40;
