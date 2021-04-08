import { focusCell } from './handle-key-press';

const removeTabSequence = (rowElements, nextCellCoord) => {
  const cell = rowElements[nextCellCoord[0]]?.getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
  cell.setAttribute('tabIndex', '-1');
};

const handleCellFocus = (columnIndex, cell, focusedCell, setFocusedCell, rootElement, pageInfo, page) => {
  const { rowIdx } = cell;

  focusedCell.length === 0
    ? removeTabSequence(rootElement.getElementsByClassName('sn-table-row'), [0, 0])
    : focusedCell[2] === page && removeTabSequence(rootElement.getElementsByClassName('sn-table-row'), focusedCell);

  setFocusedCell([rowIdx + 1 - pageInfo.height * page, columnIndex, page]);

  // const cells = rootElement.getElementsByClassName('sn-table-cell');
  // for (let i = 0; i < cells.length; i++) {
  //   cells[i].setAttribute('tabIndex', '-1');
  // }

  focusCell(rootElement.getElementsByClassName('sn-table-row'), [rowIdx + 1 - pageInfo.height * page, columnIndex]);

  return true;
};

export default handleCellFocus;
