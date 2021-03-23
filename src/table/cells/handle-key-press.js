import { selectCell } from '../selections-utils';

export const moveToNextFocus = (rowElements, nextRow, nextCol) => {
  const nextCell = rowElements[nextRow].getElementsByClassName('sn-table-cell')[nextCol];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

export const arrowKeysNavigation = (evt, rowAndColumnCount, rowIndex, colIndex, selState) => {
  let nextRow = rowIndex;
  let nextCol = colIndex;
  //  when selecting cell, disable navigating left/right and going into header
  const isSelectedTable = selState && selState.rows.length > 0;

  switch (evt.key) {
    case 'ArrowDown':
      rowIndex + 1 < rowAndColumnCount.rowCount && nextRow++;
      break;
    case 'ArrowUp':
      rowIndex > 0 && (!isSelectedTable || rowIndex !== 1) && --nextRow;
      break;
    case 'ArrowRight':
      colIndex < rowAndColumnCount.columnCount - 1 && !isSelectedTable && nextCol++;
      break;
    case 'ArrowLeft':
      colIndex > 0 && !isSelectedTable && --nextCol;
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

export const moveFocus = (evt, rootElement, rowIndex, colIndex, selState) => {
  preventDefaultBehavior(evt);
  removeCurrentFocus(evt);
  const rowAndColumnCount = getRowAndColumnCount(rootElement);
  const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex, selState);
  moveToNextFocus(rowAndColumnCount.rowElements, nextRow, nextCol);
};

export const headHandleKeyPress = (evt, rootElement, rowIndex, colIndex, changeSortOrder, layout, isDim) => {
  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      moveFocus(evt, rootElement, rowIndex, colIndex);
      break;
    }
    // Space bar / Enter: update the sorting
    case ' ':
    case 'Enter': {
      preventDefaultBehavior(evt);
      changeSortOrder(layout, isDim, colIndex);
      break;
    }
    default:
      break;
  }
};

export const bodyHandleKeyPress = (evt, rootElement, rowIndex, colIndex, cell, selState, selDispatch) => {
  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      moveFocus(evt, rootElement, rowIndex, colIndex, selState);
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
      selState.api.confirm();
      break;
    }
    // Esc: Cancels selections.
    case 'Escape': {
      preventDefaultBehavior(evt);
      selState.api.cancel();
      break;
    }
    default:
      break;
  }
};
