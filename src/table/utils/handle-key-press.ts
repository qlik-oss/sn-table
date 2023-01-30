/* eslint-disable no-case-declarations */
import React from 'react';
import { stardust } from '@nebula.js/stardust';

import {
  focusSelectionToolbar,
  announceSelectionState,
  moveFocus,
  updateFocus,
  findCellWithTabStop,
  getCellCoordFromCell,
} from './accessibility-utils';
import copyCellValue from './copy-utils';
import { handleNavigateTop } from './handle-scroll';
import { HandleWrapperKeyDownProps, HandleHeadKeyDownProps, HandleBodyKeyDownProps, SelectionDispatch } from '../types';
import { Cell } from '../../types';
import { KeyCodes, SelectionActions } from '../constants';

const preventDefaultBehavior = (evt: React.KeyboardEvent) => {
  evt.stopPropagation();
  evt.preventDefault();
};

const isCtrlShift = (evt: React.KeyboardEvent) => evt.shiftKey && (evt.ctrlKey || evt.metaKey);

const isArrowKey = (key: string) =>
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
  const bubbleWithoutShift = !evt.shiftKey && (paginationNeeded || !keyboardEnabled);
  return (
    // esc to blur object
    (evt.key === KeyCodes.ESC && !isSelectionMode) ||
    // default tab to pagination or tab to blur
    (evt.key === KeyCodes.TAB && (bubbleWithoutShift || evt.shiftKey)) ||
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

export const focusBodyFromHead = (
  evt: React.KeyboardEvent,
  rootElement: HTMLElement,
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>
) => {
  preventDefaultBehavior(evt);
  const cell = findCellWithTabStop(rootElement);
  const newCellCoord = getCellCoordFromCell(rootElement, cell);
  cell.focus();
  setFocusedCellCoord(newCellCoord);
};

/**
 * handles keydown events for the head cells (move focus, change sort order)
 */
export const handleHeadKeyDown = ({
  evt,
  rootElement,
  cellCoord,
  setFocusedCellCoord,
  isInteractionEnabled,
  areBasicFeaturesEnabled,
  isLabelLast,
}: HandleHeadKeyDownProps) => {
  if (!isInteractionEnabled) {
    preventDefaultBehavior(evt);
    return;
  }

  // TODO: See if it bubbles correctly
  // if (shouldBubble(evt)) return;
  // preventDefaultBehavior(evt);

  const target = evt.target as HTMLElement;
  const headCells = rootElement.getElementsByClassName('sn-table-head-cell');
  const isLastHeadCell = target.closest('.sn-table-cell') === headCells[headCells.length - 1];

  switch (evt.key) {
    case KeyCodes.LEFT:
    case KeyCodes.RIGHT:
      if (isLastHeadCell) {
        focusBodyFromHead(evt, rootElement, setFocusedCellCoord);
      } else {
        moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, 'focusButton');
      }
      break;
    case KeyCodes.DOWN:
      updateFocus({ focusType: 'removeTab', cell: findCellWithTabStop(rootElement) });
      moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, 'focus');
      break;
    case KeyCodes.C:
      areBasicFeaturesEnabled && (evt.ctrlKey || evt.metaKey) && copyCellValue(evt);
      break;
    case KeyCodes.TAB:
      if (evt.shiftKey) break;

      if (isLastHeadCell && !target.classList.contains('sn-table-head-label')) {
        focusBodyFromHead(evt, rootElement, setFocusedCellCoord);
      }
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
  isSelectionMode: boolean,
  areBasicFeaturesEnabled: boolean
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
      // moveBodyFocus(evt, rootElement, cellCoord, setFocusedCellCoord);
      break;
    }
    case KeyCodes.C: {
      areBasicFeaturesEnabled && (evt.ctrlKey || evt.metaKey) && copyCellValue(evt);
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
  const firstBodyRowIdx = totalsPosition.atTop ? 2 : 1;
  const cellCoord: [number, number] = [cell.pageRowIdx + firstBodyRowIdx, cell.pageColIdx];
  // Make sure you can't navigate to header (and totals) in selection mode
  const allowedRows = {
    top: isSelectionMode ? firstBodyRowIdx : 0,
    bottom: isSelectionMode && totalsPosition.atBottom ? 1 : 0,
  };
  let focusType = 'focus';

  switch (evt.key) {
    case KeyCodes.UP:
    case KeyCodes.DOWN: {
      // TODO: break this out
      if (evt.key === KeyCodes.UP) {
        handleNavigateTop([cell.pageRowIdx, cell.pageColIdx], rootElement);
        if (cellCoord[0] === 1) focusType = 'focusButton';
      }
      if (cellCoord[0] !== 1 || evt.key !== KeyCodes.UP) {
        console.log('remove tab');
        updateFocus({ focusType: 'removeTab', cell: evt.target as HTMLTableCellElement });
      }
      const nextCell = moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, focusType, allowedRows);
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
      updateFocus({ focusType: 'removeTab', cell: evt.target as HTMLTableCellElement });
      moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, focusType, allowedRows);
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
      areBasicFeaturesEnabled && (evt.ctrlKey || evt.metaKey) && copyCellValue(evt);
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
