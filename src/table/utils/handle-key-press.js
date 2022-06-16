import { updateFocus, focusSelectionToolbar, getCellElement } from './handle-accessibility';

const isCtrlShift = (evt) => evt.shiftKey && (evt.ctrlKey || evt.metaKey);

export const preventDefaultBehavior = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
};

export const handleTableWrapperKeyDown = ({
  evt,
  totalRowCount,
  page,
  rowsPerPage,
  handleChangePage,
  setShouldRefocus,
  keyboard,
  isSelectionMode,
}) => {
  if (isCtrlShift(evt)) {
    preventDefaultBehavior(evt);
    // ctrl + shift + left/right arrow keys: go to previous/next page
    const lastPage = Math.ceil(totalRowCount / rowsPerPage) - 1;
    if (evt.key === 'ArrowRight' && page < lastPage) {
      setShouldRefocus();
      handleChangePage(page + 1);
    } else if (evt.key === 'ArrowLeft' && page > 0) {
      setShouldRefocus();
      handleChangePage(page - 1);
    }
  } else if (evt.key === 'Escape' && keyboard.enabled && !isSelectionMode) {
    // escape key: tell Nebula to relinquish the table's focus to
    // its parent element when nebula handles keyboard navigation
    // and not in selection mode
    preventDefaultBehavior(evt);
    keyboard.blur(true);
  }
};

export const arrowKeysNavigation = (evt, rowAndColumnCount, cellCoord, isSelectionMode) => {
  let [nextRow, nextCol] = cellCoord;

  switch (evt.key) {
    case 'ArrowDown':
      nextRow + 1 < rowAndColumnCount.rowCount && nextRow++;
      break;
    case 'ArrowUp':
      nextRow > 0 && (!isSelectionMode || nextRow !== 1) && nextRow--;
      break;
    case 'ArrowRight':
      if (isSelectionMode) break;
      if (nextCol < rowAndColumnCount.columnCount - 1) {
        nextCol++;
      } else if (nextRow < rowAndColumnCount.rowCount - 1) {
        nextRow++;
        nextCol = 0;
      }
      break;
    case 'ArrowLeft':
      if (isSelectionMode) break;
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
  const rowCount = rootElement.getElementsByClassName('sn-table-row').length;
  const columnCount = rootElement.getElementsByClassName('sn-table-head-cell').length;

  return { rowCount, columnCount };
};

export const moveFocus = (
  evt,
  rootElement,
  cellCoord,
  setFocusedCellCoord,
  announce,
  isSelectionMode,
  shouldAnnounce = true
) => {
  preventDefaultBehavior(evt);
  evt.target.setAttribute('tabIndex', '-1');
  const rowAndColumnCount = getRowAndColumnCount(rootElement);
  const nextCellCoord = arrowKeysNavigation(evt, rowAndColumnCount, cellCoord, isSelectionMode);
  const nextCell = getCellElement(rootElement, nextCellCoord);
  updateFocus({ focusType: 'focus', cell: nextCell });
  setFocusedCellCoord(nextCellCoord);

  // handle announcement
  if (isSelectionMode && shouldAnnounce) {
    const hasActiveClassName = nextCell.classList.contains('selected');
    hasActiveClassName
      ? announce({ keys: ['SNTable.SelectionLabel.SelectedValue'] })
      : announce({ keys: ['SNTable.SelectionLabel.NotSelectedValue'] });
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

const isMultiValueSelections = (evt, cell, isAnalysisMode) =>
  evt.shiftKey &&
  cell.isSelectable &&
  isAnalysisMode &&
  ((cell.prevQElemNumber !== undefined && evt.key === 'ArrowUp') ||
    (cell.nextQElemNumber !== undefined && evt.key === 'ArrowDown'));

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
  const isSelectionMode = selectionsAPI?.isModal();

  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      // Shift + up/down arrow keys: select multiple values
      // When at the first/last row of the cell, shift + arrow up/down key, no value is selected
      moveFocus(
        evt,
        rootElement,
        cellCoord,
        setFocusedCellCoord,
        announce,
        isSelectionMode,
        !isMultiValueSelections(evt, cell, isAnalysisMode)
      );
      isMultiValueSelections(evt, cell, isAnalysisMode) &&
        selectionDispatch({ type: 'select', payload: { cell, evt, announce } });
      break;
    case 'ArrowRight':
    case 'ArrowLeft':
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, announce, isSelectionMode);
      break;
    // Space bar: Selects value.
    case ' ':
      preventDefaultBehavior(evt);
      cell.isSelectable && isAnalysisMode && selectionDispatch({ type: 'select', payload: { cell, evt, announce } });
      break;
    // Enter: Confirms selections.
    case 'Enter':
      preventDefaultBehavior(evt);
      if (!isSelectionMode) break;
      selectionsAPI.confirm();
      announce({ keys: ['SNTable.SelectionLabel.SelectionsConfirmed'] });
      break;
    // Esc: Cancels selections. If no selections, do nothing and handleTableWrapperKeyDown should catch it
    case 'Escape':
      if (!isAnalysisMode || !isSelectionMode) break;
      preventDefaultBehavior(evt);
      selectionsAPI.cancel();
      announce({ keys: ['SNTable.SelectionLabel.ExitedSelectionMode'] });
      break;
    // Tab: shift + tab, in selection mode and keyboard enabled, focus on selection toolbar
    case 'Tab':
      if (evt.shiftKey && keyboard.enabled && isSelectionMode) {
        preventDefaultBehavior(evt);
        focusSelectionToolbar(evt.target, keyboard, true);
      }
      break;
    default:
      break;
  }
};

// export const bodyHandleKeyUp = ({ evt }) => {
//   if (evt.shiftKey) {
//   }
// };

export const handleLastTab = (evt, isSelectionMode, keyboard) => {
  if (isSelectionMode && evt.key === 'Tab' && !evt.shiftKey) {
    // tab key: focus on the confirm button in the selection toolbar
    preventDefaultBehavior(evt);
    focusSelectionToolbar(evt.target, keyboard, false);
  }
};
