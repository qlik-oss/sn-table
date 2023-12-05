/* eslint-disable no-case-declarations */
import { preventDefaultBehavior } from "@qlik/nebula-table-utils/lib/utils";
import React from "react";
import { FocusTypes, KeyCodes, SelectionActions } from "../constants";
import { HandleBodyKeyDownProps, HandleHeadKeyDownProps, HandleWrapperKeyDownProps, SelectionDispatch } from "../types";
import { focusBodyFromHead, moveFocusWithArrow, updateFocus } from "./accessibility-utils";
import copyCellValue from "./copy-utils";
import { findCellWithTabStop, getNextMenuItem, getPreviousMenuItem } from "./get-element-utils";
import {
  bodyArrowHelper,
  bodyTabHelper,
  getFocusType,
  headTabHelper,
  isArrowKey,
  isCtrlCmd,
  isCtrlShift,
  shouldBubbleEarly,
} from "./keyboard-utils";

/**
 * handles ArrowDown and ArrowUp events for the head cell menu (move focus)
 */
export const handleHeadCellMenuKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
  const { key, target } = event;
  const currentFocusItem = document.activeElement ?? (target as HTMLElement);
  // The rest key are handled by handleKeyDown in MUIMenuList
  if (key === KeyCodes.DOWN || key === KeyCodes.UP) {
    const getNewFocusItem = (currentItem: Element) =>
      key === KeyCodes.DOWN ? getNextMenuItem(currentItem) : getPreviousMenuItem(currentItem);
    // Prevent scroll of the page
    // Stop triggering handleKeyDown in MUIMenuList
    preventDefaultBehavior(event);
    let newFocusItem = getNewFocusItem(currentFocusItem);
    while (newFocusItem) {
      if (newFocusItem.ariaDisabled === "true") {
        newFocusItem = getNewFocusItem(newFocusItem);
      } else {
        (newFocusItem as HTMLElement).focus();
        break;
      }
    }
  }
};

/**
 * confirms selections when making multiple selections with shift + arrows and shit is released
 */
export const handleBodyKeyUp = (evt: React.KeyboardEvent, selectionDispatch: SelectionDispatch) => {
  evt.key === KeyCodes.SHIFT && selectionDispatch({ type: SelectionActions.SELECT_MULTI_END });
};

/**
 * ----------- Table key down handlers -----------
 * General pattern for handling keydown events:
 * 1. Event caught by inner handlers (head, totals or body)
 * 2. Check if they are disabled completely (in selection mode, on an excluded cell etc), then run preventDefaultBehavior and early return
 * 3. Check if the event should bubble
 * 4a. If it should bubble, early return and let handleWrapperKeyDown catch the event.
 * If the key pressed is not relevant to the wrapper, it will keep bubbling (e.g. tab)
 * 4b. If it shouldn't bubble, run the logic for that specific component handler
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
    keyboard.blur?.(true);
  } else if (isArrowKey(evt.key)) {
    // Arrow key events should never bubble out of the table
    preventDefaultBehavior(evt);
  }
};

/**
 * handles keydown events for the head cells (move focus, copy cell value)
 */
export const handleHeadKeyDown = ({
  evt,
  rootElement,
  cellCoord,
  setFocusedCellCoord,
  isInteractionEnabled,
  handleOpenMenu,
  isNewHeadCellMenuEnabled,
}: HandleHeadKeyDownProps) => {
  if (!isInteractionEnabled) {
    preventDefaultBehavior(evt);
    return;
  }

  if (shouldBubbleEarly(evt)) return;

  const target = evt.target as HTMLElement;
  const isLastHeadCell = !target.closest(".sn-table-cell")?.nextSibling;

  switch (evt.key) {
    case KeyCodes.LEFT:
    case KeyCodes.RIGHT:
      preventDefaultBehavior(evt);
      if (evt.key === KeyCodes.RIGHT && isLastHeadCell && !isNewHeadCellMenuEnabled) {
        focusBodyFromHead(rootElement, setFocusedCellCoord);
      } else {
        moveFocusWithArrow({
          evt,
          rootElement,
          cellCoord,
          setFocusedCellCoord,
          focusType: isNewHeadCellMenuEnabled ? FocusTypes.FOCUS : FocusTypes.FOCUS_BUTTON,
          isNewHeadCellMenuEnabled,
        });
      }
      break;
    case KeyCodes.DOWN:
      preventDefaultBehavior(evt);
      updateFocus({ focusType: FocusTypes.REMOVE_TAB, cell: findCellWithTabStop(rootElement) });
      moveFocusWithArrow({
        evt,
        rootElement,
        cellCoord,
        setFocusedCellCoord,
        focusType: FocusTypes.FOCUS,
        isNewHeadCellMenuEnabled,
      });
      break;
    case KeyCodes.TAB:
      headTabHelper(evt, rootElement, cellCoord, setFocusedCellCoord, isLastHeadCell, isNewHeadCellMenuEnabled);
      break;
    case KeyCodes.C:
      preventDefaultBehavior(evt);
      isCtrlCmd(evt) && copyCellValue(evt);
      break;
    case isNewHeadCellMenuEnabled && KeyCodes.ENTER:
    case isNewHeadCellMenuEnabled && KeyCodes.SPACE:
      handleOpenMenu && handleOpenMenu();
      break;
    default:
      break;
  }
};

/**
 * handles keydown events for the totals cells (move focus, copy cell, value)
 */
export const handleTotalKeyDown = (
  evt: React.KeyboardEvent,
  rootElement: HTMLElement,
  cellCoord: [number, number],
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  isNewHeadCellMenuEnabled: boolean,
  isSelectionMode = false,
) => {
  if (isSelectionMode) {
    preventDefaultBehavior(evt);
    return;
  }
  if (shouldBubbleEarly(evt)) return;

  switch (evt.key) {
    case KeyCodes.LEFT:
    case KeyCodes.RIGHT:
    case KeyCodes.UP:
    case KeyCodes.DOWN: {
      preventDefaultBehavior(evt);
      const focusType = getFocusType(cellCoord, evt, isNewHeadCellMenuEnabled);
      if (focusType === FocusTypes.FOCUS) {
        updateFocus({ focusType: FocusTypes.REMOVE_TAB, cell: evt.target as HTMLTableCellElement });
      }

      moveFocusWithArrow({ evt, rootElement, cellCoord, setFocusedCellCoord, focusType, isNewHeadCellMenuEnabled });
      break;
    }
    case KeyCodes.TAB:
      bodyTabHelper({ evt, rootElement, setFocusedCellCoord });
      break;
    case KeyCodes.C: {
      preventDefaultBehavior(evt);
      isCtrlCmd(evt) && copyCellValue(evt);
      break;
    }
    case KeyCodes.SPACE:
      evt.preventDefault();
      break;
    default:
      break;
  }
};

/**
 * handles keydown events for the body cells (move focus, make selections, copy cell value)
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
  isNewHeadCellMenuEnabled,
}: HandleBodyKeyDownProps) => {
  if ((evt.target as HTMLTableCellElement).classList.contains("excluded")) {
    preventDefaultBehavior(evt);
    return;
  }
  const isSelectionMode = selectionsAPI?.isModal();
  if (shouldBubbleEarly(evt, isSelectionMode)) return;

  switch (evt.key) {
    // Arrows: move focus and select multiple with shift
    case KeyCodes.UP:
    case KeyCodes.DOWN:
    case KeyCodes.LEFT:
    case KeyCodes.RIGHT:
      preventDefaultBehavior(evt);
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
        isNewHeadCellMenuEnabled,
      });
      break;
    // Space bar: Selects value.
    case KeyCodes.SPACE:
      preventDefaultBehavior(evt);
      cell.isSelectable &&
        isSelectionsEnabled &&
        selectionDispatch({ type: SelectionActions.SELECT, payload: { cell, evt, announce } });
      break;
    // Enter: Confirms selections.
    case KeyCodes.ENTER:
      preventDefaultBehavior(evt);
      if (isSelectionMode) {
        selectionsAPI?.confirm();
        announce({ keys: ["SNTable.SelectionLabel.SelectionsConfirmed"] });
      }
      break;
    // Esc: Cancels selections. If no selections, do nothing and handleWrapperKeyDown should catch it
    case KeyCodes.ESC:
      preventDefaultBehavior(evt);
      selectionsAPI?.cancel();
      announce({ keys: ["SNTable.SelectionLabel.ExitedSelectionMode"] });
      break;
    // Tab (+ shift): in selection mode and keyboard enabled, focus on selection toolbar
    case KeyCodes.TAB:
      bodyTabHelper({ evt, rootElement, setFocusedCellCoord, keyboard, isSelectionMode, paginationNeeded });
      break;
    // Ctrl + c: copy cell value
    case KeyCodes.C:
      preventDefaultBehavior(evt);
      isCtrlCmd(evt) && copyCellValue(evt);
      break;
    default:
      break;
  }
};
