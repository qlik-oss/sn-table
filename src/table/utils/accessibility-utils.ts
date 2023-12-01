import { stardust } from "@nebula.js/stardust";
import { COLUMN_ADJUSTER_CLASS } from "@qlik/nebula-table-utils/lib/constants";
import React from "react";
import { Announce } from "../../types";
import { FIRST_BODY_CELL_COORD, FocusTypes } from "../constants";
import { CellFocusProps, HandleResetFocusProps } from "../types";
import { findCellWithTabStop, getCellCoord, getCellElement, getNextCellCoord } from "./get-element-utils";

export const areTabStopsEnabled = (keyboard: stardust.Keyboard) => !keyboard.enabled || keyboard.active;

/**
 * Add the tab stop for adjuster hit area and focus that
 */
export const setFocusOnClosetColumnAdjuster = (anchorRef: React.RefObject<HTMLDivElement>) => {
  setTimeout(() => {
    const adjusterHitArea = anchorRef.current
      ?.closest(".sn-table-cell")
      ?.querySelector(`.${COLUMN_ADJUSTER_CLASS}`) as HTMLElement;
    adjusterHitArea?.setAttribute("tabIndex", "0");
    adjusterHitArea?.focus();
  }, 0);
};

/**
 * Removes the tab stop for adjuster hit area and focus the head menu button
 */
export const focusBackToHeadCell = (
  event: React.KeyboardEvent | React.FocusEvent,
  isNewHeadCellMenuEnabled: boolean,
) => {
  const target = event.target as HTMLDivElement;
  target.setAttribute("tabIndex", "-1");
  const baseElement = target?.closest(".sn-table-cell");

  let targetElementToFocus = null;
  if (isNewHeadCellMenuEnabled) {
    targetElementToFocus = baseElement as HTMLDivElement;
    targetElementToFocus?.setAttribute("tabIndex", "0");
  } else {
    targetElementToFocus = baseElement?.querySelector(".sn-table-head-menu-button") as HTMLButtonElement;
  }

  targetElementToFocus?.focus();
};

/**
 * Removes/adds tab stop and sometimes focus/blurs the cell, depending on focusType
 */
export const updateFocus = ({ focusType, cell }: CellFocusProps) => {
  if (!cell) return;

  switch (focusType) {
    case FocusTypes.FOCUS:
      cell.focus();
      cell.setAttribute("tabIndex", "0");
      break;
    case FocusTypes.FOCUS_BUTTON:
      // eslint-disable-next-line no-case-declarations
      const button = cell.querySelector(".sn-table-head-label") as HTMLButtonElement;
      button.focus();
      break;
    case FocusTypes.BLUR:
      cell.blur();
      cell.setAttribute("tabIndex", "-1");
      break;
    case FocusTypes.ADD_TAB:
      cell.setAttribute("tabIndex", "0");
      break;
    case FocusTypes.REMOVE_TAB:
      cell.setAttribute("tabIndex", "-1");
      break;
    default:
      break;
  }
};

/**
 * Resets and adds new focus to a table cell based which arrow key is pressed
 */
export const moveFocusWithArrow = (
  evt: React.KeyboardEvent,
  rootElement: HTMLElement,
  cellCoord: [number, number],
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  focusType: FocusTypes,
  isNewHeadCellMenuEnabled: boolean,
  allowedRows?: {
    top: number;
    bottom: number;
  },
  updateFocusInjected = updateFocus,
) => {
  const nextCellCoord = getNextCellCoord(evt, rootElement, cellCoord, allowedRows);
  const nextCell = getCellElement(rootElement, nextCellCoord);
  if (isNewHeadCellMenuEnabled && focusType === FocusTypes.FOCUS) {
    updateFocusInjected({ focusType: FocusTypes.REMOVE_TAB, cell: evt.target as HTMLTableCellElement });
  }
  updateFocusInjected({ focusType, cell: nextCell });
  setFocusedCellCoord(nextCellCoord);

  return nextCell;
};

/**
 * Finds the cell with tab stops and focuses that cell.
 * If no cells has focus, it focuses the first body cell instead
 */
export const focusBodyFromHead = (
  rootElement: HTMLElement,
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  isNewHeadCellMenuEnabled: boolean,
  updateFocusInjected = updateFocus, // this is for test purposes
) => {
  let cell = findCellWithTabStop(rootElement);
  let newCellCoord;

  if (isNewHeadCellMenuEnabled && cell) {
    // if flag is on, tabstop might be removed from head cells and
    // always FIRST_BODY_CELL_COORD might be focused
    updateFocusInjected({ focusType: FocusTypes.REMOVE_TAB, cell });
    newCellCoord = FIRST_BODY_CELL_COORD;
    cell = getCellElement(rootElement, FIRST_BODY_CELL_COORD);
  } else {
    // if flag is off, tab stop should be where it was before in body
    // in case it's first time navigating to body, it should focus FIRST_BODY_CELL_COORD
    newCellCoord = cell ? getCellCoord(rootElement, cell) : FIRST_BODY_CELL_COORD;
    cell = cell || getCellElement(rootElement, FIRST_BODY_CELL_COORD);
  }
  updateFocusInjected({ cell, focusType: FocusTypes.FOCUS });
  setFocusedCellCoord(newCellCoord);
};

/**
 * Resets and adds new focus to the cell at position newCoord.
 * No need for element.focus() since that is done natively when clicking.
 */
export const removeTabAndFocusCell = (
  newCoord: [number, number],
  rootElement: HTMLElement,
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  keyboard: stardust.Keyboard,
) => {
  updateFocus({ focusType: FocusTypes.REMOVE_TAB, cell: findCellWithTabStop(rootElement) });
  setFocusedCellCoord(newCoord);
  if (keyboard.enabled && !keyboard.active) {
    keyboard.focus?.();
  } else {
    updateFocus({ focusType: FocusTypes.ADD_TAB, cell: getCellElement(rootElement, newCoord) });
  }
};

/**
 * Resets the focus when the data size or page is change, only adds a tab stop when shouldRefocus.current is false
 */
export const resetFocus = ({
  focusedCellCoord,
  rootElement,
  shouldRefocus,
  isSelectionMode,
  setFocusedCellCoord,
  keyboard,
  announce,
  totalsPosition,
}: HandleResetFocusProps) => {
  updateFocus({ focusType: FocusTypes.REMOVE_TAB, cell: findCellWithTabStop(rootElement) });
  // If you have selections ongoing, you want to stay on the same column
  const selectionCellCoord: [number, number] = [totalsPosition.atTop ? 2 : 1, focusedCellCoord[1]];
  const cellCoord: [number, number] = isSelectionMode ? selectionCellCoord : FIRST_BODY_CELL_COORD;

  if (areTabStopsEnabled(keyboard)) {
    // Only run this if updates come from inside table
    const focusType = shouldRefocus.current ? FocusTypes.FOCUS : FocusTypes.ADD_TAB;
    shouldRefocus.current = false;
    const cell = getCellElement(rootElement, cellCoord);
    updateFocus({ focusType, cell });

    if (isSelectionMode) {
      const hasSelectedClassName = cell?.classList?.contains("selected");
      announce({
        keys: [
          `${cell.textContent},`,
          hasSelectedClassName ? "SNTable.SelectionLabel.SelectedValue" : "SNTable.SelectionLabel.NotSelectedValue",
        ],
      });
    }
  }

  setFocusedCellCoord(cellCoord);
};

/**
 * When focus is no longer in the table or head cell menu, resets the announcer and calls keyboard.blur
 */
export const handleFocusoutEvent = (
  evt: FocusEvent,
  shouldRefocus: React.MutableRefObject<boolean>,
  keyboard: stardust.Keyboard,
) => {
  const targetElement = evt.currentTarget as HTMLDivElement;
  const relatedTarget = evt.relatedTarget as HTMLElement;
  const isInTable = targetElement.contains(relatedTarget);
  const isInHeadCellMenu = relatedTarget?.closest(".sn-table-head-menu");
  if (keyboard.enabled && !isInTable && !isInHeadCellMenu && !shouldRefocus.current) {
    targetElement.querySelector(".sn-table-announcer-1")!.innerHTML = "";
    targetElement.querySelector(".sn-table-announcer-2")!.innerHTML = "";
    // Blur the table but not focus its parent element
    // when keyboard.active is false, this has no effect
    keyboard.blur?.(false);
  }
};

/**
 * Updates the announcer with current cell selection state
 */
export const announceSelectionState = (announce: Announce, nextCell: HTMLTableCellElement, isSelectionMode = false) => {
  if (isSelectionMode) {
    const hasActiveClassName = nextCell.classList.contains("selected");
    hasActiveClassName
      ? announce({ keys: ["SNTable.SelectionLabel.SelectedValue"] })
      : announce({ keys: ["SNTable.SelectionLabel.NotSelectedValue"] });
  }
};
