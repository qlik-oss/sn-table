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

export function reducer(state, action) {
  const { isEnabled, cell, announce, evt } = action.payload || {};
  const { api, rows, colIdx } = state;

  switch (action.type) {
    case 'select': {
      const { rowIdx, qElemNumber } = cell;
      let selectedRows = [];

      if (colIdx === -1) {
        api.begin('/qHyperCubeDef');
      } else if (colIdx === cell.colIdx) {
        selectedRows = [...rows];
      } else {
        return state;
      }

      selectedRows = getSelectedRows({ selectedRows, qElemNumber, rowIdx, evt });
      handleAnnounceSelectionStatus({
        announce,
        rowsLength: selectedRows.length,
        isAddition: selectedRows.length > rows.length,
      });

      if (selectedRows.length) {
        api.select({
          method: 'selectHyperCubeCells',
          params: ['/qHyperCubeDef', selectedRows.map((r) => r.rowIdx), [cell.colIdx]],
        });
        return { ...state, rows: selectedRows, colIdx: cell.colIdx };
      }

      api.cancel();
      return state;
    }
    case 'reset':
      return api.isModal() ? state : { ...state, rows: [], colIdx: -1 };
    case 'clear':
      return rows.length ? { ...state, rows: [] } : state;
    case 'set-enabled':
      return { ...state, isEnabled };
    default:
      return state;
  }
}
