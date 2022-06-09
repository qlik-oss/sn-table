import { updateFocus, focusSelectionToolbar } from './handle-accessibility';

const isCtrlShift = (evt) => evt.shiftKey && (evt.ctrlKey || evt.metaKey);

export const preventDefaultBehavior = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
};

export const handleTableWrapperKeyDown = ({
  evt,
  totalVerticalCount,
  page,
  rowsPerPage,
  handleChangePage,
  setShouldRefocus,
  keyboard,
  isSelectionActive,
}) => {
  if (isCtrlShift(evt)) {
    preventDefaultBehavior(evt);
    // ctrl + shift + left/right arrow keys are used to go to previous/next page
    const lastPage = Math.ceil(totalVerticalCount / rowsPerPage) - 1;
    if (evt.key === 'ArrowRight' && page < lastPage) {
      setShouldRefocus();
      handleChangePage(page + 1);
    } else if (evt.key === 'ArrowLeft' && page > 0) {
      setShouldRefocus();
      handleChangePage(page - 1);
    }
  } else if (evt.key === 'Escape' && keyboard.enabled && !isSelectionActive) {
    preventDefaultBehavior(evt);
    keyboard.blur(true);
  }
};

export const arrowKeysNavigation = (evt, rowAndColumnCount, cellCoord, selectionState) => {
  let [nextRow, nextCol] = cellCoord;
  // check if you have unconfirmed selections, so one or more cells are selected but not confirmed yet.
  const isInSelectionMode = selectionState?.api?.isModal();

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

export const moveFocus = (evt, rootElement, cellCoord, setFocusedCellCoord, announce, isInSelectionMode) => {
  preventDefaultBehavior(evt);
  evt.target.setAttribute('tabIndex', '-1');
  const rowAndColumnCount = getRowAndColumnCount(rootElement);
  const nextCellCoord = arrowKeysNavigation(evt, rowAndColumnCount, cellCoord, isInSelectionMode);
  updateFocus({ focusType: 'focus', rowElements: rowAndColumnCount.rowElements, cellCoord: nextCellCoord });
  setFocusedCellCoord(nextCellCoord);

  // handle announce
  if (isInSelectionMode) {
    const cell =
      rowAndColumnCount.rowElements[nextCellCoord[0]]?.getElementsByClassName('sn-table-cell')[nextCellCoord[1]];
    const hasActiveClassName = cell.classList.contains('selected');
    hasActiveClassName
      ? announce({ keys: 'SNTable.SelectionLabel.SelectedValue' })
      : announce({ keys: 'SNTable.SelectionLabel.NotSelectedValue' });
  }
};

export const headHandleKeyPress = ({
  evt,
  rootElement,
  cellCoord,
  column,
  changeSortOrder,
  layout,
  isAnalysisMode,
  setFocusedCellCoord,
}) => {
  switch (evt.key) {
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft':
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord);
      break;
    // Space bar / Enter: update the sorting
    case ' ':
    case 'Enter':
      preventDefaultBehavior(evt);
      isAnalysisMode && changeSortOrder(layout, column);
      break;
    default:
      break;
  }
};

export const bodyHandleKeyPress = ({
  evt,
  rootElement,
  cellCoord,
  cell,
  selectionDispatch,
  isAnalysisMode,
  setFocusedCellCoord,
  announce,
  keyboard,
  selectionsAPI = null,
}) => {
  const isInSelectionMode = selectionsAPI?.isModal();

  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft':
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, announce, isInSelectionMode);
      break;
    // Space bar: Selects value.
    case ' ':
      preventDefaultBehavior(evt);
      cell.isSelectable && isAnalysisMode && selectionDispatch({ type: 'select', payload: { cell, evt, announce } });
      break;
    // Enter: Confirms selections.
    case 'Enter':
      preventDefaultBehavior(evt);
      if (!isInSelectionMode) break;
      selectionsAPI.confirm();
      announce({ keys: 'SNTable.SelectionLabel.SelectionsConfirmed' });
      break;
    // Esc: Cancels selections. If no selections, do nothing and handleTableWrapperKeyDown should catch it
    case 'Escape':
      if (!isAnalysisMode || !isInSelectionMode) break;
      preventDefaultBehavior(evt);
      selectionsAPI.cancel();
      announce({ keys: 'SNTable.SelectionLabel.ExitedSelectionMode' });
      break;
    // Tab: shift + tab, in selection mode and keyboard enabled, focus on selection toolbar
    case 'Tab':
      if (evt.shiftKey && keyboard.enabled && isInSelectionMode) {
        preventDefaultBehavior(evt);
        focusSelectionToolbar(evt.target, keyboard, true);
      }
      break;
    default:
      break;
  }
};

export const handleLastTab = (evt, isInSelectionMode, keyboard) => {
  if (isInSelectionMode && evt.key === 'Tab' && !evt.shiftKey) {
    preventDefaultBehavior(evt);
    focusSelectionToolbar(evt.target, keyboard, false);
  }
};
