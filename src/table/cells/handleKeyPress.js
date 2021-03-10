const moveToNextFocus = (tableRows, nextRow, nextCol) => {
  const nextCell = tableRows[nextRow].getElementsByClassName('sn-table-cell')[nextCol];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

const arrowKeysNavigation = (evt, rowAndColumn, rowIndex, colIndex) => {
  let nextRow = rowIndex;
  let nextCol = colIndex;

  switch (evt.key) {
    case 'ArrowDown':
      if (rowIndex + 1 < rowAndColumn.tableRowSize) nextRow++;
      break;
    case 'ArrowUp':
      if (rowIndex > 0) --nextRow;
      break;
    case 'ArrowRight':
      if (colIndex < rowAndColumn.tableColumnSize - 1) nextCol++;
      break;
    case 'ArrowLeft':
      if (colIndex > 0) --nextCol;
      break;
    default:
  }

  return {
    tableRows: rowAndColumn.tableRows,
    nextRow,
    nextCol,
  };
};

const getRowAndColumn = (rootElement) => {
  const tableRows = rootElement.getElementsByClassName('sn-table-row');
  const tableRowSize = tableRows.length;

  const headCells = rootElement.getElementsByClassName('sn-table-head-cell');
  const tableColumnSize = headCells.length;

  return { tableRows, tableRowSize, tableColumnSize };
};

const removeCurrentFocus = (evt) => {
  evt.target.blur();
  evt.target.setAttribute('tabIndex', '-1');
};

const preventDefaultBehavior = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
};

const handleKeyPress = (evt, rootElement, rowIndex, colIndex) => {
  preventDefaultBehavior(evt);
  switch (evt.key) {
    // TODO page up/down etc
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      removeCurrentFocus(evt);
      const rowAndColumn = getRowAndColumn(rootElement);
      const { tableRows, nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumn, rowIndex, colIndex);
      moveToNextFocus(tableRows, nextRow, nextCol);
      break;
    }
    // TODO handle selections, search?, sorting...
    default:
      break;
  }
};

export default handleKeyPress;
