import { selectCell, cancelSelectCell, doSelectCell } from '../selections-utils';

const keysPressed = {};

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

export const handleKeyUp = (evt) => {
  delete keysPressed[evt.key];
};

const handleKeyPress = (evt, rootElement, rows, rowIndex, colIndex, colId, cell, selState, selDispatch) => {
  keysPressed[evt.key] = true;

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
      // Shift + up/down arrows: Selects multiple values.
      if (keysPressed.Shift && (evt.key === 'ArrowUp' || evt.key === 'ArrowDown')) {
        doSelectCell(evt, rows, rowIndex, colId, selState, selDispatch);
      }
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
      const { api } = selState;
      api.confirm();
      break;
    }
    // Esc: Cancels selections.
    case 'Escape': {
      preventDefaultBehavior(evt);
      cancelSelectCell(selState);
      break;
    }
    default:
      break;
  }
};

export default handleKeyPress;
