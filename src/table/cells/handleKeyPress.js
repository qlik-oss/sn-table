const moveToNextFocus = (rowElements, nextRow, nextCol) => {
  const nextCell = rowElements[nextRow].getElementsByClassName('sn-table-cell')[nextCol];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

const arrowKeysNavigation = (evt, rowAndColumnCount, rowIndex, colIndex) => {
  let nextRow = rowIndex;
  let nextCol = colIndex;

  switch (evt.key) {
    case 'ArrowDown':
      rowIndex + 1 < rowAndColumnCount.rowCount && nextRow++;
      break;
    case 'ArrowUp':
      rowIndex > 0 && --nextRow;
      break;
    case 'ArrowRight':
      colIndex < rowAndColumnCount.columnCount - 1 && nextCol++;
      break;
    case 'ArrowLeft':
      colIndex > 0 && --nextCol;
      break;
    default:
  }

  return {
    nextRow,
    nextCol,
  };
};

const getRowAndColumnCount = (rootElement) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  const rowCount = rowElements.length;

  const headCellElements = rootElement.getElementsByClassName('sn-table-head-cell');
  const columnCount = headCellElements.length;

  return { rowElements, rowCount, columnCount };
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
      const rowAndColumnCount = getRowAndColumnCount(rootElement);
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      moveToNextFocus(rowAndColumnCount.rowElements, nextRow, nextCol);
      break;
    }
    // TODO handle selections, search?, sorting...
    default:
      break;
  }
};

export default handleKeyPress;
