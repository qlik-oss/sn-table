import { updateFocus, focusSelectionToolbar, getCellElement, announceSelectionState } from './handle-accessibility';
import { SelectionActions } from './selections-utils';
import { handleNavigateTop } from './handle-scroll';

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

export const arrowKeysNavigation = (evt, rowAndColumnCount, cellCoord, topAllowedRow = 0) => {
  let [nextRow, nextCol] = cellCoord;

  switch (evt.key) {
    case 'ArrowDown':
      nextRow < rowAndColumnCount.rowCount - 1 && nextRow++;
      break;
    case 'ArrowUp':
      nextRow > topAllowedRow && nextRow--;
      break;
    case 'ArrowRight':
      // topAllowedRow greater than 0 means we are in selection mode
      if (topAllowedRow > 0) break;
      if (nextCol < rowAndColumnCount.columnCount - 1) {
        nextCol++;
      } else if (nextRow < rowAndColumnCount.rowCount - 1) {
        nextRow++;
        nextCol = 0;
      }
      break;
    case 'ArrowLeft':
      // topAllowedRow greater than 0 means we are in selection mode
      if (topAllowedRow > 0) break;
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

export const moveFocus = (evt, rootElement, cellCoord, setFocusedCellCoord, topAllowedRow) => {
  preventDefaultBehavior(evt);
  evt.target.setAttribute('tabIndex', '-1');
  const rowAndColumnCount = getRowAndColumnCount(rootElement);
  const nextCellCoord = arrowKeysNavigation(evt, rowAndColumnCount, cellCoord, topAllowedRow);
  const nextCell = getCellElement(rootElement, nextCellCoord);
  updateFocus({ focusType: 'focus', cell: nextCell });
  setFocusedCellCoord(nextCellCoord);

  return nextCell;
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
  cell,
  selectionDispatch,
  isSelectionsEnabled,
  setFocusedCellCoord,
  announce,
  keyboard,
  paginationNeeded,
  totalsPosition,
  selectionsAPI,
}) => {
  const isSelectionMode = selectionsAPI.isModal();
  // Adjust the cellCoord depending on the totals position
  const firstBodyRowIdx = totalsPosition === 'top' ? 2 : 1;
  const cellCoord = [cell.rawRowIdx + firstBodyRowIdx, cell.rawColIdx];
  // Make sure you can't navigate to header (and totals) in selection mode
  const topAllowedRow = isSelectionMode ? firstBodyRowIdx : 0;

  switch (evt.key) {
    case 'ArrowUp':
    case 'ArrowDown': {
      evt.key === 'ArrowUp' && handleNavigateTop([cell.rawRowIdx, cell.rawColIdx], rootElement);
      const nextCell = moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, topAllowedRow);
      // Shift + up/down arrow keys: select multiple values
      // When at the first/last row of the cell, shift + arrow up/down key, no value is selected
      const isSelectMultiValues =
        evt.shiftKey &&
        cell.isSelectable &&
        isSelectionsEnabled &&
        ((cell.prevQElemNumber !== undefined && evt.key === 'ArrowUp') ||
          (cell.nextQElemNumber !== undefined && evt.key === 'ArrowDown'));
      if (isSelectMultiValues) {
        selectionDispatch({
          type: SelectionActions.SELECT,
          payload: { cell, evt, announce },
        });
      } else {
        // When not selecting multiple we need to announce the selection state of the cell
        announceSelectionState(announce, nextCell, isSelectionMode);
      }
      break;
    }
    case 'ArrowRight':
    case 'ArrowLeft':
      !isCtrlShift(evt) && moveFocus(evt, rootElement, cellCoord, setFocusedCellCoord, topAllowedRow);
      break;
    // Space bar: Selects value.
    case ' ':
      preventDefaultBehavior(evt);
      cell.isSelectable &&
        isSelectionsEnabled &&
        selectionDispatch({ type: SelectionActions.SELECT, payload: { cell, evt, announce } });
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
  evt.key === 'Shift' && selectionDispatch({ type: SelectionActions.SELECT_MULTI_VALUES });
};

export const handleLastTab = (evt, isSelectionMode, keyboard) => {
  if (isSelectionMode && evt.key === 'Tab' && !evt.shiftKey) {
    // tab key: focus on the selection toolbar
    preventDefaultBehavior(evt);
    focusSelectionToolbar(evt.target, keyboard, false);
  }
};
