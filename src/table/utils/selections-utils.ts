import { stardust } from '@nebula.js/stardust';
import React, { ReactFragment } from 'react';
import {
  TableCell,
  SelectionState,
  Action,
  ExtendedSelectionAPI,
  ActionPayload,
  AnnounceFn,
  SelectedRows,
  ContextValue,
} from '../../types';

// eslint-disable-next-line no-shadow
export enum SelectionStates {
  SELECTED = 'selected',
  POSSIBLE = 'possible',
  EXCLUDED = 'excluded',
  INACTIVE = 'inactive',
}

type AddSelectionListenersArgs = {
  api: ExtendedSelectionAPI;
  selectionDispatch: React.Dispatch<Action>;
  setShouldRefocus(): void;
  keyboard: stardust.Keyboard;
  tableWrapperRef: React.MutableRefObject<JSX.Element>;
};

export function addSelectionListeners({
  api,
  selectionDispatch,
  setShouldRefocus,
  keyboard,
  tableWrapperRef,
}: AddSelectionListenersArgs) {
  const resetSelections = () => {
    selectionDispatch({ type: 'reset' });
  };
  const clearSelections = () => {
    selectionDispatch({ type: 'clear' });
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
      // TODO: fix nebula api so that blur has the correct argument type
      // @ts-ignore
      keyboard.blur?.(true);
    }
    resetSelections();
  };

  if (!api) {
    return undefined;
  }

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

export const getCellSelectionState = (cell: TableCell, value: ContextValue): SelectionStates => {
  const {
    selectionState: { colIdx, rows, api },
  } = value;
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

export const handleAnnounceSelectionStatus = (announce: AnnounceFn, rowsLength: number, isAddition: boolean) => {
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

export const getSelectedRows = (
  selectedRows: SelectedRows,
  cell: TableCell,
  evt: React.KeyboardEvent | React.MouseEvent
): SelectedRows => {
  const { qElemNumber, rowIdx } = cell;

  if (evt.ctrlKey || evt.metaKey) {
    // if the ctrl key or the ⌘ Command key (On Macintosh keyboards)
    // or the ⊞ Windows key is pressed, get the last clicked
    // item (single select)
    return { [qElemNumber]: rowIdx };
  }

  const key = (evt as React.KeyboardEvent)?.key;
  if (evt.shiftKey && key.includes('Arrow')) {
    selectedRows[qElemNumber] = rowIdx;
    // add the next or previous cell to selectedRows, based on which arrow is pressed
    selectedRows[key === 'ArrowDown' ? cell.nextQElemNumber : cell.prevQElemNumber] =
      key === 'ArrowDown' ? rowIdx + 1 : rowIdx - 1;
  } else if (selectedRows[qElemNumber] !== undefined) {
    // if the selected item is clicked again, that item will be removed
    delete selectedRows[qElemNumber];
  } else {
    // if an unselected item was clicked, add it to the object
    selectedRows[qElemNumber] = rowIdx;
  }

  return { ...selectedRows };
};

const selectCell = (state: SelectionState, payload: ActionPayload) => {
  const { api, rows, colIdx } = state;
  const { cell, announce, evt } = payload;
  const isSelectMultiValues = evt.shiftKey && (evt as React.KeyboardEvent)?.key.includes('Arrow');
  let selectedRows: SelectedRows = {};

  if (colIdx === -1) api.begin(['/qHyperCubeDef']);
  else if (colIdx === cell.colIdx) selectedRows = { ...rows };
  else return state;

  selectedRows = getSelectedRows(selectedRows, cell, evt);
  const selectedRowsLength = Object.keys(selectedRows).length;
  const isAddition = selectedRowsLength >= Object.keys(rows).length;
  handleAnnounceSelectionStatus(announce, selectedRowsLength, isAddition);

  if (selectedRowsLength) {
    !isSelectMultiValues &&
      api.select({
        method: 'selectHyperCubeCells',
        params: ['/qHyperCubeDef', Object.values(selectedRows), [cell.colIdx]],
      });
    return { ...state, rows: selectedRows, colIdx: cell.colIdx, isSelectMultiValues };
  }

  api.cancel();
  return { ...state, rows: selectedRows, colIdx: -1, isSelectMultiValues };
};

const selectMultiValues = (state: SelectionState) => {
  const { api, rows, colIdx, isSelectMultiValues } = state;

  isSelectMultiValues &&
    api.select({
      method: 'selectHyperCubeCells',
      params: ['/qHyperCubeDef', Object.values(rows), [colIdx]],
    });

  return { ...state, isSelectMultiValues: false };
};

export const reducer = (state: SelectionState, action: Action): SelectionState => {
  switch (action.type) {
    case 'select':
      return selectCell(state, action.payload as ActionPayload);
    case 'selectMultiValues':
      return selectMultiValues(state);
    case 'reset':
      return state.api.isModal() ? state : { ...state, rows: {}, colIdx: -1 };
    case 'clear':
      return Object.keys(state.rows).length ? { ...state, rows: {} } : state;
    default:
      throw new Error('reducer called with invalid action type');
  }
};
