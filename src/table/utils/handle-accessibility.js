export const findCellWithTabStop = (rootElement) => rootElement.querySelector("td[tabindex='0'], th[tabindex='0']");

export const updateFocus = ({
  focusType,
  rowElements = [],
  cellCoord = [],
  providedCell = undefined,
  isSelectionActive,
  callee,
  announce,
}) => {
  const cell = providedCell || rowElements[cellCoord[0]]?.getElementsByClassName('sn-table-cell')[cellCoord[1]];
  if (!cell) return;

  if (isSelectionActive && callee !== 'tableWrapper') {
    const hasActiveClassName = cell.classList.contains('selected');
    hasActiveClassName
      ? announce({ keys: 'SNTable.SelectionLabel.SelectedValue' })
      : announce({ keys: 'SNTable.SelectionLabel.NotSelectedValue' });
  }

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

export const removeAndFocus = (newCoord, rootElement, setFocusedCellCoord, focus, announce) => {
  updateFocus({
    providedCell: findCellWithTabStop(rootElement),
    focusType: 'removeTab',
    announce,
  });
  setFocusedCellCoord(newCoord);
  focus();
};

export const handleClickToFocusBody = (cell, rootElement, setFocusedCellCoord, keyboard, announce) => {
  const { rawRowIdx, rawColIdx } = cell;
  removeAndFocus([rawRowIdx + 1, rawColIdx], rootElement, setFocusedCellCoord, keyboard.focus, announce);
};

export const handleClickToFocusHead = (columnIndex, rootElement, setFocusedCellCoord, keyboard, announce) => {
  removeAndFocus([0, columnIndex], rootElement, setFocusedCellCoord, keyboard.focus, announce);
};

export const handleResetFocus = ({
  focusedCellCoord,
  rootElement,
  shouldRefocus,
  hasSelections,
  setFocusedCellCoord,
  shouldAddTabstop,
  announce,
}) => {
  updateFocus({
    focusType: 'removeTab',
    providedCell: findCellWithTabStop(rootElement),
    isSelectionActive: hasSelections,
    announce,
  });
  // If we have selections ongoing, we want to stay on the same column
  const nextCell = hasSelections ? [1, focusedCellCoord[1]] : [0, 0];
  if (shouldAddTabstop) {
    // Only run this if updates come from inside table
    const focusType = shouldRefocus.current ? 'focus' : 'addTab';
    shouldRefocus.current = false;
    const rowElements = rootElement.getElementsByClassName('sn-table-row');
    updateFocus({ focusType, rowElements, cellCoord: nextCell, isSelectionActive: hasSelections, announce });
  }
  setFocusedCellCoord(nextCell);
};

export const handleFocusoutEvent = (evt, shouldRefocus, blur) => {
  if (!evt.currentTarget.contains(evt.relatedTarget) && !shouldRefocus.current) {
    blur(false);
  }
};

// get the object, find the patent of the confirmbutton in slection toolbar parent and focus that element
export const focusConfirmButton = (element) =>
  element.closest('.qv-object-wrapper')?.querySelector('.sel-toolbar-confirm')?.parentElement?.focus();
