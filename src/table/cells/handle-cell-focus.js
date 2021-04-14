/* eslint-disable no-param-reassign */
export const focusCell = (rowElements, nextCellCoord) => {
  const nextCell = rowElements[nextCellCoord[0]].getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

const resetTabIndex = (rowElements, focusedCellCoord) => {
  const cell = rowElements[focusedCellCoord[0]]?.getElementsByClassName('sn-table-cell')[focusedCellCoord[1]];
  if (cell) {
    cell.setAttribute('tabIndex', '-1');
    cell.blur();
  }
};

export const handleClickToFocus = (cell, focusedCellCoord, rootElement) => {
  const { rawRowIdx, rawColIdx } = cell;
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  resetTabIndex(rowElements, focusedCellCoord.current);
  focusedCellCoord.current = [rawRowIdx + 1, rawColIdx];
  focusCell(rowElements, [rawRowIdx + 1, rawColIdx]);
};

export const handleResetFocus = (focusedCellCoord, rootElement, shouldResetFocus) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  resetTabIndex(rowElements, focusedCellCoord.current);
  focusedCellCoord.current = [0, 0];
  console.log(shouldResetFocus.current);
  if (shouldResetFocus.current) {
    focusCell(rowElements, [0, 0]);
    shouldResetFocus.current = false;
  } else {
    rowElements[0].getElementsByClassName('sn-table-cell')[0].setAttribute('tabIndex', '0');
  }
};
