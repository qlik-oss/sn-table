import { Cell } from '../../types';
import { FocusTypes, KeyCodes, SelectionActions } from '../constants';
import { BodyArrowHelperProps } from '../types';
import { announceSelectionState, moveFocus, updateFocus } from './accessibility-utils';
import { handleNavigateTop } from './handle-scroll';

export const preventDefaultBehavior = (evt: React.KeyboardEvent) => {
  evt.stopPropagation();
  evt.preventDefault();
};

export const isCtrlCmd = (evt: React.KeyboardEvent) => evt.ctrlKey || evt.metaKey;

export const isCtrlShift = (evt: React.KeyboardEvent) => evt.shiftKey && isCtrlCmd(evt);

export const isArrowKey = (key: string) =>
  [KeyCodes.LEFT, KeyCodes.RIGHT, KeyCodes.UP, KeyCodes.DOWN].includes(key as KeyCodes);

export const isShiftArrow = (evt: React.KeyboardEvent) => evt.shiftKey && isArrowKey(evt.key);

/**
 * Checks if events caught by head, totals and body handles should bubble to the wrapper handler or default behavior
 */
export const shouldBubble = (
  evt: React.KeyboardEvent,
  isSelectionMode = false,
  keyboardEnabled = false,
  paginationNeeded = true
) => {
  const shouldGoToSelToolbar = keyboardEnabled && isSelectionMode;
  const bubbleWithoutShift = !evt.shiftKey && (paginationNeeded || !shouldGoToSelToolbar);
  const bubbleWithShift = evt.shiftKey && !shouldGoToSelToolbar;
  return (
    // esc to blur object
    (evt.key === KeyCodes.ESC && !isSelectionMode) ||
    // default tab to pagination or tab to blur
    (evt.key === KeyCodes.TAB && (bubbleWithoutShift || bubbleWithShift)) ||
    // ctrl + shift + arrow to change page
    ((evt.key === KeyCodes.LEFT || evt.key === KeyCodes.RIGHT) && isCtrlShift(evt))
  );
};

/**
 * Checks if should select with shift + arrow.
 * When at the first/last row of the cell, shift + arrow up/down should not select anything
 */
const shouldSelectMultiValues = (
  areBasicFeaturesEnabled: boolean,
  isSelectionsEnabled: boolean,
  evt: React.KeyboardEvent,
  cell: Cell
) =>
  evt.shiftKey &&
  ((evt.key === KeyCodes.UP && cell.pageRowIdx !== 0) || (evt.key === KeyCodes.DOWN && !cell.isLastRow)) &&
  areBasicFeaturesEnabled &&
  isSelectionsEnabled &&
  cell.isSelectable;

/**
 * Gets the focus type for navigating the body.
 * When you move to the header, it returns focusButton type
 */
export const getFocusType = (cellCoord: [number, number], evt: React.KeyboardEvent<Element>): FocusTypes => {
  const upToHeader = evt.key === KeyCodes.UP && cellCoord[0] === 1;
  const leftToHeader = evt.key === KeyCodes.LEFT && cellCoord[0] === 1 && cellCoord[1] === 0;

  return upToHeader || leftToHeader ? FocusTypes.FOCUS_BUTTON : FocusTypes.FOCUS;
};

/**
 * handles arrow key presses on the body
 * moves to another cell for all arrows and select multiple values on up/down + shift
 */
export const bodyArrowHelper = ({
  evt,
  rootElement,
  cell,
  selectionDispatch,
  isSelectionsEnabled,
  setFocusedCellCoord,
  announce,
  totalsPosition,
  isSelectionMode,
  areBasicFeaturesEnabled,
}: BodyArrowHelperProps) => {
  const firstBodyRowIdx = totalsPosition.atTop ? 2 : 1;
  const cellCoord: [number, number] = [cell.pageRowIdx + firstBodyRowIdx, cell.pageColIdx];
  // Make sure you can't navigate to header (and totals) in selection mode
  const allowedRows = {
    top: isSelectionMode ? firstBodyRowIdx : 0,
    bottom: isSelectionMode && totalsPosition.atBottom ? 1 : 0,
  };
  const focusType = getFocusType(cellCoord, evt);

  if (focusType === FocusTypes.FOCUS) {
    updateFocus({ focusType: FocusTypes.REMOVE_TAB, cell: evt.target as HTMLTableCellElement });
  }

  const nextCell = moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, focusType, allowedRows);

  if (!(evt.key === KeyCodes.UP || evt.key === KeyCodes.DOWN)) return;

  if (evt.key === KeyCodes.UP) {
    handleNavigateTop([cell.pageRowIdx, cell.pageColIdx], rootElement);
  }
  // Shift + up/down arrow keys: select multiple values
  if (shouldSelectMultiValues(areBasicFeaturesEnabled, isSelectionsEnabled, evt, cell)) {
    selectionDispatch({
      type: SelectionActions.SELECT_MULTI_ADD,
      payload: { cell, evt, announce },
    });
  } else {
    // When not selecting multiple we need to announce the selection state of the cell
    announceSelectionState(announce, nextCell, isSelectionMode);
  }
};
