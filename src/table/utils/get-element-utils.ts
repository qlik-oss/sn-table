import { KeyCodes } from "../constants";
import { FocusedCellCoord } from "../types";

/**
 * Calculates the next cell to focus
 */
export const getNextCellCoord = (
  evt: React.KeyboardEvent,
  rootElement: HTMLElement,
  cellCoord: FocusedCellCoord,
  allowedRows: {
    top: number;
    bottom: number;
  } = { top: 0, bottom: 0 },
): FocusedCellCoord => {
  const rowCount = rootElement.getElementsByClassName("sn-table-row").length;
  const columnCount = rootElement.getElementsByClassName("sn-table-head-cell").length;
  let [nextRow, nextCol] = cellCoord;

  switch (evt.key) {
    case KeyCodes.DOWN:
      nextRow < rowCount - 1 - allowedRows.bottom && nextRow++;
      break;
    case KeyCodes.UP:
      nextRow > allowedRows.top && nextRow--;
      break;
    case KeyCodes.RIGHT:
      // allowedRows.top greater than 0 means we are in selection mode
      if (allowedRows.top > 0) break;
      if (nextCol < columnCount - 1) {
        nextCol++;
      } else if (nextRow < rowCount - 1) {
        nextRow++;
        nextCol = 0;
      }
      break;
    case KeyCodes.LEFT:
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

export const getCellElement = (rootElement: HTMLElement, cellCoord: FocusedCellCoord) =>
  rootElement.getElementsByClassName("sn-table-row")[cellCoord[0]]?.getElementsByClassName("sn-table-cell")[
    cellCoord[1]
  ] as HTMLElement | undefined;

export const findCellWithTabStop = (rootElement: HTMLElement) =>
  rootElement.querySelector<HTMLElement>("td[tabindex='0'], th[tabindex='0']");

export const getNextMenuItem = (currentFocus: Element): Element | undefined => {
  const nextItem = currentFocus.nextElementSibling;
  if (!nextItem) {
    return currentFocus.parentElement?.children?.[0];
  }
  if (nextItem.tagName === "HR") {
    return getNextMenuItem(nextItem);
  }
  return nextItem;
};

export const getPreviousMenuItem = (currentFocus: Element): Element | undefined => {
  const previousItem = currentFocus.previousElementSibling;
  if (!previousItem) {
    const menuItemAmount = currentFocus.parentElement?.children?.length as number;
    return currentFocus.parentElement?.children?.[menuItemAmount - 1];
  }
  if (previousItem.tagName === "HR") {
    return getPreviousMenuItem(previousItem);
  }
  return previousItem;
};

export const getCellCoord = (rootElement: HTMLElement, cell: HTMLElement): FocusedCellCoord => {
  const width = rootElement.getElementsByClassName("sn-table-head-cell").length;
  const cells = rootElement.getElementsByClassName("sn-table-cell");

  let cellIdx = 0;
  for (let idx = 0; idx < cells.length; idx++) {
    if (cells[idx] === cell) {
      cellIdx = idx;
      break;
    }
  }

  return [Math.ceil(cellIdx / width), cellIdx % width];
};
