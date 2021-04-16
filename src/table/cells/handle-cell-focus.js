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

export const handleClickToFocusBody = (cell, focusedCellCoord, rootElement) => {
  const { rawRowIdx, rawColIdx } = cell;
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  resetTabIndex(rowElements, focusedCellCoord.current);
  focusedCellCoord.current = [rawRowIdx + 1, rawColIdx];
  focusCell(rowElements, [rawRowIdx + 1, rawColIdx]);
};

export const handleClickToFocusHead = (columnIndex, focusedCellCoord, rootElement) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  resetTabIndex(rowElements, focusedCellCoord.current);
  focusedCellCoord.current = [0, columnIndex];
  focusCell(rowElements, [0, columnIndex]);
};

export const handleResetFocus = (focusedCellCoord, rootElement, shouldRefocus, hasSelections) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  resetTabIndex(rowElements, focusedCellCoord.current);
  // If we have selections ongoing, we want to stay on the same column
  const nextcell = [0, hasSelections ? focusedCellCoord.current[1] : 0];
  focusedCellCoord.current = nextcell;
  if (shouldRefocus.current) {
    focusCell(rowElements, nextcell);
    shouldRefocus.current = false;
  } else {
    rowElements[0].getElementsByClassName('sn-table-cell')[nextcell[1]].setAttribute('tabIndex', '0');
  }
};
