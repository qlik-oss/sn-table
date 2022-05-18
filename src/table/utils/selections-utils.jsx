export function addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef }) {
  const resetSelections = () => {
    selectionDispatch({ type: 'reset' });
  };
  const clearSelections = () => {
    selectionDispatch({ type: 'clear' });
  };
  const resetSelectionsAndSetupRefocus = () => {
    // if there is focus in the chart, set shouldRefocus so that you should either focus or just set the tabstop, after data has reloaded.
    // if there is no focus on the chart, make sure you blur and focus the entire chart
    if (tableWrapperRef.current?.contains(document.activeElement)) {
      setShouldRefocus();
    } else if (keyboard.enabled) {
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

export const getCellSelectionState = (cell, value) => {
  const {
    selectionState: { colIdx, rows, api },
  } = value;
  let state = 'inactive';
  if (api.isModal()) {
    if (colIdx !== cell.colIdx) {
      state = 'excluded';
    } else if (rows[cell.qElemNumber]) {
      state = 'selected';
    } else {
      state = 'possible';
    }
  }

  return state;
};

export const handleAnnounceSelectionStatus = ({ announce, rowsLength, isAddition }) => {
  if (rowsLength) {
    const changeStatus = isAddition ? 'SNTable.SelectionLabel.SelectedValue' : 'SNTable.SelectionLabel.DeselectedValue';
    const amountStatus =
      rowsLength === 1
        ? 'SNTable.SelectionLabel.OneSelectedValue'
        : ['SNTable.SelectionLabel.SelectedValues', rowsLength];
    announce({ keys: [changeStatus, amountStatus] });
  } else {
    announce({ keys: 'SNTable.SelectionLabel.ExitedSelectionMode' });
  }
};

export const getSelectedRows = ({ selectedRows, cell, evt }) => {
  const { qElemNumber, rowIdx } = cell;
  if (evt.ctrlKey || evt.metaKey) {
    // if the ctrl key or the ⌘ Command key (On Macintosh keyboards) or the ⊞ Windows key is pressed
    // get the last clicked item (single select)
    return { qElemNumber: rowIdx };
  }

  if (selectedRows[qElemNumber]) {
    // if the selected item is clicked again, that item will be removed
    delete selectedRows[qElemNumber];
  } else {
    // if an unselected item was clicked, add it to the object
    selectedRows[qElemNumber] = rowIdx;
  }

  return selectedRows;
};

const selectCell = (state, payload) => {
  const { cell, announce, evt } = payload;
  const { api, rows, colIdx } = state;

  let selectedRows = {};

  if (colIdx === -1) {
    api.begin('/qHyperCubeDef');
  } else if (colIdx === cell.colIdx) {
    selectedRows = { ...rows };
  } else {
    return state;
  }

  selectedRows = getSelectedRows({ selectedRows, cell, evt });
  const selectedRowsLength = Object.keys(selectedRows).length;
  handleAnnounceSelectionStatus({
    announce,
    rowsLength: selectedRowsLength,
    isAddition: selectedRowsLength > rows.length,
  });

  if (selectedRowsLength) {
    api.select({
      method: 'selectHyperCubeCells',
      params: ['/qHyperCubeDef', Object.values(selectedRows), [cell.colIdx]],
    });
  } else {
    api.cancel();
  }

  return { ...state, rows: selectedRows, colIdx: cell.colIdx };
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'select':
      return selectCell(state, action.payload);
    case 'reset':
      return state.api.isModal() ? state : { ...state, rows: {}, colIdx: -1 };
    case 'clear':
      return Object.keys(state.rows).length ? { ...state, rows: {} } : state;
    case 'set-enabled':
      return { ...state, isEnabled: action.payload.enabled };
    default:
      return state;
  }
};
