import { stardust } from '@nebula.js/stardust';
import { Cell, ExtendedSelectionAPI, Announce, Row } from '../../types';
import { SelectionState, ActionPayload, SelectionActionTypes } from '../types';
import { SelectionActions, SelectionStates, KeyCodes } from '../constants';

interface AddSelectionListenersArgs {
  api: ExtendedSelectionAPI;
  selectionDispatch: React.Dispatch<SelectionActionTypes>;
  setShouldRefocus(): void;
  keyboard: stardust.Keyboard;
  tableWrapperRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

export function addSelectionListeners({
  api,
  selectionDispatch,
  setShouldRefocus,
  keyboard,
  tableWrapperRef,
}: AddSelectionListenersArgs) {
  const resetSelections = () => {
    selectionDispatch({ type: SelectionActions.RESET });
  };
  const clearSelections = () => {
    selectionDispatch({ type: SelectionActions.CLEAR });
  };
  const resetSelectionsAndSetupRefocus = () => {
    if (tableWrapperRef.current?.contains(document.activeElement)) {
      // if there is a focus in the chart,
      // set shouldRefocus so that you should either
      // focus or just set the tabstop, after data has reloaded.
      setShouldRefocus();
    } else if (keyboard.enabled) {
      // if there is no focus on the chart,
      // make sure you blur the table
      // and focus the entire chart (table's parent element)
      // @ts-ignore TODO: fix nebula api so that blur has the correct argument type
      keyboard.blur?.(true);
    }
    resetSelections();
  };

  api.on('deactivated', resetSelections);
  api.on('canceled', resetSelections);
  api.on('confirmed', resetSelectionsAndSetupRefocus);
  api.on('cleared', clearSelections);
  // Return function called on unmount
  return () => {
    api.removeListener('deactivated', resetSelections);
    api.removeListener('canceled', resetSelections);
    api.removeListener('confirmed', resetSelectionsAndSetupRefocus);
    api.removeListener('cleared', clearSelections);
  };
}

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

const isShiftArrow = (evt: React.KeyboardEvent) => evt.shiftKey && evt.key.includes('Arrow');

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

export const getMultiSelectedRows = (
  allRows: Row[],
  selectedRows: Record<string, number>,
  cell: Cell,
  evt: React.KeyboardEvent | React.MouseEvent,
  firstCell?: Cell
): Record<string, number> => {
  const newSelectedRows = { ...selectedRows };

  if ('key' in evt && isShiftArrow(evt)) {
    newSelectedRows[cell.qElemNumber] = cell.rowIdx;
    // add the next or previous cell to selectedRows, based on which arrow is pressed
    if (evt.key === KeyCodes.DOWN) {
      newSelectedRows[cell.nextQElemNumber as number] = cell.rowIdx + 1;
    } else {
      newSelectedRows[cell.prevQElemNumber as number] = cell.rowIdx - 1;
    }
    return newSelectedRows;
  }

  if (!firstCell) return selectedRows;
  const lowestCellIdx = Math.min(firstCell.rawRowIdx, cell.rawRowIdx);
  const highestCellIdx = Math.max(firstCell.rawRowIdx, cell.rawRowIdx);

  for (let idx = lowestCellIdx; idx <= highestCellIdx; idx++) {
    const selectedCell = allRows[idx][`col-${firstCell.rawColIdx}`] as Cell;
    newSelectedRows[selectedCell.qElemNumber] = selectedCell.rowIdx;
  }

  return newSelectedRows;
};

const selectCell = (state: SelectionState, payload: ActionPayload): SelectionState => {
  const { api, rows, colIdx } = state;
  const { cell, announce, evt } = payload;
  let selectedRows: Record<string, number> = {};

  if (colIdx === -1) api.begin(['/qHyperCubeDef']);
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

const selectMultipleCells = (state: SelectionState, payload: ActionPayload): SelectionState => {
  const { api, rows, colIdx, allRows, firstCell, isSelectMultiValues } = state;
  const { cell, announce, evt } = payload;
  let selectedRows: Record<string, number> = {};

  if (!isSelectMultiValues && 'key' in evt && !isShiftArrow(evt)) return state;

  if (colIdx === -1) api.begin(['/qHyperCubeDef']);
  else selectedRows = { ...rows };

  selectedRows = getMultiSelectedRows(allRows, selectedRows, cell, evt, firstCell);
  announceSelectionStatus(announce, rows, selectedRows);

  return { ...state, rows: selectedRows, colIdx: firstCell?.colIdx || cell.colIdx, isSelectMultiValues: true };
};

const startSelectMulti = (state: SelectionState, cell: Cell): SelectionState => {
  if (state.colIdx === -1 || state.colIdx === cell.colIdx) {
    return {
      ...state,
      isSelectMultiValues: true,
      firstCell: cell,
    };
  }

  return state;
};

const endSelectMulti = (state: SelectionState): SelectionState => {
  const { api, rows, colIdx, isSelectMultiValues } = state;

  isSelectMultiValues &&
    api.select({
      method: 'selectHyperCubeCells',
      params: ['/qHyperCubeDef', Object.values(rows), [colIdx]],
    });

  return { ...state, isSelectMultiValues: false, firstCell: undefined };
};

export const reducer = (state: SelectionState, action: SelectionActionTypes): SelectionState => {
  switch (action.type) {
    case SelectionActions.SELECT:
      return selectCell(state, action.payload);
    case SelectionActions.SELECT_MULTI_START:
      return startSelectMulti(state, action.payload.cell);
    case SelectionActions.SELECT_MULTI_ADD:
      return selectMultipleCells(state, action.payload);
    case SelectionActions.SELECT_MULTI_END:
      return endSelectMulti(state);
    case SelectionActions.RESET:
      return state.api.isModal() ? state : { ...state, rows: {}, colIdx: -1 };
    case SelectionActions.CLEAR:
      return Object.keys(state.rows).length ? { ...state, rows: {} } : state;
    case SelectionActions.UPDATE_ALL_ROWS:
      return { ...state, allRows: action.payload.allRows };
    default:
      throw new Error('reducer called with invalid action type');
  }
};
