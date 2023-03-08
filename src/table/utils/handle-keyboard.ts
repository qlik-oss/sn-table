/* eslint-disable no-case-declarations */
import React from 'react';
import { stardust } from '@nebula.js/stardust';

import { focusSelectionToolbar, moveFocus, focusBodyFromHead, updateFocus } from './accessibility-utils';
import {
  preventDefaultBehavior,
  isCtrlShift,
  isArrowKey,
  isCtrlCmd,
  shouldBubble,
  bodyArrowHelper,
} from './keyboard-utils';
import { findCellWithTabStop, getNextMenuItem, getPreviousMenuItem } from './get-element-utils';
import copyCellValue from './copy-utils';
import { HandleWrapperKeyDownProps, HandleHeadKeyDownProps, HandleBodyKeyDownProps, SelectionDispatch } from '../types';
import { KeyCodes, SelectionActions } from '../constants';

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
  setFocusedCellCoord,
  isInteractionEnabled,
  areBasicFeaturesEnabled,
}: HandleHeadKeyDownProps) => {
  if (!isInteractionEnabled) {
    preventDefaultBehavior(evt);
    return;
  }

  // TODO: See if it bubbles correctly
  if (shouldBubble(evt)) return;
  preventDefaultBehavior(evt);

  const target = evt.target as HTMLElement;
  const isLastHeadCell = !target.closest('.sn-table-cell')?.nextSibling;

  switch (evt.key) {
    case KeyCodes.LEFT:
    case KeyCodes.RIGHT:
      if (evt.key === KeyCodes.RIGHT && isLastHeadCell) {
        focusBodyFromHead(rootElement, setFocusedCellCoord);
      } else {
        moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, 'focusButton');
      }
      break;
    case KeyCodes.DOWN:
      updateFocus({ focusType: 'removeTab', cell: findCellWithTabStop(rootElement) });
      moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, 'focus');
      break;
    case KeyCodes.C:
      areBasicFeaturesEnabled && isCtrlCmd(evt) && copyCellValue(evt);

      break;
    default:
      break;
  }
};

/**
 * handles ArrowDown and ArrowUp events for the head cell menu (move focus)
 */
export const handleHeadCellMenuKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
  const { key, target } = event;
  const currentFocusItem = document.activeElement ?? (target as HTMLElement);
  // The rest key are handled by handleKeyDown in MUIMenuList
  if (key === 'ArrowDown' || key === 'ArrowUp') {
    const getNewFocusItem = (currentItem: Element) =>
      key === 'ArrowDown' ? getNextMenuItem(currentItem) : getPreviousMenuItem(currentItem);
    // Prevent scroll of the page
    // Stop triggering handleKeyDown in MUIMenuList
    preventDefaultBehavior(event);
    let newFocusItem = getNewFocusItem(currentFocusItem);
    while (newFocusItem) {
      if (newFocusItem.ariaDisabled === 'true') {
        newFocusItem = getNewFocusItem(newFocusItem);
      } else {
        (newFocusItem as HTMLElement).focus();
        break;
      }
    }
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
    // TODO: fix keyboard move for totals
    case KeyCodes.LEFT:
    case KeyCodes.RIGHT:
    case KeyCodes.UP:
    case KeyCodes.DOWN: {
      // moveBodyFocus(evt, rootElement, cellCoord, setFocusedCellCoord);
      break;
    }
    case KeyCodes.C: {
      areBasicFeaturesEnabled && isCtrlCmd(evt) && copyCellValue(evt);
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

  switch (evt.key) {
    case KeyCodes.UP:
    case KeyCodes.DOWN:
    case KeyCodes.LEFT:
    case KeyCodes.RIGHT:
      bodyArrowHelper({
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
      });
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
      areBasicFeaturesEnabled && isCtrlCmd(evt) && copyCellValue(evt);
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
