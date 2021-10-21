export function addSelectionListeners({ api, selDispatch, setShouldRefocus, keyboard, tableWrapperRef }) {
  const resetSelections = () => {
    selDispatch({ type: 'reset' });
  };
  const clearSelections = () => {
    selDispatch({ type: 'clear' });
  };
  const resetSelectionsAndSetupRefocus = () => {
    // if there is focus in the chart, set shouldRefocus so that we should either focus or just set the tabstop, after data has reloaded.
    // if there is no focus on the chart, make sure we blur and focus the entire chart
    if (tableWrapperRef.current?.contains(document.activeElement)) {
      setShouldRefocus();
    } else {
      keyboard.blur(true);
    }
    resetSelections();
  };

  if (!api) {
    return () => {};
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

export function reducer(state, action) {
  const { rows, colIdx, isEnabled } = action.payload || {};

  switch (action.type) {
    case 'select':
      return { ...state, rows, colIdx };
    case 'reset':
      return state.api.isModal() ? state : { ...state, rows: [], colIdx: -1 };
    case 'clear':
      return state.rows.length ? { ...state, rows: [] } : state;
    case 'set-enabled':
      return { ...state, isEnabled };
    default:
      throw new Error('reducer called with invalid action type');
  }
}

export const getSelNote = (rows) => {
  return rows.length === 1
    ? 'SNTable.SelectionLabel.OneSelectedValue'
    : ['SNTable.SelectionLabel.SelectedValues', rows.length];
};

export const handleAnnounceSelectionStatus = ({ announce, selectedRows, isAddition }) => {
  if (isAddition) {
    announce({ keys: ['SNTable.SelectionLabel.SelectedValue', getSelNote(selectedRows)] });
  } else if (selectedRows.length > 1) {
    announce({ keys: ['SNTable.SelectionLabel.DeselectedValue', getSelNote(selectedRows)] });
  } else {
    announce({ keys: 'SNTable.SelectionLabel.ExitedSelectionMode' });
  }
};

export const getSelectedRows = ({ selectedRows, qElemNumber, rowIdx, evt }) => {
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

export function selectCell({ selectionState, cell, selDispatch, evt, announce }) {
  const { api, rows } = selectionState;
  const { rowIdx, colIdx, qElemNumber } = cell;
  let selectedRows = [];

  if (selectionState.colIdx === -1) {
    api.begin('/qHyperCubeDef');
  } else if (selectionState.colIdx === colIdx) {
    selectedRows = rows.concat();
  } else {
    return;
  }

  selectedRows = getSelectedRows({ selectedRows, qElemNumber, rowIdx, evt });
  handleAnnounceSelectionStatus({ announce, selectedRows, isAddition: selectedRows.length > rows.length });

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
