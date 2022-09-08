import { stardust } from '@nebula.js/stardust';
import { Announce } from '../../types';
import { CellFocusProps, HandleResetFocusProps } from '../types';

export const getCellElement = (rootElement: HTMLElement, cellCoord: [number, number]) =>
  rootElement.getElementsByClassName('sn-table-row')[cellCoord[0]]?.getElementsByClassName('sn-table-cell')[
    cellCoord[1]
  ] as HTMLTableCellElement;

export const findCellWithTabStop = (rootElement: HTMLElement) =>
  rootElement.querySelector("td[tabindex='0'], th[tabindex='0']") as HTMLTableCellElement;

/**
 * Removes/adds tab stop and sometimes focuses or blurs the cell, depending on focusTupe
 */
export const updateFocus = ({ focusType, cell }: CellFocusProps) => {
  if (!cell) return;

  switch (focusType) {
    case 'focus':
      cell.focus();
      cell.setAttribute('tabIndex', '0');
      break;
    case 'blur':
      cell.blur();
      cell.setAttribute('tabIndex', '-1');
      break;
    case 'addTab':
      cell.setAttribute('tabIndex', '0');
      break;
    case 'removeTab':
      cell.setAttribute('tabIndex', '-1');
      break;
    default:
      break;
  }
};

/**
 * Calculates the next cell to focus
 */
export const getNextCellCoord = (
  evt: React.KeyboardEvent,
  rootElement: HTMLElement,
  cellCoord: [number, number],
  allowedRows: {
    top: number;
    bottom: number;
  } = { top: 0, bottom: 0 }
): [number, number] => {
  const rowCount = rootElement.getElementsByClassName('sn-table-row').length;
  const columnCount = rootElement.getElementsByClassName('sn-table-head-cell').length;
  let [nextRow, nextCol] = cellCoord;

  switch (evt.key) {
    case 'ArrowDown':
      nextRow < rowCount - 1 - allowedRows.bottom && nextRow++;
      break;
    case 'ArrowUp':
      nextRow > allowedRows.top && nextRow--;
      break;
    case 'ArrowRight':
      // allowedRows.top greater than 0 means we are in selection mode
      if (allowedRows.top > 0) break;
      if (nextCol < columnCount - 1) {
        nextCol++;
      } else if (nextRow < rowCount - 1) {
        nextRow++;
        nextCol = 0;
      }
      break;
    case 'ArrowLeft':
      // allowedRows.top greater than 0 means we are in selection mode
      if (allowedRows.top > 0) break;
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
 * Resets and adds new focus to a table cell based which key is pressed
 */
export const moveFocus = (
  evt: React.KeyboardEvent,
  rootElement: HTMLElement,
  cellCoord: [number, number],
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  allowedRows?: {
    top: number;
    bottom: number;
  }
) => {
  updateFocus({ focusType: 'removeTab', cell: evt.target as HTMLTableCellElement });
  const nextCellCoord = getNextCellCoord(evt, rootElement, cellCoord, allowedRows);
  const nextCell = getCellElement(rootElement, nextCellCoord);
  updateFocus({ focusType: 'focus', cell: nextCell });
  setFocusedCellCoord(nextCellCoord);

  return nextCell;
};

/**
 * Resets and adds new focus to the cell at position newCoord
 */
export const removeTabAndFocusCell = (
  newCoord: [number, number],
  rootElement: HTMLElement,
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  keyboard: stardust.Keyboard
) => {
  updateFocus({ focusType: 'removeTab', cell: findCellWithTabStop(rootElement) });
  setFocusedCellCoord(newCoord);
  keyboard.enabled && keyboard.focus?.();
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
  updateFocus({ focusType: 'removeTab', cell: findCellWithTabStop(rootElement) });
  // If you have selections ongoing, you want to stay on the same column
  const selectionCellCoord: [number, number] = [totalsPosition === 'top' ? 2 : 1, focusedCellCoord[1]];
  const cellCoord: [number, number] = isSelectionMode ? selectionCellCoord : [0, 0];

  if (!keyboard.enabled || keyboard.active) {
    // Only run this if updates come from inside table
    const focusType = shouldRefocus.current ? 'focus' : 'addTab';
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
 * On focus is no longer in the table, resets the announcer and calls keyboard.blur
 */
export const handleFocusoutEvent = (
  evt: FocusEvent,
  shouldRefocus: React.MutableRefObject<boolean>,
  keyboard: stardust.Keyboard
) => {
  const targetElement = evt.currentTarget as HTMLDivElement;
  if (keyboard?.enabled && !targetElement.contains(evt.relatedTarget as Node) && !shouldRefocus.current) {
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
