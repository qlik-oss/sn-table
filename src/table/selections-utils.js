export function addSelectionListeners(api, selDispatch, setShouldRefocus) {
  const resetSelections = () => {
    selDispatch({ type: 'reset' });
  };
  const resetSelectionsAndSetupRefocus = () => {
    setShouldRefocus();
    resetSelections();
  };

  if (!api) {
    return () => {};
  }

  api.on('deactivated', resetSelections);
  api.on('canceled', resetSelections);
  api.on('confirmed', resetSelectionsAndSetupRefocus);
  api.on('cleared', resetSelections);
  // Return function called on unmount
  return () => {
    api.removeListener('deactivated', resetSelections);
    api.removeListener('canceled', resetSelections);
    api.removeListener('confirmed', resetSelectionsAndSetupRefocus);
    api.removeListener('cleared', resetSelections);
  };
}

export function reducer(state, action) {
  const { rows, colIdx, isEnabled } = action.payload || {};

  switch (action.type) {
    case 'select':
      return { ...state, rows, colIdx };
    case 'reset':
      return state.rows.length ? { ...state, rows: [], colIdx: -1 } : state;
    case 'set-enabled':
      return { ...state, isEnabled };
    default:
      throw new Error('reducer called with invalid action type');
  }
}

export const getSelectedRows = (selectedRows, qElemNumber, rowIdx, evt) => {
  if (evt.ctrlKey || evt.metaKey) {
    // if the ctrl key or the ⌘ Command key (On Macintosh keyboards) or the ⊞ Windows key is pressed
    // get the last clicked item
    return [{ qElemNumber, rowIdx }];
  }

  const alreadySelectedIdx = selectedRows.findIndex((r) => r.qElemNumber === qElemNumber);
  if (alreadySelectedIdx > -1) {
    // if the selected item is clicked again, that item will be removed
    selectedRows.splice(alreadySelectedIdx, 1);
    return selectedRows;
  }

  // if an item was clicked, the item was selected
  selectedRows.push({ qElemNumber, rowIdx });
  return selectedRows;
};

export function selectCell(selState, cell, selDispatch, evt) {
  const { api, rows } = selState;
  const { rowIdx, colIdx, qElemNumber } = cell;
  let selectedRows = [];

  if (selState.colIdx === -1) {
    api.begin('/qHyperCubeDef');
  } else if (selState.colIdx === colIdx) {
    selectedRows = rows.concat();
  } else {
    return;
  }

  selectedRows = getSelectedRows(selectedRows, qElemNumber, rowIdx, evt);

  if (selectedRows.length) {
    selDispatch({ type: 'select', payload: { rows: selectedRows, colIdx } });
    api.select({
      method: 'selectHyperCubeCells',
      params: ['/qHyperCubeDef', selectedRows.map((r) => r.rowIdx), [colIdx]],
    });
  } else {
    api.cancel();
  }
}
