import React from 'react';
import { stardust } from '@nebula.js/stardust';

import { focusSelectionToolbar, announceSelectionState, moveFocus, copyCellValue } from './accessibility-utils';
import { SelectionActions, TSelectionActions } from './selections-utils';
import { handleNavigateTop } from './handle-scroll';
import { HandleWrapperKeyDownProps, HandleHeadKeyDownProps, HandleBodyKeyDownProps } from '../types';

const isCtrlShift = (evt: React.KeyboardEvent) => evt.shiftKey && (evt.ctrlKey || evt.metaKey);

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
    (evt.key === 'Escape' && !isSelectionMode) ||
    // default tab to pagination or tab to blur
    (evt.key === 'Tab' && (bubbleWithoutShift || bubbleWithShift)) ||
    // ctrl + shift + arrow to change page
    ((evt.key === 'ArrowLeft' || evt.key === 'ArrowRight') && isCtrlShift(evt))
  );
};

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
    if (evt.key === 'ArrowRight' && page < lastPage) {
      setShouldRefocus();
      handleChangePage(page + 1);
    } else if (evt.key === 'ArrowLeft' && page > 0) {
      setShouldRefocus();
      handleChangePage(page - 1);
    }
  } else if (evt.key === 'Escape' && keyboard.enabled && !isSelectionMode) {
    // escape key: tell Nebula to relinquish the table's focus to
    // its parent element when nebula handles keyboard navigation
    // and not in selection mode
    preventDefaultBehavior(evt);
    // @ts-ignore TODO: fix nebula api so that blur has the correct argument type
    keyboard.blur?.(true);
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
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft':
      moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord);
      break;
    // Space bar / Enter: update the sorting
    case ' ':
    case 'Enter':
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
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
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
  isFlagEnabled,
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
    case 'ArrowUp':
    case 'ArrowDown': {
      evt.key === 'ArrowUp' && handleNavigateTop([cell.rawRowIdx, cell.rawColIdx], rootElement);
      const nextCell = moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, allowedRows);
      // Shift + up/down arrow keys: select multiple values
      // When at the first/last row of the cell, shift + arrow up/down key, no value is selected
      const isSelectMultiValues =
        evt.shiftKey &&
        cell.isSelectable &&
        isSelectionsEnabled &&
        ((cell.prevQElemNumber !== undefined && evt.key === 'ArrowUp') ||
          (cell.nextQElemNumber !== undefined && evt.key === 'ArrowDown'));
      if (isSelectMultiValues) {
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
    case 'ArrowRight':
    case 'ArrowLeft':
      moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, allowedRows);
      break;
    // Space bar: Selects value.
    case ' ':
      cell.isSelectable &&
        isSelectionsEnabled &&
        selectionDispatch({ type: SelectionActions.SELECT, payload: { cell, evt, announce } });
      break;
    // Enter: Confirms selections.
    case 'Enter':
      if (isSelectionMode) {
        selectionsAPI.confirm();
        announce({ keys: ['SNTable.SelectionLabel.SelectionsConfirmed'] });
      }
      break;
    // Esc: Cancels selections. If no selections, do nothing and handleWrapperKeyDown should catch it
    case 'Escape':
      selectionsAPI.cancel();
      announce({ keys: ['SNTable.SelectionLabel.ExitedSelectionMode'] });
      break;
    // Tab (+ shift): in selection mode and keyboard enabled, focus on selection toolbar
    case 'Tab':
      focusSelectionToolbar(evt.target as HTMLElement, keyboard, evt.shiftKey);
      break;
    case 'c':
      isFlagEnabled('PS_15585_SN_TABLE_BASIC_FEATURES') && (evt.ctrlKey || evt.metaKey) && copyCellValue(cell);
      break;
    default:
      break;
  }
};

/**
 * confirms selections when making multiple selections with shift + arrows and shit is released
 */
export const handleBodyKeyUp = (evt: React.KeyboardEvent, selectionDispatch: React.Dispatch<TSelectionActions>) => {
  evt.key === 'Shift' && selectionDispatch({ type: SelectionActions.SELECT_MULTI_END });
};

/**
 * Manually focuses the selection toolbar if tabbing from the last focusable element
 */
export const handleLastTab = (evt: React.KeyboardEvent, isSelectionMode: boolean, keyboard: stardust.Keyboard) => {
  if (isSelectionMode && evt.key === 'Tab' && !evt.shiftKey) {
    // tab key: focus on the selection toolbar
    preventDefaultBehavior(evt);
    // @ts-ignore TODO: fix nebula api so that target has the correct argument type
    focusSelectionToolbar(evt.target, keyboard, false);
  }
};
