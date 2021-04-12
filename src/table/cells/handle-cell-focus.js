export const focusCell = (rowElements, nextCellCoord) => {
  const nextCell = rowElements[nextCellCoord[0]].getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

const resetTabIndex = (tableRow, focusedCell) => {
  for (let i = 0; i < tableRow.length; i++) {
    const cell = tableRow[i].children[focusedCell];
    cell && cell.setAttribute('tabIndex', '-1');
  }
};

export const handleCellFocus = (cell, focusedCell, setFocusedCell, rootElement) => {
  const { rawRowIdx, rawColIdx } = cell;
  const tableRow = rootElement.getElementsByClassName('sn-table-row');
  resetTabIndex(tableRow, focusedCell);
  setFocusedCell(rawColIdx);
  focusCell(tableRow, [rawRowIdx + 1, rawColIdx]);
};
