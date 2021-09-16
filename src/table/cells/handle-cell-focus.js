export const updateFocus = (rowElements, cellCoord, shouldFocusType) => {
  const cell = rowElements[cellCoord[0]]?.getElementsByClassName('sn-table-cell')[cellCoord[1]];
  if (cell) {
    if (shouldFocusType === 'focus') {
      cell.focus();
      cell.setAttribute('tabIndex', '0');
    } else if (shouldFocusType === 'removeTab') {
      // cell.blur();
      cell.setAttribute('tabIndex', '-1');
    } else if (shouldFocusType === 'blur') {
      cell.blur();
      cell.setAttribute('tabIndex', '-1');
    }
  }
};

export const handleClickToFocusBody = (cell, focusedCellCoord, rootElement) => {
  const { rawRowIdx, rawColIdx } = cell;
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus(rowElements, focusedCellCoord.current, 'removeTab');
  focusedCellCoord.current = [rawRowIdx + 1, rawColIdx];
  updateFocus(rowElements, [rawRowIdx + 1, rawColIdx], 'focus');
};

export const handleClickToFocusHead = (columnIndex, focusedCellCoord, rootElement) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus(rowElements, focusedCellCoord.current, 'removeTab');
  focusedCellCoord.current = [0, columnIndex];
  updateFocus(rowElements, [0, columnIndex], 'focus');
};

export const handleResetFocus = (focusedCellCoord, rootElement, shouldRefocus, hasSelections) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus(rowElements, focusedCellCoord.current, 'blur');

  // If we have selections ongoing, we want to stay on the same column
  const nextcell = [0, hasSelections ? focusedCellCoord.current[1] : 0];
  focusedCellCoord.current = nextcell;

  if (shouldRefocus.current) {
    updateFocus(rowElements, nextcell, 'focus');
    shouldRefocus.current = false;
  } else {
    rowElements[0]?.getElementsByClassName('sn-table-cell')[nextcell[1]].setAttribute('tabIndex', '0');
  }
};
