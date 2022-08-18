import React from 'react';
import { stardust } from '@nebula.js/stardust';

import { updateFocus, focusSelectionToolbar, getCellElement, announceSelectionState } from './handle-accessibility';
import { SelectionActions, TSelectionActions } from './selections-utils';
import { handleNavigateTop } from './handle-scroll';
import { HandleWrapperKeyDownProps, HandleHeadKeyDownProps, HandleBodyKeyDownProps } from '../../types';

const isCtrlShift = (evt: React.KeyboardEvent) => evt.shiftKey && (evt.ctrlKey || evt.metaKey);

export const preventDefaultBehavior = (evt: React.KeyboardEvent) => {
  evt.stopPropagation();
  evt.preventDefault();
};

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
 * Calculates the next cell to focus
 */
export const getNextCellCoord = (
  evt: React.KeyboardEvent,
  rootElement: HTMLElement,
  cellCoord: [number, number],
  topAllowedRow = 0
): [number, number] => {
  const rowCount = rootElement.getElementsByClassName('sn-table-row').length;
  const columnCount = rootElement.getElementsByClassName('sn-table-head-cell').length;
  let [nextRow, nextCol] = cellCoord;

  switch (evt.key) {
    case 'ArrowDown':
      nextRow < rowCount - 1 && nextRow++;
      break;
    case 'ArrowUp':
      nextRow > topAllowedRow && nextRow--;
      break;
    case 'ArrowRight':
      // topAllowedRow greater than 0 means we are in selection mode
      if (topAllowedRow > 0) break;
      if (nextCol < columnCount - 1) {
        nextCol++;
      } else if (nextRow < rowCount - 1) {
        nextRow++;
        nextCol = 0;
      }
      break;
    case 'ArrowLeft':
      // topAllowedRow greater than 0 means we are in selection mode
      if (topAllowedRow > 0) break;
      if (nextCol > 0) {
        nextCol--;
      } else if (nextRow > 0) {
        nextRow--;
        nextCol = columnCount - 1;
      }
      break;
    default:
      break;
  }

  return [nextRow, nextCol];
};

/**
 * resets and adds new focus to a table cell based which key is pressed
 */
export const moveFocus = (
  evt: React.KeyboardEvent,
  rootElement: HTMLElement,
  cellCoord: [number, number],
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  topAllowedRow?: number
) => {
  preventDefaultBehavior(evt);
  (evt.target as HTMLElement).setAttribute('tabIndex', '-1');
  const nextCellCoord = getNextCellCoord(evt, rootElement, cellCoord, topAllowedRow);
  const nextCell = getCellElement(rootElement, nextCellCoord);
  updateFocus({ focusType: 'focus', cell: nextCell });
  setFocusedCellCoord(nextCellCoord);

  return nextCell;
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
  isSortingEnabled,
  setFocusedCellCoord,
}: HandleHeadKeyDownProps) => {
  switch (evt.key) {
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft':
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord);
      break;
    // Space bar / Enter: update the sorting
    case ' ':
    case 'Enter':
      preventDefaultBehavior(evt);
      isSortingEnabled && changeSortOrder(layout, column);
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
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>
) => {
  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord);
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
}: HandleBodyKeyDownProps) => {
  const isSelectionMode = selectionsAPI.isModal();
  // Adjust the cellCoord depending on the totals position
  const firstBodyRowIdx = totalsPosition === 'top' ? 2 : 1;
  const cellCoord: [number, number] = [cell.rawRowIdx + firstBodyRowIdx, cell.rawColIdx];
  // Make sure you can't navigate to header (and totals) in selection mode
  const topAllowedRow = isSelectionMode ? firstBodyRowIdx : 0;

  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown': {
      evt.key === 'ArrowUp' && handleNavigateTop([cell.rawRowIdx, cell.rawColIdx], rootElement);
      const nextCell = moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, topAllowedRow);
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
          type: SelectionActions.SELECT,
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
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, topAllowedRow);
      break;
    // Space bar: Selects value.
    case ' ':
      preventDefaultBehavior(evt);
      cell.isSelectable &&
        isSelectionsEnabled &&
        selectionDispatch({ type: SelectionActions.SELECT, payload: { cell, evt, announce } });
      break;
    // Enter: Confirms selections.
    case 'Enter':
      preventDefaultBehavior(evt);
      if (isSelectionMode) {
        selectionsAPI.confirm();
        announce({ keys: ['SNTable.SelectionLabel.SelectionsConfirmed'] });
      }
      break;
    // Esc: Cancels selections. If no selections, do nothing and handleWrapperKeyDown should catch it
    case 'Escape':
      if (isSelectionMode) {
        preventDefaultBehavior(evt);
        selectionsAPI.cancel();
        announce({ keys: ['SNTable.SelectionLabel.ExitedSelectionMode'] });
      }
      break;
    // Tab (+ shift): in selection mode and keyboard enabled, focus on selection toolbar
    case 'Tab':
      if (keyboard.enabled && isSelectionMode) {
        if (evt.shiftKey) {
          preventDefaultBehavior(evt);
          focusSelectionToolbar(evt.target, keyboard, true);
        } else if (!paginationNeeded) {
          // Tab only: when there are no pagination controls, go tab straight to selection toolbar
          preventDefaultBehavior(evt);
          focusSelectionToolbar(evt.target, keyboard, false);
        }
      }
      break;
    default:
      break;
  }
};

/**
 * confirms selections when making multiple selections with shift + arrows and shit is released
 */
export const handleBodyKeyUp = (evt: React.KeyboardEvent, selectionDispatch: React.Dispatch<TSelectionActions>) => {
  evt.key === 'Shift' && selectionDispatch({ type: SelectionActions.SELECT_MULTI_VALUES });
};

/**
 * Manually focuses the selection toolbar if tabbing from the last focusable element
 */
export const handleLastTab = (evt: React.KeyboardEvent, isSelectionMode: boolean, keyboard: stardust.Keyboard) => {
  if (isSelectionMode && evt.key === 'Tab' && !evt.shiftKey) {
    // tab key: focus on the selection toolbar
    preventDefaultBehavior(evt);
    focusSelectionToolbar(evt.target, keyboard, false);
  }
};
