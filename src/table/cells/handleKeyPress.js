const navigationEffect = (tableRows, nextRow, nextCol) => {
  const nextCell = tableRows[nextRow].getElementsByClassName('sn-table-cell')[nextCol];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

const arrowKeysNavigation = (e, rowAndColumn, rowIndex, colIndex) => {
  let nextRow = rowIndex;
  let nextCol = colIndex;

  switch (e.key) {
    case 'ArrowDown':
      if (rowIndex + 1 < rowAndColumn.tableRowSize) nextRow = ++nextRow;
      break;
    case 'ArrowUp':
      if (rowIndex > 0) nextRow = --nextRow;
      break;
    case 'ArrowRight':
      if (colIndex < rowAndColumn.tableColumnSize - 1) nextCol = ++nextCol;
      break;
    case 'ArrowLeft':
      if (colIndex > 0) nextCol = --nextCol;
      break;
    default:
  }

  return {
    tableRows: rowAndColumn.tableRows,
    nextRow,
    nextCol,
  };
};

const tableRowAndColumn = (rootElement) => {
  const tableRows = rootElement.getElementsByClassName('sn-table-row');
  const tableRowSize = tableRows.length;

  const headCells = rootElement.getElementsByClassName('sn-table-head-cell');
  const tableColumnSize = headCells.length;

  return { tableRows, tableRowSize, tableColumnSize };
};

const handleEvent = (e) => {
  e.stopPropagation();
  e.preventDefault();
  e.target.blur();
  e.target.setAttribute('tabIndex', '-1');
};

const handleKeyPress = (e, rootElement, rowIndex, colIndex) => {
  switch (e.key) {
    // TODO page up/down etc
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      handleEvent(e);
      const rowAndColumn = tableRowAndColumn(rootElement);
      const { tableRows, nextRow, nextCol } = arrowKeysNavigation(e, rowAndColumn, rowIndex, colIndex);
      navigationEffect(tableRows, nextRow, nextCol);
      break;
    }
    // TODO handle selections, search?, sorting...
    default:
      break;
  }
};

export default handleKeyPress;
