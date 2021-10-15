import { emitAnnouncement } from '../components/Announcer/announcement-utils';

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

  emitAnnouncement();
};

export const removeAndFocus = (newCoord, rootElement, setFocusedCellCoord, focus) => {
  updateFocus({
    providedCell: findCellWithTabStop(rootElement),
    focusType: 'removeTab',
  });
  setFocusedCellCoord(newCoord);
  focus();
};

export const handleClickToFocusBody = (cell, rootElement, setFocusedCellCoord, keyboard) => {
  const { rawRowIdx, rawColIdx } = cell;
  removeAndFocus([rawRowIdx + 1, rawColIdx], rootElement, setFocusedCellCoord, keyboard.focus);
};

export const handleClickToFocusHead = (columnIndex, rootElement, setFocusedCellCoord, keyboard) => {
  removeAndFocus([0, columnIndex], rootElement, setFocusedCellCoord, keyboard.focus);
};

export const handleResetFocus = ({
  focusedCellCoord,
  rootElement,
  shouldRefocus,
  hasSelections,
  setFocusedCellCoord,
  shouldAddTabstop,
}) => {
  updateFocus({ focusType: 'removeTab', providedCell: findCellWithTabStop(rootElement) });
  // If we have selections ongoing, we want to stay on the same column
  const nextCell = hasSelections ? [1, focusedCellCoord[1]] : [0, 0];
  if (shouldAddTabstop) {
    // Only run this if updates come from inside table
    const focusType = shouldRefocus.current ? 'focus' : 'addTab';
    shouldRefocus.current = false;
    const rowElements = rootElement.getElementsByClassName('sn-table-row');
    updateFocus({ focusType, rowElements, cellCoord: nextCell });
  }
  setFocusedCellCoord(nextCell);
};

export const getCellSelectionStatusNote = (rows, translator) =>
  rows.length === 1
    ? translator.get('SNTable.SelectionLabel.OneSelectedValue')
    : translator.get('SNTable.SelectionLabel.SelectedValues', [rows.length]);

export const getMemoisedSrNotation = (prevCount = 0) => {
  let prevSelectedCount = prevCount || 0;
  let hasJunkChar = 0;

  return ({ focusedCellCoord, rootElement, selectionState, translator, isActiveElementInTable }) => {
    if (!focusedCellCoord || focusedCellCoord[0] === 0 || !isActiveElementInTable) return '';

    const [rowIdx, colIdx] = focusedCellCoord;
    const rowElements = rootElement.getElementsByClassName('sn-table-row');
    const cell = rowElements[rowIdx]?.getElementsByClassName('sn-table-cell')[colIdx];

    const isCellSelected = cell && cell.classList.contains('selected');

    let notation = '';

    if (selectionState.rows.length) {
      const selectionNote = getCellSelectionStatusNote(selectionState.rows, translator);

      if (prevSelectedCount < selectionState.rows.length) {
        // if we select cell
        notation += `${translator.get('SNTable.SelectionLabel.SelectedValue')} ${selectionNote}`;
      } else if (prevSelectedCount > selectionState.rows.length) {
        // if we deselect cell
        notation += `${translator.get('SNTable.SelectionLabel.DeselectedValue')} ${selectionNote}`;
      } else if (isCellSelected) {
        // if we are in selection mode and move to selected cell
        notation += translator.get('SNTable.SelectionLabel.SelectedValue');
      } else {
        // if we are in selection mode and move to unselected cell
        notation += translator.get('SNTable.SelectionLabel.NotSelectedValue');
      }

      // Junk char addition
      if (hasJunkChar % 2) notation += ` ­`;
      hasJunkChar++;
    } else if (selectionState.rows.length === 0 && prevSelectedCount > 0) {
      // if we deselect last (selected) cell which means we close the selection mode
      notation += translator.get('SNTable.SelectionLabel.ExitedSelectionMode');
    }

    prevSelectedCount = selectionState.rows.length;
    return notation;
  };
};

export const getCellSrNotation = getMemoisedSrNotation();
export const handleFocusoutEvent = (evt, shouldRefocus, blur) => {
  if (!evt.currentTarget.contains(evt.relatedTarget) && !shouldRefocus.current) {
    blur(false);
  }
};

// get the object, find the patent of the confirmbutton in slection toolbar parent and focus that element
export const focusConfirmButton = (element) =>
  element.closest('.qv-object-wrapper')?.querySelector('.sel-toolbar-confirm')?.parentElement?.focus();
