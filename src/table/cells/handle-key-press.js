import { selectCell } from '../selections-utils';
import { focusCell } from './handle-cell-focus';

const isCtrlShift = (evt) => evt.shiftKey && (evt.ctrlKey || evt.metaKey);

export const updatePage = (evt, totalRowSize, page, rowsPerPage, handleChangePage) => {
  if (isCtrlShift(evt)) {
    const lastPage = Math.ceil(totalRowSize / rowsPerPage) - 1;
    if (evt.key === 'ArrowRight' && page < lastPage) {
      handleChangePage(null, page + 1);
    } else if (evt.key === 'ArrowLeft' && page > 0) {
      handleChangePage(null, page - 1);
    }
  }
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

export const moveFocus = (evt, rootElement, cellCoord, focusedCellCoord, selState) => {
  preventDefaultBehavior(evt);
  removeCurrentFocus(evt);
  const rowAndColumnCount = getRowAndColumnCount(rootElement);
  const nextCellCoord = arrowKeysNavigation(evt, rowAndColumnCount, cellCoord, selState);
  focusCell(rowAndColumnCount.rowElements, nextCellCoord);
  focusedCellCoord.current = nextCellCoord;
};

export const headHandleKeyPress = (
  evt,
  rootElement,
  cellCoord,
  focusedCellCoord,
  changeSortOrder,
  layout,
  isDim,
  isAnalysisMode
) => {
  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, focusedCellCoord);
      break;
    }
    // Space bar / Enter: update the sorting
    case ' ':
    case 'Enter': {
      preventDefaultBehavior(evt);
      isAnalysisMode && changeSortOrder(layout, isDim, cellCoord[1]);
      break;
    }
    default:
      break;
  }
};

export const bodyHandleKeyPress = (
  evt,
  rootElement,
  cellCoord,
  focusedCellCoord,
  selState,
  cell,
  selDispatch,
  isAnalysisMode
) => {
  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, focusedCellCoord, selState);
      break;
    }
    // Space bar: Selects value.
    case ' ': {
      preventDefaultBehavior(evt);
      cell?.isDim && isAnalysisMode && selectCell(selState, cell, selDispatch, evt);
      break;
    }
    // Enter: Confirms selections.
    case 'Enter': {
      preventDefaultBehavior(evt);
      isAnalysisMode && selState.api.confirm();
      break;
    }
    // Esc: Cancels selections
    case 'Escape': {
      preventDefaultBehavior(evt);
      isAnalysisMode && selState.api.cancel();
      break;
    }
    default:
      break;
  }
};
