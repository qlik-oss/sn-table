import { selectCell } from '../selections-utils';
import { updateFocus, focusConfirmButton } from './handle-cell-focus';

const isCtrlShift = (evt) => evt.shiftKey && (evt.ctrlKey || evt.metaKey);

export const preventDefaultBehavior = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
};

export const handleTableWrapperKeyDown = ({
  evt,
  totalRowSize,
  page,
  rowsPerPage,
  handleChangePage,
  setShouldRefocus,
  keyboard,
}) => {
  if (isCtrlShift(evt)) {
    const lastPage = Math.ceil(totalRowSize / rowsPerPage) - 1;

    if (evt.key === 'ArrowRight' && page < lastPage) {
      setShouldRefocus();
      handleChangePage(null, page + 1);
    } else if (evt.key === 'ArrowLeft' && page > 0) {
      setShouldRefocus();
      handleChangePage(null, page - 1);
    }
  } else if (evt.key === 'Escape' && keyboard.enabled) {
    preventDefaultBehavior(evt);
    keyboard.blur(true);
  }
};

export const arrowKeysNavigation = (evt, rowAndColumnCount, cellCoord, selState) => {
  let [nextRow, nextCol] = cellCoord;
  // check if you have unconfirmed selections, so one or more cells are selected but not confirmed yet.
  const isInSelectionMode = selState?.api?.isModal();

  switch (evt.key) {
    case 'ArrowDown':
      nextRow + 1 < rowAndColumnCount.rowCount && nextRow++;
      break;
    case 'ArrowUp':
      nextRow > 0 && (!isInSelectionMode || nextRow !== 1) && nextRow--;
      break;
    case 'ArrowRight':
      if (isInSelectionMode) break;
      if (nextCol < rowAndColumnCount.columnCount - 1) {
        nextCol++;
      } else if (nextRow < rowAndColumnCount.rowCount - 1) {
        nextRow++;
        nextCol = 0;
      }
      break;
    case 'ArrowLeft':
      if (isInSelectionMode) break;
      if (nextCol > 0) {
        nextCol--;
      } else if (nextRow > 0) {
        nextRow--;
        nextCol = rowAndColumnCount.columnCount - 1;
      }
      break;
    default:
      break;
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

export const moveFocus = (evt, rootElement, cellCoord, selState, setFocusedCellCoord) => {
  preventDefaultBehavior(evt);
  evt.target.setAttribute('tabIndex', '-1');
  const rowAndColumnCount = getRowAndColumnCount(rootElement);
  const nextCellCoord = arrowKeysNavigation(evt, rowAndColumnCount, cellCoord, selState);
  updateFocus({ focusType: 'focus', rowElements: rowAndColumnCount.rowElements, cellCoord: nextCellCoord });
  setFocusedCellCoord(nextCellCoord);
};

export const headHandleKeyPress = (
  evt,
  rootElement,
  cellCoord,
  changeSortOrder,
  layout,
  isDim,
  isAnalysisMode,
  setFocusedCellCoord
) => {
  switch (evt.key) {
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, false, setFocusedCellCoord);
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
  setFocusedCellCoord
) => {
  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, selState, setFocusedCellCoord);
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
    // Esc: Cancels selections. If no selections, do nothing and handleTableWrapperKeyDown should catch it
    case 'Escape': {
      if (!isAnalysisMode || !selState.api.isModal()) break;
      preventDefaultBehavior(evt);
      selState.api.cancel();
      break;
    }
    case 'Tab': {
      if (evt.shiftKey && selState.rows.length) {
        preventDefaultBehavior(evt);
        focusConfirmButton(rootElement);
      }
      break;
    }
    default:
      break;
  }
};
