const navigationEffect = (e, tableRows, nextRow, nextCol) => {
  e.target.blur();
  e.target.setAttribute('tabIndex', '-1');

  const nextCell = tableRows[nextRow].getElementsByClassName('sn-table-cell')[nextCol];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

const arrowKeysNavigation = (e, rootElement, rowIndex, colIndex) => {
  e.stopPropagation();
  e.preventDefault();
  let currentCol = colIndex;
  let nextCol = currentCol;
  let currentRow = rowIndex;
  let nextRow = currentRow;

  const tableRows = rootElement.getElementsByClassName('sn-table-row');
  const tableRowSize = tableRows.length;

  const headCells = rootElement.getElementsByClassName('sn-table-head-cell');
  const columnSize = headCells.length;

  switch (e.key) {
    case 'ArrowDown':
      if (currentRow + 1 < tableRowSize) {
        nextRow = ++currentRow;
      }
      break;
    case 'ArrowUp':
      if (currentRow > 0) {
        nextRow = --currentRow;
      }
      break;
    case 'ArrowRight':
      if (currentCol < columnSize - 1) nextCol = ++currentCol;
      break;
    case 'ArrowLeft':
      if (currentCol > 0) nextCol = --currentCol;
      break;
    default:
      return;
  }

  navigationEffect(e, tableRows, nextRow, nextCol);
};

const handleKeyPress = (e, rootElement, rowIndex, colIndex) => {
  switch (e.key) {
    // TODO page up/down etc
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft':
      arrowKeysNavigation(e, rootElement, rowIndex, colIndex);
      break;
    // TODO handle selections, search?, sorting...
    default:
      break;
  }
};

export default handleKeyPress;
