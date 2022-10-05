import React from 'react';
import { stardust } from '@nebula.js/stardust';

import { focusSelectionToolbar, announceSelectionState, moveFocus, copyCellValue } from './accessibility-utils';
import { handleNavigateTop } from './handle-scroll';
import { HandleWrapperKeyDownProps, HandleHeadKeyDownProps, HandleBodyKeyDownProps, SelectionDispatch } from '../types';
import { Cell } from '../../types';
import { KeyCodes, SelectionActions } from '../constants';

const isCtrlShift = (evt: React.KeyboardEvent) => evt.shiftKey && (evt.ctrlKey || evt.metaKey);

export const isArrowKey = (key: string) =>
  [KeyCodes.LEFT, KeyCodes.RIGHT, KeyCodes.UP, KeyCodes.DOWN].includes(key as KeyCodes);

export const preventDefaultBehavior = (evt: React.KeyboardEvent) => {
  evt.stopPropagation();
  evt.preventDefault();
};

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
  ((evt.key === KeyCodes.UP && cell.rawRowIdx !== 0) || (evt.key === KeyCodes.DOWN && !cell.isLastRow)) &&
  areBasicFeaturesEnabled &&
  isSelectionsEnabled &&
  cell.isSelectable;

/**
 * ----------- Key handlers -----------
 * General pattern for handling keydown events:
 * 1. Event caught by inner handlers (head, totals or body)
 * 2. Check if they are disabled completely (in selection mode, on an excluded cell etc), then run preventDefaultBehavior and early return
 * 3. Check if the event should bubble
 * 4a. If it should bubble, early return and let handleWrapperKeyDown catch the event.
 * If the key pressed is not relevant to the wrapper, it will keep bubbling (e.g. tab)
 * 4b. If it shouldn't bubble, run preventDefaultBehavior and run the logic for that specific component
 */

/**
 * handles keydown events for the tableWrapper element (move focus, change page)
 */
export const handleWrapperKeyDown = ({
  evt,
  totalRowCount,
  page,
  rowsPerPage,
  handleChangePage,
  setShouldRefocus,
  keyboard,
  isSelectionMode,
}: HandleWrapperKeyDownProps) => {
  if (isCtrlShift(evt)) {
    preventDefaultBehavior(evt);
    // ctrl + shift + left/right arrow keys: go to previous/next page
    const lastPage = Math.ceil(totalRowCount / rowsPerPage) - 1;
    if (evt.key === KeyCodes.RIGHT && page < lastPage) {
      setShouldRefocus();
      handleChangePage(page + 1);
    } else if (evt.key === KeyCodes.LEFT && page > 0) {
      setShouldRefocus();
      handleChangePage(page - 1);
    }
  } else if (evt.key === KeyCodes.ESC && keyboard.enabled && !isSelectionMode) {
    // escape key: tell Nebula to relinquish the table's focus to
    // its parent element when nebula handles keyboard navigation
    // and not in selection mode
    preventDefaultBehavior(evt);
    // @ts-ignore TODO: fix nebula api so that blur has the correct argument type
    keyboard.blur?.(true);
  } else if (isArrowKey(evt.key)) {
    // Arrow key events should never bubble out of the table
    preventDefaultBehavior(evt);
  }
};

/**
 * handles keydown events for the head cells (move focus, change sort order)
 */
export const handleHeadKeyDown = ({
  evt,
  rootElement,
  cellCoord,
  column,
  changeSortOrder,
  layout,
  isInteractionEnabled,
  setFocusedCellCoord,
}: HandleHeadKeyDownProps) => {
  if (!isInteractionEnabled) {
    preventDefaultBehavior(evt);
    return;
  }
  if (shouldBubble(evt)) return;
  preventDefaultBehavior(evt);

  switch (evt.key) {
    case KeyCodes.LEFT:
    case KeyCodes.RIGHT:
    case KeyCodes.DOWN:
      moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord);
      break;
    case KeyCodes.SPACE:
    case KeyCodes.ENTER:
      // Space bar / Enter: update the sorting
      changeSortOrder(layout, column);
      break;
    default:
      break;
  }
};

/**
 * handles keydown events for the totals cells (move focus)
 */
export const handleTotalKeyDown = (
  evt: React.KeyboardEvent,
  rootElement: HTMLElement,
  cellCoord: [number, number],
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  isSelectionMode: boolean
) => {
  if (isSelectionMode) {
    preventDefaultBehavior(evt);
    return;
  }
  if (shouldBubble(evt)) return;
  preventDefaultBehavior(evt);

  switch (evt.key) {
    case KeyCodes.LEFT:
    case KeyCodes.RIGHT:
    case KeyCodes.UP:
    case KeyCodes.DOWN: {
      moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord);
      break;
    }
    default:
      break;
  }
};

/**
 * handles keydown events for the body cells (move focus, make selections tabbing to other elements)
 */
export const handleBodyKeyDown = ({
  evt,
  rootElement,
  cell,
  selectionDispatch,
  isSelectionsEnabled,
  setFocusedCellCoord,
  announce,
  keyboard,
  paginationNeeded,
  totalsPosition,
  selectionsAPI,
  areBasicFeaturesEnabled,
}: HandleBodyKeyDownProps) => {
  if ((evt.target as HTMLTableCellElement).classList.contains('excluded')) {
    preventDefaultBehavior(evt);
    return;
  }
  const isSelectionMode = selectionsAPI.isModal();
  if (shouldBubble(evt, isSelectionMode, keyboard.enabled, paginationNeeded)) return;
  preventDefaultBehavior(evt);

  // Adjust the cellCoord depending on the totals position
  const firstBodyRowIdx = totalsPosition === 'top' ? 2 : 1;
  const cellCoord: [number, number] = [cell.rawRowIdx + firstBodyRowIdx, cell.rawColIdx];
  // Make sure you can't navigate to header (and totals) in selection mode
  const allowedRows = {
    top: isSelectionMode ? firstBodyRowIdx : 0,
    bottom: isSelectionMode && totalsPosition === 'bottom' ? 1 : 0,
  };

  switch (evt.key) {
    case KeyCodes.UP:
    case KeyCodes.DOWN: {
      evt.key === KeyCodes.UP && handleNavigateTop([cell.rawRowIdx, cell.rawColIdx], rootElement);
      const nextCell = moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, allowedRows);
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
      break;
    }
    case KeyCodes.LEFT:
    case KeyCodes.RIGHT:
      moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, allowedRows);
      break;
    // Space bar: Selects value.
    case KeyCodes.SPACE:
      cell.isSelectable &&
        isSelectionsEnabled &&
        selectionDispatch({ type: SelectionActions.SELECT, payload: { cell, evt, announce } });
      break;
    // Enter: Confirms selections.
    case KeyCodes.ENTER:
      if (isSelectionMode) {
        selectionsAPI.confirm();
        announce({ keys: ['SNTable.SelectionLabel.SelectionsConfirmed'] });
      }
      break;
    // Esc: Cancels selections. If no selections, do nothing and handleWrapperKeyDown should catch it
    case KeyCodes.ESC:
      selectionsAPI.cancel();
      announce({ keys: ['SNTable.SelectionLabel.ExitedSelectionMode'] });
      break;
    // Tab (+ shift): in selection mode and keyboard enabled, focus on selection toolbar
    case KeyCodes.TAB:
      focusSelectionToolbar(evt.target as HTMLElement, keyboard, evt.shiftKey);
      break;
    case KeyCodes.C:
      areBasicFeaturesEnabled &&
        (evt.ctrlKey || evt.metaKey) &&
        copyCellValue((evt.target as HTMLElement).textContent as string);
      break;
    default:
      break;
  }
};

/**
 * confirms selections when making multiple selections with shift + arrows and shit is released
 */
export const handleBodyKeyUp = (
  evt: React.KeyboardEvent,
  selectionDispatch: SelectionDispatch,
  areBasicFeaturesEnabled: boolean
) => {
  areBasicFeaturesEnabled &&
    evt.key === KeyCodes.SHIFT &&
    selectionDispatch({ type: SelectionActions.SELECT_MULTI_END });
};

/**
 * Manually focuses the selection toolbar if tabbing from the last focusable element
 */
export const handleLastTab = (evt: React.KeyboardEvent, isSelectionMode: boolean, keyboard: stardust.Keyboard) => {
  if (isSelectionMode && evt.key === KeyCodes.TAB && !evt.shiftKey) {
    // tab key: focus on the selection toolbar
    preventDefaultBehavior(evt);
    // @ts-ignore TODO: fix nebula api so that target has the correct argument type
    focusSelectionToolbar(evt.target, keyboard, false);
  }
};
