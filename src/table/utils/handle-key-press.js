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
  isSortingEnabled,
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
      isSortingEnabled && changeSortOrder(layout, column);
      break;
    default:
      break;
  }
};

/**
 * Handle totals row key press
 *
 * @param {event} evt
 * @param {Object} rootElement
 * @param {Array} cellCoord
 * @param {Function} setFocusedCellCoord
 */
export const totalHandleKeyPress = (evt, rootElement, cellCoord, setFocusedCellCoord) => {
  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft': {
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord);
      break;
    }
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
  isSelectionsEnabled,
  setFocusedCellCoord,
  announce,
  keyboard,
  paginationNeeded,
  selectionsAPI = null,
}) => {
  const isSelectionMode = selectionsAPI?.isModal();

  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown': {
      const isSelectMultiValues =
        evt.shiftKey &&
        cell.isSelectable &&
        isSelectionsEnabled &&
        ((cell.prevQElemNumber !== undefined && evt.key === 'ArrowUp') ||
          (cell.nextQElemNumber !== undefined && evt.key === 'ArrowDown'));
      // Shift + up/down arrow keys: select multiple values
      // When at the first/last row of the cell, shift + arrow up/down key, no value is selected
      moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, announce, isSelectionMode, !isSelectMultiValues);
      isSelectMultiValues &&
        selectionDispatch({
          type: 'select',
          payload: { cell, evt, announce },
        });
      break;
    }
    case 'ArrowRight':
    case 'ArrowLeft':
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, announce, isSelectionMode);
      break;
    // Space bar: Selects value.
    case ' ':
      preventDefaultBehavior(evt);
      cell.isSelectable &&
        isSelectionsEnabled &&
        selectionDispatch({ type: 'select', payload: { cell, evt, announce } });
      break;
    // Enter: Confirms selections.
    case 'Enter':
      preventDefaultBehavior(evt);
      if (isSelectionMode) {
        selectionsAPI.confirm();
        announce({ keys: ['SNTable.SelectionLabel.SelectionsConfirmed'] });
      }
      break;
    // Esc: Cancels selections. If no selections, do nothing and handleTableWrapperKeyDown should catch it
    case 'Escape':
      if (isSelectionMode) {
        preventDefaultBehavior(evt);
        selectionsAPI.cancel();
        announce({ keys: ['SNTable.SelectionLabel.ExitedSelectionMode'] });
      }
      break;
    // Tab (+ shift): in selection mode and keyboard enabled, focus on selection toolbar
    case 'Tab':
      if (keyboard.enabled && isSelectionMode) {
        if (evt.shiftKey) {
          preventDefaultBehavior(evt);
          focusSelectionToolbar(evt.target, keyboard, true);
        } else if (!paginationNeeded) {
          // Tab only: when there are no pagination controls, go tab straight to selection toolbar
          preventDefaultBehavior(evt);
          focusSelectionToolbar(evt.target, keyboard, false);
        }
      }
      break;
    default:
      break;
  }
};

export const bodyHandleKeyUp = (evt, selectionDispatch) => {
  evt.key === 'Shift' && selectionDispatch({ type: 'selectMultiValues' });
};

export const handleLastTab = (evt, isSelectionMode, keyboard) => {
  if (isSelectionMode && evt.key === 'Tab' && !evt.shiftKey) {
    // tab key: focus on the selection toolbar
    preventDefaultBehavior(evt);
    focusSelectionToolbar(evt.target, keyboard, false);
  }
};
