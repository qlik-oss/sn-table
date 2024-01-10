import { stardust } from "@nebula.js/stardust";
import { COLUMN_ADJUSTER_CLASS } from "@qlik/nebula-table-utils/lib/constants";
import React from "react";
import { Announce } from "../../types";
import { FIRST_BODY_CELL_COORD, FIRST_HEADER_CELL_COORD, FocusTypes } from "../constants";
import {
  CellFocusProps,
  FocusedCellCoord,
  HandleResetFocusProps,
  MoveFocusWithArrowProps,
  SetFocusedCellCoord,
} from "../types";
import { findCellWithTabStop, getCellCoord, getCellElement, getNextCellCoord } from "./get-element-utils";

export const areTabStopsEnabled = (keyboard: stardust.Keyboard) => !keyboard.enabled || keyboard.active;

/**
 * Add the tab stop for adjuster hit area and focus that
 */
export const setFocusOnClosetColumnAdjuster = (anchorRef: React.RefObject<HTMLElement>) => {
  setTimeout(() => {
    const adjusterHitArea = anchorRef.current
      ?.closest(".sn-table-cell")
      ?.querySelector<HTMLElement>(`.${COLUMN_ADJUSTER_CLASS}`);
    adjusterHitArea?.setAttribute("tabIndex", "0");
    adjusterHitArea?.focus();
  }, 0);
};

/**
 * Removes the tab stop for adjuster hit area and focus the head menu button
 */
export const focusBackToHeadCell = (currentTarget: EventTarget & Element, isNewHeadCellMenuEnabled: boolean) => {
  currentTarget.setAttribute("tabIndex", "-1");
  const cellElement = currentTarget.closest<HTMLElement>(".sn-table-cell");

  let targetElementToFocus = null;
  if (isNewHeadCellMenuEnabled) {
    targetElementToFocus = cellElement;
    targetElementToFocus?.setAttribute("tabIndex", "0");
  } else {
    targetElementToFocus = cellElement?.querySelector<HTMLElement>(".sn-table-head-menu-button");
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
      const button = cell.querySelector<HTMLElement>(".sn-table-head-label");
      button?.focus();
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
export const moveFocusWithArrow = ({
  evt,
  rootElement,
  cellCoord,
  setFocusedCellCoord,
  focusType,
  allowedRows,
}: MoveFocusWithArrowProps) => {
  const nextCellCoord = getNextCellCoord(evt, rootElement, cellCoord, allowedRows);
  const nextCell = getCellElement(rootElement, nextCellCoord);
  updateFocus({ focusType, cell: nextCell });
  setFocusedCellCoord(nextCellCoord);

  return nextCell;
};

/**
 * Finds the cell with tab stops and focuses that cell.
 * If no cells has focus, it focuses the first body cell instead
 */
export const focusBodyFromHead = (rootElement: HTMLElement, setFocusedCellCoord: SetFocusedCellCoord) => {
  let cell = findCellWithTabStop(rootElement);
  const newCellCoord = cell ? getCellCoord(rootElement, cell) : FIRST_BODY_CELL_COORD;
  cell = cell || getCellElement(rootElement, FIRST_BODY_CELL_COORD);
  updateFocus({ cell, focusType: FocusTypes.FOCUS });
  setFocusedCellCoord(newCellCoord);
};

/**
 * Resets and adds new focus to the cell at position newCoord.
 * No need for element.focus() since that is done natively when clicking.
 */
export const removeTabAndFocusCell = (
  newCoord: FocusedCellCoord,
  rootElement: HTMLElement,
  setFocusedCellCoord: SetFocusedCellCoord,
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
  isNewHeadCellMenuEnabled,
}: HandleResetFocusProps) => {
  updateFocus({ focusType: FocusTypes.REMOVE_TAB, cell: findCellWithTabStop(rootElement) });
  // If you have selections ongoing, you want to stay on the same column
  const selectionCellCoord: FocusedCellCoord = [totalsPosition.atTop ? 2 : 1, focusedCellCoord[1]];
  const defaultCellCoords: FocusedCellCoord = isNewHeadCellMenuEnabled
    ? FIRST_HEADER_CELL_COORD
    : FIRST_BODY_CELL_COORD;
  const cellCoord = isSelectionMode ? selectionCellCoord : defaultCellCoords;

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
  const targetElement = evt.currentTarget as HTMLElement;
  const relatedTarget = evt.relatedTarget as HTMLElement | null;
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
export const announceSelectionState = (announce: Announce, nextCell: HTMLElement, isSelectionMode = false) => {
  if (isSelectionMode) {
    const hasActiveClassName = nextCell.classList.contains("selected");
    hasActiveClassName
      ? announce({ keys: ["SNTable.SelectionLabel.SelectedValue"] })
      : announce({ keys: ["SNTable.SelectionLabel.NotSelectedValue"] });
  }
};
