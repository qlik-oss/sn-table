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

export function selectCell(cell, selState, selDispatch) {
  const { api, rows } = selState;
  const { rowIdx, colIdx, qElemNumber } = cell;
  let newRows = [];

  if (!api.isActive()) {
    api.begin('/qHyperCubeDef');
  } else {
    newRows = rows.concat();
  }

  const alreadySelectedIdx = rows.findIndex((r) => r.qElemNumber === qElemNumber);
  if (alreadySelectedIdx > -1) {
    newRows.splice(alreadySelectedIdx, 1);
  } else {
    newRows.push({ qElemNumber, rowIdx });
  }

  if (newRows.length) {
    selDispatch({ type: 'select', payload: { rows: newRows, colIdx } });
    api.select({
      method: 'selectHyperCubeCells',
      params: ['/qHyperCubeDef', newRows.map((r) => r.rowIdx), [colIdx]],
    });
  } else {
    api.cancel();
  }
}
