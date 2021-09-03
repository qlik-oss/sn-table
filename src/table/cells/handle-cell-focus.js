export const updateFocus = (rowElements, cellCoord, shouldFocus = true) => {
  const cell = rowElements[cellCoord[0]]?.getElementsByClassName('sn-table-cell')[cellCoord[1]];
  if (cell) {
    if (shouldFocus) {
      cell.focus();
      cell.setAttribute('tabIndex', '0');
    } else {
      cell.blur();
      cell.setAttribute('tabIndex', '-1');
    }
  }
};

export const handleClickToFocusBody = (cell, focusedCellCoord, rootElement) => {
  const { rawRowIdx, rawColIdx } = cell;
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus(rowElements, focusedCellCoord, false);
  updateFocus(rowElements, [rawRowIdx + 1, rawColIdx], false);
};

export const handleClickToFocusHead = (columnIndex, focusedCellCoord, rootElement) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus(rowElements, focusedCellCoord, false);
  updateFocus(rowElements, [0, columnIndex], false);
};

export const handleResetFocus = ({
  focusedCellCoordsState,
  rootElement,
  shouldRefocus,
  hasSelections,
  setFocusedCellCoordsState,
}) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus(rowElements, focusedCellCoordsState, false);

  // If we have selections ongoing, we want to stay on the same column
  const nextcell = [0, hasSelections ? focusedCellCoordsState[1] : 0];
  setFocusedCellCoordsState(nextcell);

  if (shouldRefocus.current) {
    updateFocus(rowElements, nextcell);
    shouldRefocus.current = false;
  } else {
    rowElements[0]?.getElementsByClassName('sn-table-cell')[nextcell[1]].setAttribute('tabIndex', '0');
  }
};
