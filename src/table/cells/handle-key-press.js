export const focusCell = (rowElements, nextCellCoord) => {
  const nextCell = rowElements[nextCellCoord[0]].getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

export const arrowKeysNavigation = (evt, rowAndColumnCount, cellCoord) => {
  let [nextRow, nextCol] = cellCoord;

  switch (evt.key) {
    case 'ArrowDown':
      nextRow + 1 < rowAndColumnCount.rowCount && nextRow++;
      break;
    case 'ArrowUp':
      nextRow > 0 && --nextRow;
      break;
    case 'ArrowRight':
      nextCol < rowAndColumnCount.columnCount - 1 && nextCol++;
      break;
    case 'ArrowLeft':
      nextCol > 0 && --nextCol;
      break;
    default:
  }

  return [nextRow, nextCol];
};

export const getRowAndColumnCount = (rootElement) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  const rowCount = rowElements.length;

  const headCellElements = rootElement.getElementsByClassName('sn-table-head-cell');
  const columnCount = headCellElements.length;

  return { rowElements, rowCount, columnCount };
};

export const removeCurrentFocus = (evt) => {
  evt.target.blur();
  evt.target.setAttribute('tabIndex', '-1');
};

export const preventDefaultBehavior = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
};

const handleKeyPress = (evt, rootElement, cellCoord, setFocusedCell) => {
  preventDefaultBehavior(evt);
  switch (evt.key) {
    // TODO page up/down etc
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      removeCurrentFocus(evt);
      const rowAndColumnCount = getRowAndColumnCount(rootElement);
      const nextCellCoord = arrowKeysNavigation(evt, rowAndColumnCount, cellCoord);
      focusCell(rowAndColumnCount.rowElements, nextCellCoord);
      setFocusedCell(nextCellCoord);
      break;
    }
    // TODO handle selections, search?, sorting...
    case 'Escape':
      evt.target.blur();
      // setFocusedCell([]);
      break;
    default:
      break;
  }
};

export default handleKeyPress;
