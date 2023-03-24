import { Cell, Announce, Row } from '../../types';
import { SelectionState, SelectPayload, SelectionActionTypes } from '../types';
import { SelectionActions, SelectionStates, KeyCodes } from '../constants';
import { isShiftArrow } from './keyboard-utils';

/**
 * Gets the selection state of the given cell
 */
export const getCellSelectionState = (cell: Cell, selectionState: SelectionState): SelectionStates => {
  const { colIdx, rows, api } = selectionState;
  let cellState = SelectionStates.INACTIVE;
  if (api.isModal()) {
    if (colIdx !== cell.colIdx) {
      cellState = SelectionStates.EXCLUDED;
    } else if (rows[cell.qElemNumber] !== undefined) {
      cellState = SelectionStates.SELECTED;
    } else {
      cellState = SelectionStates.POSSIBLE;
    }
  }

  return cellState;
};

/**
 * Announces the change in selections
 */
export const announceSelectionStatus = (
  announce: Announce,
  oldRows: Record<string, number>,
  newRows: Record<string, number>
) => {
  const rowsLength = Object.keys(newRows).length;
  const isAddition = rowsLength >= Object.keys(oldRows).length;

  if (rowsLength) {
    const changeStatus = isAddition ? 'SNTable.SelectionLabel.SelectedValue' : 'SNTable.SelectionLabel.DeselectedValue';
    const amountStatus =
      rowsLength === 1
        ? 'SNTable.SelectionLabel.OneSelectedValue'
        : ['SNTable.SelectionLabel.SelectedValues', rowsLength.toString()];
    announce({ keys: [changeStatus, amountStatus] });
  } else {
    announce({ keys: ['SNTable.SelectionLabel.ExitedSelectionMode'] });
  }
};

/**
 * Get the updated selected rows for when (de)selecting one row
 */
export const getSelectedRows = (
  selectedRows: Record<string, number>,
  cell: Cell,
  evt: React.KeyboardEvent | React.MouseEvent
): Record<string, number> => {
  const { qElemNumber, rowIdx } = cell;

  if (evt.ctrlKey || evt.metaKey) {
    // if the ctrl key or the ⌘ Command key (On Macintosh keyboards)
    // or the ⊞ Windows key is pressed, get the last clicked
    // item (single select)
    return { [qElemNumber]: rowIdx };
  }

  if (selectedRows[qElemNumber] !== undefined) {
    // if the selected item is clicked again, that item will be removed
    delete selectedRows[qElemNumber];
  } else {
    // if an unselected item was clicked, add it to the object
    selectedRows[qElemNumber] = rowIdx;
  }

  return { ...selectedRows };
};

/**
 * Updates the selection state and calls the backend when (de)selecting one row
 */
const selectCell = (state: SelectionState, payload: SelectPayload): SelectionState => {
  const { api, rows, colIdx } = state;
  const { cell, announce, evt } = payload;
  let selectedRows: Record<string, number> = {};

  if (!api.isModal()) api.begin(['/qHyperCubeDef']);
  else if (colIdx === cell.colIdx) selectedRows = { ...rows };
  else return state;

  selectedRows = getSelectedRows(selectedRows, cell, evt);
  announceSelectionStatus(announce, rows, selectedRows);

  // only send a select call if there are rows selected, otherwise cancel selections
  if (Object.keys(selectedRows).length) {
    api.select({
      method: 'selectHyperCubeCells',
      params: ['/qHyperCubeDef', Object.values(selectedRows), [cell.colIdx]],
    });
    return { ...state, rows: selectedRows, colIdx: cell.colIdx };
  }

  api.cancel();
  return { ...state, rows: selectedRows, colIdx: -1 };
};

/**
 * Get the updated selected rows for when selecting multiple rows
 */
export const getMultiSelectedRows = (
  pageRows: Row[],
  selectedRows: Record<string, number>,
  cell: Cell,
  evt: React.KeyboardEvent | React.MouseEvent,
  firstCell?: Cell
): Record<string, number> => {
  const newSelectedRows = { ...selectedRows };

  if ('key' in evt && isShiftArrow(evt)) {
    newSelectedRows[cell.qElemNumber] = cell.rowIdx;
    // also add the next or previous cell to selectedRows, based on which arrow is pressed
    const idxShift = evt.key === KeyCodes.DOWN ? 1 : -1;
    const nextCell = pageRows[cell.pageRowIdx + idxShift][`col-${cell.pageColIdx}`] as Cell;
    newSelectedRows[nextCell.qElemNumber] = cell.rowIdx + idxShift;
    return newSelectedRows;
  }

  if (!firstCell) return selectedRows;
  const lowestRowIdx = Math.min(firstCell.pageRowIdx, cell.pageRowIdx);
  const highestRowIdx = Math.max(firstCell.pageRowIdx, cell.pageRowIdx);

  for (let idx = lowestRowIdx; idx <= highestRowIdx; idx++) {
    const selectedCell = pageRows[idx][`col-${firstCell.pageColIdx}`] as Cell;
    newSelectedRows[selectedCell.qElemNumber] = selectedCell.rowIdx;
  }

  return newSelectedRows;
};

/**
 * Updates the selection state but bot the backend when selecting multiple rows
 */
const selectMultipleCells = (state: SelectionState, payload: SelectPayload): SelectionState => {
  const { api, rows, pageRows, firstCell } = state;
  const { cell, announce, evt } = payload;
  let selectedRows: Record<string, number> = {};

  if (!firstCell && !('key' in evt && isShiftArrow(evt))) return state;

  if (!api.isModal()) api.begin(['/qHyperCubeDef']);
  else selectedRows = { ...rows };

  selectedRows = getMultiSelectedRows(pageRows, selectedRows, cell, evt, firstCell);
  announceSelectionStatus(announce, rows, selectedRows);

  return { ...state, rows: selectedRows, colIdx: firstCell?.colIdx ?? cell.colIdx, isSelectMultiValues: true };
};

/**
 * Initiates selecting multiple rows on mouse down
 */
const selectOnMouseDown = (
  state: SelectionState,
  { cell, mouseupCallback }: { cell: Cell; mouseupCallback(): void }
): SelectionState => {
  if (mouseupCallback && (!state.api.isModal() || state.colIdx === cell.colIdx)) {
    document.addEventListener('mouseup', mouseupCallback, { once: true });
    return {
      ...state,
      firstCell: cell,
      mouseupCallback,
    };
  }

  return state;
};

/**
 * Ends selecting multiple rows by calling backend, for both keyup (shift) and mouseup
 */
const endSelectMulti = (state: SelectionState): SelectionState => {
  const { api, rows, colIdx, isSelectMultiValues } = state;
  if (isSelectMultiValues) {
    api.select({
      method: 'selectHyperCubeCells',
      params: ['/qHyperCubeDef', Object.values(rows), [colIdx]],
    });
  }

  return { ...state, isSelectMultiValues: false, firstCell: undefined, mouseupCallback: undefined };
};

/**
 * Calls endSelectMulti with the state as it is if multiple are selected, otherwise runs selectCell and treats it as a click on single cell
 */
const selectOnMouseUp = (state: SelectionState, payload: SelectPayload) =>
  endSelectMulti(!state.isSelectMultiValues && state.firstCell === payload.cell ? selectCell(state, payload) : state);

export const reducer = (state: SelectionState, action: SelectionActionTypes): SelectionState => {
  switch (action.type) {
    case SelectionActions.SELECT:
      return selectCell(state, action.payload);
    case SelectionActions.SELECT_MOUSE_DOWN:
      return selectOnMouseDown(state, action.payload);
    case SelectionActions.SELECT_MOUSE_UP:
      return selectOnMouseUp(state, action.payload);
    case SelectionActions.SELECT_MULTI_ADD:
      return selectMultipleCells(state, action.payload);
    case SelectionActions.SELECT_MULTI_END:
      return endSelectMulti(state);
    case SelectionActions.RESET:
      return state.api.isModal() ? state : { ...state, rows: {}, colIdx: -1 };
    case SelectionActions.CLEAR:
      return Object.keys(state.rows).length ? { ...state, rows: {} } : state;
    case SelectionActions.UPDATE_PAGE_ROWS:
      return { ...state, pageRows: action.payload.pageRows };
    default:
      throw new Error('reducer called with invalid action type');
  }
};
