export const updateFocus = (rowElements, cellCoord, shouldBlur = false) => {
  const cell = rowElements[cellCoord[0]]?.getElementsByClassName('sn-table-cell')[cellCoord[1]];
  if (cell) {
    if (shouldBlur) {
      cell.setAttribute('tabIndex', '-1');
      cell.blur();
    } else {
      cell.focus();
      cell.setAttribute('tabIndex', '0');
    }
  }
};

export const handleClickToFocusBody = (cell, focusedCellCoord, rootElement) => {
  const { rawRowIdx, rawColIdx } = cell;
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus(rowElements, focusedCellCoord.current, true);
  focusedCellCoord.current = [rawRowIdx + 1, rawColIdx];
  updateFocus(rowElements, [rawRowIdx + 1, rawColIdx]);
};

export const handleClickToFocusHead = (columnIndex, focusedCellCoord, rootElement) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus(rowElements, focusedCellCoord.current, true);
  focusedCellCoord.current = [0, columnIndex];
  updateFocus(rowElements, [0, columnIndex]);
};

export const handleResetFocus = (focusedCellCoord, rootElement, shouldRefocus, hasSelections) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus(rowElements, focusedCellCoord.current, true);

  // If we have selections ongoing, we want to stay on the same column
  const nextcell = [0, hasSelections ? focusedCellCoord.current[1] : 0];
  focusedCellCoord.current = nextcell;

  if (shouldRefocus.current) {
    updateFocus(rowElements, nextcell);
    shouldRefocus.current = false;
  } else {
    rowElements[0]?.getElementsByClassName('sn-table-cell')[nextcell[1]].setAttribute('tabIndex', '0');
  }
};
