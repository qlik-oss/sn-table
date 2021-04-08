import { focusCell } from './handle-key-press';

const removeTabSequence = (rowElements, nextCellCoord) => {
  const cell = rowElements[nextCellCoord[0]]?.getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
  cell.setAttribute('tabIndex', '-1');
};

const handleCellFocus = (cell, focusedCell, setFocusedCell, rootElement, pageInfo, page) => {
  const { rowIdx, colIdx } = cell;

  focusedCell.length === 0
    ? removeTabSequence(rootElement.getElementsByClassName('sn-table-row'), [0, 0])
    : focusedCell[2] === page && removeTabSequence(rootElement.getElementsByClassName('sn-table-row'), focusedCell);

  setFocusedCell([rowIdx + 1 - pageInfo.height * page, colIdx, page]);
  focusCell(rootElement.getElementsByClassName('sn-table-row'), [rowIdx + 1 - pageInfo.height * page, colIdx]);

  return true;
};

export default handleCellFocus;
