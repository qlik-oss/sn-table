const getRowElements = (rootElement) => rootElement.getElementsByClassName('sn-table-row');

export const updateFocus = (rowElements, cellCoord, focusType) => {
  const cell = rowElements[cellCoord[0]]?.getElementsByClassName('sn-table-cell')[cellCoord[1]];
  if (!cell) return;

  switch (focusType) {
    case 'focus':
      cell.focus();
      cell.setAttribute('tabIndex', '0');
      break;
    case 'blur':
      cell.blur();
      cell.setAttribute('tabIndex', '-1');
      break;
    case 'addTab':
      cell.setAttribute('tabIndex', '0');
      break;
    case 'removeTab':
      cell.setAttribute('tabIndex', '-1');
      break;
    default:
      break;
  }
};

export const removeAndFocus = (rootElement, oldCoord, newCoord) => {
  const rowElements = getRowElements(rootElement);
  updateFocus(rowElements, oldCoord.current, 'removeTab');
  oldCoord.current = newCoord;
  // updateFocus(rowElements, newCoord, 'focus');
};

export const handleClickToFocusBody = (cell, focusedCellCoord, rootElement, keyboard) => {
  const { rawRowIdx, rawColIdx } = cell;
  removeAndFocus(rootElement, focusedCellCoord, [rawRowIdx + 1, rawColIdx]);
  keyboard.focus();
};

export const handleClickToFocusHead = (columnIndex, focusedCellCoord, rootElement, keyboard) => {
  removeAndFocus(rootElement, focusedCellCoord, [0, columnIndex]);
  keyboard.focus();
};

export const handleResetFocus = (focusedCellCoord, rootElement, shouldRefocus, hasSelections) => {
  const rowElements = getRowElements(rootElement);
  updateFocus(rowElements, focusedCellCoord.current, 'removeTab');

  // If we have selections ongoing, we want to stay on the same column
  const nextCell = hasSelections ? [1, focusedCellCoord.current[1]] : [0, 0];
  focusedCellCoord.current = nextCell;

  if (shouldRefocus.current) {
    updateFocus(rowElements, nextCell, 'focus');
    shouldRefocus.current = false;
  } else {
    updateFocus(rowElements, nextCell, 'addTab');
  }
};
