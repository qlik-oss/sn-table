import { selectCell, confirmSelections, cancelSelections } from '../selections-utils';

export const moveToNextFocus = (rowElements, nextRow, nextCol) => {
  const nextCell = rowElements[nextRow].getElementsByClassName('sn-table-cell')[nextCol];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

export const arrowKeysNavigation = (evt, rowAndColumnCount, rowIndex, colIndex) => {
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

const handleKeyPress = (evt, rootElement, rowIndex, colIndex, cell, selState, selDispatch) => {
  switch (evt.key) {
    case 'ArrowUp': // Up arrow:  Navigates to the row above.
    case 'ArrowDown': // Down arrow: Navigates to the row below.
    case 'ArrowRight':
    case 'ArrowLeft': {
      preventDefaultBehavior(evt);
      removeCurrentFocus(evt);
      const rowAndColumnCount = getRowAndColumnCount(rootElement);
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      moveToNextFocus(rowAndColumnCount.rowElements, nextRow, nextCol);
      break;
    }
    // Space bar: Selects value.
    case ' ': {
      preventDefaultBehavior(evt);
      cell?.isDim && selectCell(cell, selState, selDispatch, evt);
      break;
    }
    // Enter: Confirms selections.
    case 'Enter': {
      preventDefaultBehavior(evt);
      confirmSelections(selState);
      break;
    }
    // Esc: Cancels selections.
    case 'Escape': {
      preventDefaultBehavior(evt);
      cancelSelections(selState);
      break;
    }
    default:
      break;
  }
};

export default handleKeyPress;
