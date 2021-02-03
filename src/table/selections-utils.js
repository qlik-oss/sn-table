export function addSelectionListeners(api, selDispatch) {
  const resetSelections = () => {
    selDispatch({ type: 'reset' });
  };

  if (!api) {
    return () => {};
  }

  // selections.api = api;
  api.on('deactivated', resetSelections);
  api.on('canceled', resetSelections);
  api.on('confirmed', resetSelections);
  api.on('cleared', resetSelections);
  // Return function called on unmount
  return () => {
    api.removeListener('deactivated', resetSelections);
    api.removeListener('canceled', resetSelections);
    api.removeListener('confirmed', resetSelections);
    api.removeListener('cleared', resetSelections);
  };
}

export function getSelectionClass(cell, selState) {
  const { colIdx, rows } = selState;

  if (rows.length) {
    if (colIdx !== cell.colIdx) return 'excluded';

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].qElemNumber === cell.qElemNumber) return 'selected';
    }
  }

  return 'possible';
}

export function reducer(state, action) {
  switch (action.type) {
    case 'select':
      return { ...state, rows: action.payload.selectedRows, colIdx: action.payload.colIdx };
    case 'reset':
      return state.rows.length ? { ...state, rows: [], colIdx: -1 } : state;
    default:
      throw new Error('reducer called with invalid action type');
  }
}

export const getSelectedRows = (selectedRows, qElemNumber, rowIdx, rows, evt) => {
  const alreadySelectedIdx = rows.findIndex((r) => r.qElemNumber === qElemNumber);
  if (evt.ctrlKey || evt.metaKey) {
    // if the ctrl key or the ⌘ Command key (On Macintosh keyboards) or the ⊞ Windows key is pressed
    // get the last clicked item
    return [{ qElemNumber, rowIdx }];
  }

  if (alreadySelectedIdx > -1) {
    // if the selected item is clicked again, that item will be removed
    selectedRows.splice(alreadySelectedIdx, 1);
    return selectedRows;
  }

  // if an item was clicked, the item was selected
  selectedRows.push({ qElemNumber, rowIdx });
  return selectedRows;
};

export function selectCell(cell, selState, selDispatch, evt) {
  const { api, rows } = selState;
  const { rowIdx, colIdx, qElemNumber } = cell;
  let selectedRows = [];

  if (!api.isActive()) {
    api.begin('/qHyperCubeDef');
  } else {
    selectedRows = rows.concat();
  }

  selectedRows = getSelectedRows(selectedRows, qElemNumber, rowIdx, rows, evt);

  if (selectedRows.length) {
    window.console.log(selectedRows, 'selectedRows');
    selDispatch({ type: 'select', payload: { selectedRows, colIdx } });
    api.select({
      method: 'selectHyperCubeCells',
      params: ['/qHyperCubeDef', selectedRows.map((r) => r.rowIdx), [colIdx]],
    });
  } else {
    api.cancel();
  }
}
