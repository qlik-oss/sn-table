export const focusCell = (rowElements, nextCellCoord) => {
  const nextCell = rowElements[nextCellCoord[0]].getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

const resetTabIndex = (rowElements, focusedCellCoord) => {
  const cell = rowElements[focusedCellCoord[0]]?.getElementsByClassName('sn-table-cell')[focusedCellCoord[1]];
  cell && cell.setAttribute('tabIndex', '-1');
};

export const handleBodyCellFocus = (cell, focusedCellCoord, rootElement) => {
  const { rawRowIdx, rawColIdx } = cell;
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  resetTabIndex(rowElements, focusedCellCoord.current);
  const focusedCellCoordCopy = focusedCellCoord;
  focusedCellCoordCopy.current = [rawRowIdx + 1, rawColIdx];
  focusCell(rowElements, [rawRowIdx + 1, rawColIdx]);
};

export const handleHeadCellFocus = (columnIndex, focusedCellCoord, rootElement) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  resetTabIndex(rowElements, focusedCellCoord.current);
  const focusedCellCoordCopy = focusedCellCoord;
  focusedCellCoordCopy.current = [0, columnIndex];
  focusCell(rowElements, [0, columnIndex]);
};
