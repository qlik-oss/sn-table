export enum SelectionStates {
  SELECTED = "selected",
  POSSIBLE = "possible",
  EXCLUDED = "excluded",
  INACTIVE = "inactive",
}

export enum SelectionActions {
  SELECT = "select",
  SELECT_MOUSE_DOWN = "selectMouseDown",
  SELECT_MOUSE_UP = "selectMouseUp",
  SELECT_MULTI_ADD = "selectMultiAdd",
  SELECT_MULTI_END = "selectMultiEnd",
  RESET = "reset",
  CLEAR = "clear",
  UPDATE_PAGE_ROWS = "updatePageRows",
}

export enum KeyCodes {
  ENTER = "Enter",
  SPACE = " ",
  ESC = "Escape",
  TAB = "Tab",
  SHIFT = "Shift",
  LEFT = "ArrowLeft",
  RIGHT = "ArrowRight",
  UP = "ArrowUp",
  DOWN = "ArrowDown",
  C = "c",
}

export enum FocusTypes {
  FOCUS = "focus",
  FOCUS_BUTTON = "focusButton",
  BLUR = "blur",
  ADD_TAB = "addTab",
  REMOVE_TAB = "removeTab",
}

export enum FullSortDirection {
  A = "ascending",
  D = "descending",
}

export const HEAD_ICON_WRAPPER_SIZE = 24;
export const LOCK_ICON_SIZE = 20;

export const INITIAL_DATA_FETCH_WIDTH = 50;
export const INITIAL_DATA_FETCH_HEIGHT = 100;

export const FIRST_HEADER_CELL_COORD: [number, number] = [0, 0];
export const FIRST_BODY_CELL_COORD: [number, number] = [1, 0];
