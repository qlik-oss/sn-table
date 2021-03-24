import { selectCell } from '../selections-utils';

export const focusCell = (rowElements, nextCellCoord) => {
  const nextCell = rowElements[nextCellCoord[0]].getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
  nextCell.focus();
  nextCell.setAttribute('tabIndex', '0');
};

export const arrowKeysNavigation = (evt, rowAndColumnCount, cellCoord, selState) => {
  let [nextRow, nextCol] = cellCoord;
  const isSelectedTable = selState && selState.rows.length > 0;

  switch (evt.key) {
    case 'ArrowDown':
      nextRow + 1 < rowAndColumnCount.rowCount && nextRow++;
      break;
    case 'ArrowUp':
      nextRow > 0 && (!isSelectedTable || nextRow !== 1) && nextRow--;
      break;
    case 'ArrowRight':
      nextCol < rowAndColumnCount.columnCount - 1 && !isSelectedTable && nextCol++;
      break;
    case 'ArrowLeft':
      nextCol > 0 && !isSelectedTable && nextCol--;
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

export const moveFocus = (evt, rootElement, cellCoord, setFocusedCell, selState) => {
  preventDefaultBehavior(evt);
  removeCurrentFocus(evt);
  const rowAndColumnCount = getRowAndColumnCount(rootElement);
  const nextCellCoord = arrowKeysNavigation(evt, rowAndColumnCount, cellCoord, selState);
  focusCell(rowAndColumnCount.rowElements, nextCellCoord);
  setFocusedCell(nextCellCoord);
};

export const headHandleKeyPress = (evt, rootElement, cellCoord, setFocusedCell, changeSortOrder, layout, isDim) => {
  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      moveFocus(evt, rootElement, cellCoord, setFocusedCell);
      break;
    }
    // Space bar / Enter: update the sorting
    case ' ':
    case 'Enter': {
      preventDefaultBehavior(evt);
      changeSortOrder(layout, isDim, cellCoord[1]);
      break;
    }
    default:
      break;
  }
};

export const bodyHandleKeyPress = (evt, rootElement, cellCoord, setFocusedCell, cell, selState, selDispatch) => {
  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      moveFocus(evt, rootElement, cellCoord, setFocusedCell, selState);
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
      // TODO: make sure focus is kept, or set on nebula cell
      break;
    }
    // Esc: Cancels selections if any, otherwise blur
    case 'Escape': {
      preventDefaultBehavior(evt);
      if (selState?.rows.length) {
        selState.api.cancel();
        // TODO: make sure focus is kept
      } else {
        removeCurrentFocus(evt);
        // dropFocus()
      }
      break;
    }
    // Tab: blur cell, or if shift, focus nebula cell
    case 'Tab': {
      // dropFocus()
      removeCurrentFocus(evt);
      if (evt.shiftKey) {
        // go to nebula... might not be done here
      }
      break;
    }
    default:
      break;
  }
};
