import { stardust } from '@nebula.js/stardust';
import React from 'react';
import { Announce } from '../../types';
import { FIRST_BODY_CELL_COORD, FocusTypes } from '../constants';
import { CellFocusProps, HandleResetFocusProps } from '../types';
import { findCellWithTabStop, getCellCoordFromCell, getCellElement, getNextCellCoord } from './get-element-utils';

export const areTabStopsEnabled = (keyboard: stardust.Keyboard) => !keyboard.enabled || keyboard.active;

/**
 * Add the tab stop for adjuster hit area and focus that
 */
export const setFocusOnClosetColumnAdjuster = (anchorRef: React.RefObject<HTMLDivElement>) => {
  setTimeout(() => {
    const adjusterHitArea = anchorRef.current
      ?.closest('.sn-table-cell')
      ?.querySelector('#adjuster-hit-area') as HTMLElement;
    adjusterHitArea?.setAttribute('tabIndex', '0');
    adjusterHitArea?.focus();
  }, 0);
};

/**
 * Removes the tab stop for adjuster hit area and focus the head menu button
 */
export const focusHeadMenuButton = (event: React.KeyboardEvent | React.FocusEvent<HTMLDivElement>) => {
  const target = event.target as HTMLDivElement;
  target.setAttribute('tabIndex', '-1');
  const headMenuButton = target
    ?.closest('.sn-table-cell')
    ?.querySelector('#sn-table-head-menu-button') as HTMLButtonElement;
  headMenuButton?.focus();
};

/**
 * Removes/adds tab stop and sometimes focus/blurs the cell, depending on focusType
 */
export const updateFocus = ({ focusType, cell }: CellFocusProps) => {
  if (!cell) return;

  switch (focusType) {
    case FocusTypes.FOCUS:
      cell.focus();
      cell.setAttribute('tabIndex', '0');
      break;
    case FocusTypes.FOCUS_BUTTON:
      // eslint-disable-next-line no-case-declarations
      const button = cell.querySelector('.sn-table-head-label') as HTMLButtonElement;
      button.focus();
      break;
    case FocusTypes.BLUR:
      cell.blur();
      cell.setAttribute('tabIndex', '-1');
      break;
    case FocusTypes.ADD_TAB:
      cell.setAttribute('tabIndex', '0');
      break;
    case FocusTypes.REMOVE_TAB:
      cell.setAttribute('tabIndex', '-1');
      break;
    default:
      break;
  }
};

/**
 * Resets and adds new focus to a table cell based which key is pressed
 */
export const moveFocus = (
  evt: React.KeyboardEvent,
  rootElement: HTMLElement,
  cellCoord: [number, number],
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  focusType: FocusTypes,
  allowedRows?: {
    top: number;
    bottom: number;
  }
) => {
  const nextCellCoord = getNextCellCoord(evt, rootElement, cellCoord, allowedRows);
  const nextCell = getCellElement(rootElement, nextCellCoord);
  updateFocus({ focusType, cell: nextCell });
  setFocusedCellCoord(nextCellCoord);

  return nextCell;
};

export const focusBodyFromHead = (
  rootElement: HTMLElement,
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>
) => {
  const cell = findCellWithTabStop(rootElement);
  const newCellCoord = getCellCoordFromCell(rootElement, cell);
  cell.focus();
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
  keyboard: stardust.Keyboard
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
      const hasSelectedClassName = cell?.classList?.contains('selected');
      announce({
        keys: [
          `${cell.textContent},`,
          hasSelectedClassName ? 'SNTable.SelectionLabel.SelectedValue' : 'SNTable.SelectionLabel.NotSelectedValue',
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
  keyboard: stardust.Keyboard
) => {
  const targetElement = evt.currentTarget as HTMLDivElement;
  const isInTable = targetElement.contains(evt.relatedTarget as Node);
  const isInHeadCellMenu = (evt.relatedTarget as HTMLElement).closest('.sn-table-head-menu');
  if (keyboard.enabled && !isInTable && !isInHeadCellMenu && !shouldRefocus.current) {
    targetElement.querySelector('#sn-table-announcer--01')!.innerHTML = '';
    targetElement.querySelector('#sn-table-announcer--02')!.innerHTML = '';
    // Blur the table but not focus its parent element
    // when keyboard.active is false, this has no effect
    // @ts-ignore TODO: fix nebula api so that blur has the correct argument type
    keyboard.blur?.(false);
  }
};

/**
 * Sets focus to button in the selection toolbar, handles both client and nebula toolbar
 */
export const focusSelectionToolbar = (element: HTMLElement, keyboard: stardust.Keyboard, last: boolean) => {
  const clientConfirmButton = element
    .closest('.qv-object-wrapper')
    ?.querySelector('.sel-toolbar-confirm')?.parentElement;
  if (clientConfirmButton) {
    clientConfirmButton.focus();
    return;
  }
  // @ts-ignore TODO: fix nebula api so that blur has the correct argument type
  keyboard.focusSelection?.(last);
};

/**
 * Updates the announcer with current cell selection state
 */
export const announceSelectionState = (
  announce: Announce,
  nextCell: HTMLTableCellElement,
  isSelectionMode: boolean
) => {
  if (isSelectionMode) {
    const hasActiveClassName = nextCell.classList.contains('selected');
    hasActiveClassName
      ? announce({ keys: ['SNTable.SelectionLabel.SelectedValue'] })
      : announce({ keys: ['SNTable.SelectionLabel.NotSelectedValue'] });
  }
};
