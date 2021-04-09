export const focusCell = (rowElements, nextCellCoord) => {
  const nextCell = rowElements[nextCellCoord[0]].getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

const removeTabSequence = (rowElements, nextCellCoord) => {
  const cell = rowElements[nextCellCoord[0]]?.getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
  cell.setAttribute('tabIndex', '-1');
};

export const handleCellFocus = (cell, focusedCell, setFocusedCell, rootElement, page) => {
  const { rawRowIdx, rawColIdx } = cell;

  focusedCell.length === 0
    ? removeTabSequence(rootElement.getElementsByClassName('sn-table-row'), [0, 0])
    : focusedCell[2] === page && removeTabSequence(rootElement.getElementsByClassName('sn-table-row'), focusedCell);

  setFocusedCell([rawRowIdx + 1, rawColIdx, page]);

  focusCell(rootElement.getElementsByClassName('sn-table-row'), [rawRowIdx + 1, rawColIdx]);

  return true;
};
