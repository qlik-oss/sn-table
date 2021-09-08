import { selectCell } from '../selections-utils';
import { updateFocus, handleRestoreFocusOnPageChange } from './handle-cell-focus';

const isCtrlShift = (evt) => evt.shiftKey && (evt.ctrlKey || evt.metaKey);

export const updatePage = ({
  evt,
  totalRowSize,
  page,
  rowsPerPage,
  handleChangePage,
  setShouldRefocus,
  focusedCellCoord,
  setfocusedCellCoord,
  hasSelections,
  rootElement,
}) => {
  if (isCtrlShift(evt)) {
    const [, colIdx] = focusedCellCoord;
    const nextCoords = [0, hasSelections ? Math.max(0, colIdx) : 0];
    const lastPage = Math.ceil(totalRowSize / rowsPerPage) - 1;

    if (evt.key === 'ArrowRight' && page < lastPage) {
      setShouldRefocus();
      handleChangePage(null, page + 1);
      handleRestoreFocusOnPageChange({ rootElement, nextCoords, setfocusedCellCoord });
    } else if (evt.key === 'ArrowLeft' && page > 0) {
      setShouldRefocus();
      handleChangePage(null, page - 1);
      handleRestoreFocusOnPageChange({ rootElement, nextCoords, setfocusedCellCoord });
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

export const moveFocus = (evt, rootElement, cellCoord, selState, setfocusedCellCoord) => {
  preventDefaultBehavior(evt);
  removeCurrentFocus(evt);
  const rowAndColumnCount = getRowAndColumnCount(rootElement);
  const nextCellCoord = arrowKeysNavigation(evt, rowAndColumnCount, cellCoord, selState);
  updateFocus({ rowElements: rowAndColumnCount.rowElements, cellCoord: nextCellCoord });
  setfocusedCellCoord(nextCellCoord);
};

export const headHandleKeyPress = (
  evt,
  rootElement,
  cellCoord,
  changeSortOrder,
  layout,
  isDim,
  isAnalysisMode,
  setfocusedCellCoord
) => {
  switch (evt.key) {
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, false, setfocusedCellCoord);
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
  selState,
  cell,
  selDispatch,
  isAnalysisMode,
  setfocusedCellCoord
) => {
  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, selState, setfocusedCellCoord);
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
