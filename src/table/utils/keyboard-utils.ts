import { stardust } from "@nebula.js/stardust";
import { focusSelectionToolbar, preventDefaultBehavior } from "@qlik/nebula-table-utils/lib/utils";
import { Cell } from "../../types";
import { FocusTypes, KeyCodes, SelectionActions } from "../constants";
import { BodyArrowHelperProps, FocusedCellCoord, SetFocusedCellCoord } from "../types";
import { announceSelectionState, focusBodyFromHead, moveFocusWithArrow, updateFocus } from "./accessibility-utils";
import { handleNavigateTop } from "./handle-scroll";

export const isCtrlCmd = (evt: React.KeyboardEvent) => evt.ctrlKey || evt.metaKey;

export const isCtrlShift = (evt: React.KeyboardEvent) => evt.shiftKey && isCtrlCmd(evt);

export const isArrowKey = (key: string) =>
  [KeyCodes.LEFT, KeyCodes.RIGHT, KeyCodes.UP, KeyCodes.DOWN].includes(key as KeyCodes);

export const isShiftArrow = (evt: React.KeyboardEvent) => evt.shiftKey && isArrowKey(evt.key);

/**
 * Checks if events caught by head, totals and body handles should be early returned and bubble to tableWrapper/default behavior.
 */
export const shouldBubbleEarly = (evt: React.KeyboardEvent, isSelectionMode = false) =>
  // esc to blur object
  (evt.key === KeyCodes.ESC && !isSelectionMode) ||
  // ctrl + shift + arrow to change page
  ((evt.key === KeyCodes.LEFT || evt.key === KeyCodes.RIGHT) && isCtrlShift(evt));

/**
 * Checks if should select with shift + arrow.
 * When at the first/last row of the cell, shift + arrow up/down should not select anything
 */
const shouldSelectMultiValues = (isSelectionsEnabled: boolean, evt: React.KeyboardEvent, cell: Cell) =>
  evt.shiftKey &&
  ((evt.key === KeyCodes.UP && cell.pageRowIdx !== 0) || (evt.key === KeyCodes.DOWN && !cell.isLastRow)) &&
  isSelectionsEnabled &&
  cell.isSelectable;

/**
 * Gets the focus type for navigating the body.
 * When you move to the header, it returns focusButton type
 */
export const getFocusType = (
  cellCoord: FocusedCellCoord,
  evt: React.KeyboardEvent,
  isNewHeadCellMenuEnabled: boolean,
): FocusTypes => {
  if (isNewHeadCellMenuEnabled) {
    return FocusTypes.FOCUS;
  }

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
  isNewHeadCellMenuEnabled,
}: BodyArrowHelperProps) => {
  const firstBodyRowIdx = totalsPosition.atTop ? 2 : 1;
  const cellCoord: FocusedCellCoord = [cell.pageRowIdx + firstBodyRowIdx, cell.pageColIdx];
  // Make sure you can't navigate to header (and totals) in selection mode
  const allowedRows = {
    top: isSelectionMode ? firstBodyRowIdx : 0,
    bottom: isSelectionMode && totalsPosition.atBottom ? 1 : 0,
  };
  const focusType = getFocusType(cellCoord, evt, isNewHeadCellMenuEnabled);

  if (focusType === FocusTypes.FOCUS) {
    updateFocus({ focusType: FocusTypes.REMOVE_TAB, cell: evt.target as HTMLElement });
  }

  const nextCell = moveFocusWithArrow({
    evt,
    rootElement,
    cellCoord,
    setFocusedCellCoord,
    focusType,
    allowedRows,
  });

  if (!(evt.key === KeyCodes.UP || evt.key === KeyCodes.DOWN)) return;

  if (evt.key === KeyCodes.UP) {
    handleNavigateTop([cell.pageRowIdx, cell.pageColIdx], rootElement);
  }
  // Shift + up/down arrow keys: select multiple values
  if (shouldSelectMultiValues(isSelectionsEnabled, evt, cell)) {
    selectionDispatch({
      type: SelectionActions.SELECT_MULTI_ADD,
      payload: { cell, evt, announce },
    });
  } else {
    // When not selecting multiple we need to announce the selection state of the cell
    announceSelectionState(announce, nextCell, isSelectionMode);
  }
};

/**
 * Update the focusedCellCoord when tabbing in the header.
 * If you tab on the menu in the last cell, go to the tabstop in the body
 */
export const headTabHelper = (
  evt: React.KeyboardEvent,
  rootElement: HTMLElement,
  cellCoord: FocusedCellCoord,
  setFocusedCellCoord: SetFocusedCellCoord,
  isLastHeadCell: boolean,
) => {
  const target = evt.target as HTMLElement;
  const isLabel = target.classList.contains("sn-table-head-label");
  if (isLabel && evt.shiftKey && cellCoord[1] > 0) {
    setFocusedCellCoord([cellCoord[0], cellCoord[1] - 1]);
  } else if (!isLabel && !evt.shiftKey) {
    if (isLastHeadCell) {
      preventDefaultBehavior(evt);
      focusBodyFromHead(rootElement, setFocusedCellCoord);
    } else {
      setFocusedCellCoord([cellCoord[0], cellCoord[1] + 1]);
    }
  }
};

interface BodyTabHelperProps {
  evt: React.KeyboardEvent;
  rootElement: HTMLElement;
  setFocusedCellCoord: SetFocusedCellCoord;
  keyboard?: stardust.Keyboard;
  isSelectionMode?: boolean;
  paginationNeeded?: boolean;
  isNewHeadCellMenuEnabled?: boolean;
}

/**
 * Tab to the selection toolbar if it is next in the tabOrder.
 * Otherwise, if it is shift + tab, go to the last header cell.
 */
export const bodyTabHelper = ({
  evt,
  rootElement,
  setFocusedCellCoord,
  keyboard,
  isSelectionMode,
  paginationNeeded,
  isNewHeadCellMenuEnabled,
}: BodyTabHelperProps) => {
  const tabToToolbar = keyboard?.enabled && isSelectionMode && (evt.shiftKey || (!evt.shiftKey && !paginationNeeded));

  if (tabToToolbar) {
    preventDefaultBehavior(evt);
    focusSelectionToolbar(evt.target as HTMLElement, keyboard, evt.shiftKey);
  } else if (evt.shiftKey && !isNewHeadCellMenuEnabled) {
    const headCells = rootElement.querySelectorAll(".sn-table-head-cell");
    const lastIndex = headCells.length - 1;

    setFocusedCellCoord([0, lastIndex] as FocusedCellCoord);
  }
};
