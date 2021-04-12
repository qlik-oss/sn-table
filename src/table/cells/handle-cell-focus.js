export const focusCell = (rowElements, nextCellCoord) => {
  const nextCell = rowElements[nextCellCoord[0]].getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

const removeTabSequence = (rowElements, nextCellCoord) => {
  const cell = rowElements[nextCellCoord[0]]?.getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
  cell && cell.setAttribute('tabIndex', '-1');
};

export const handleCellFocus = (cell, focusedCell, setFocusedCell, rootElement) => {
  const { rawRowIdx, rawColIdx } = cell;

  removeTabSequence(
    rootElement.getElementsByClassName('sn-table-row'),
    focusedCell.length === 0 ? [0, 0] : focusedCell
  );

  setFocusedCell([rawRowIdx + 1, rawColIdx]);

  focusCell(rootElement.getElementsByClassName('sn-table-row'), [rawRowIdx + 1, rawColIdx]);

  return true;
};
