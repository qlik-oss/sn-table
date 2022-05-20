export const findCellWithTabStop = (rootElement) => rootElement.querySelector("td[tabindex='0'], th[tabindex='0']");

export const updateFocus = ({ focusType, rowElements = [], cellCoord = [], providedCell = undefined }) => {
  const cell = providedCell || rowElements[cellCoord[0]]?.getElementsByClassName('sn-table-cell')[cellCoord[1]];
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

export const removeAndFocus = (newCoord, rootElement, setFocusedCellCoord, keyboard) => {
  updateFocus({
    providedCell: findCellWithTabStop(rootElement),
    focusType: 'removeTab',
  });
  setFocusedCellCoord(newCoord);
  keyboard.enabled && keyboard.focus();
};

export const handleClickToFocusBody = (cell, rootElement, setFocusedCellCoord, keyboard) => {
  const { rawRowIdx, rawColIdx } = cell;
  removeAndFocus([rawRowIdx + 1, rawColIdx], rootElement, setFocusedCellCoord, keyboard);
};

export const handleClickToFocusHead = (columnIndex, rootElement, setFocusedCellCoord, keyboard) => {
  removeAndFocus([0, columnIndex], rootElement, setFocusedCellCoord, keyboard);
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
  updateFocus({ focusType: 'removeTab', providedCell: findCellWithTabStop(rootElement) });
  // If you have selections ongoing, you want to stay on the same column
  const nextCell = hasSelections ? [1, focusedCellCoord[1]] : [0, 0];
  if (shouldAddTabstop) {
    // Only run this if updates come from inside table
    const focusType = shouldRefocus.current ? 'focus' : 'addTab';
    shouldRefocus.current = false;
    const rowElements = rootElement.getElementsByClassName('sn-table-row');
    const providedCell = rowElements[nextCell[0]]?.getElementsByClassName('sn-table-cell')[nextCell[1]];
    updateFocus({ focusType, providedCell });

    if (hasSelections) {
      const hasSelectedClassname = providedCell?.classList?.contains('selected');
      announce({
        keys: [
          `${providedCell.textContent},`,
          hasSelectedClassname ? 'SNTable.SelectionLabel.SelectedValue' : 'SNTable.SelectionLabel.NotSelectedValue',
        ],
      });
    }
  }
  setFocusedCellCoord(nextCell);
};

export const handleFocusoutEvent = (evt, shouldRefocus, keyboard) => {
  if (keyboard.enabled && !evt.currentTarget.contains(evt.relatedTarget) && !shouldRefocus.current) {
    evt.currentTarget.querySelector('#sn-table-announcer--01').innerHTML = '';
    evt.currentTarget.querySelector('#sn-table-announcer--02').innerHTML = '';
    keyboard.blur(false);
  }
};

export const focusSelectionToolbar = (element, keyboard, last) => {
  const clientConfirmButton = element
    .closest('.qv-object-wrapper')
    ?.querySelector('.sel-toolbar-confirm')?.parentElement;
  if (clientConfirmButton) {
    clientConfirmButton.focus();
    return;
  }
  keyboard.focusSelection(last);
};
