export const updateFocus = ({ rowElements = {}, cellCoord = [], shouldFocus = true, providedCell = undefined }) => {
  const cell = providedCell || rowElements[cellCoord[0]]?.getElementsByClassName('sn-table-cell')[cellCoord[1]];
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

export const findCellWithTabStop = (rootElement) => rootElement.querySelector("td[tabindex='0'], th[tabindex='0']");

export const handleClickToFocusBody = (cell, rootElement, setfocusedCellCoord) => {
  const { rawRowIdx, rawColIdx } = cell;
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus({
    providedCell: findCellWithTabStop(rootElement),
    shouldFocus: false,
  });
  setfocusedCellCoord([rawRowIdx + 1, rawColIdx]);
  updateFocus({ rowElements, cellCoord: [rawRowIdx + 1, rawColIdx], shouldFocus: true });
};

export const handleClickToFocusHead = (columnIndex, rootElement, setfocusedCellCoord) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus({
    providedCell: findCellWithTabStop(rootElement),
    shouldFocus: false,
  });
  setfocusedCellCoord([0, columnIndex]);
  updateFocus({ rowElements, cellCoord: [0, columnIndex], shouldFocus: true });
};

export const handleResetFocus = ({
  focusedCellCoord,
  rootElement,
  shouldRefocus,
  hasSelections,
  setfocusedCellCoord,
}) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus({ rowElements, cellCoord: focusedCellCoord, shouldFocus: false });

  // If we have selections ongoing, we want to stay on the same column
  const nextcell = [0, hasSelections ? focusedCellCoord[1] : 0];
  setfocusedCellCoord(nextcell);

  if (shouldRefocus.current) {
    updateFocus({ rowElements, cellCoord: nextcell });
  } else {
    rowElements[0]?.getElementsByClassName('sn-table-cell')[nextcell[1]].setAttribute('tabIndex', '0');
  }
};

export const handleNavigateTop = ({ tableSection, focusedCellCoord, rootElement }) => {
  const MIN_ROW_COUNT = 2;

  if (!tableSection.current?.scrollTo) return;

  if (focusedCellCoord[0] < MIN_ROW_COUNT) {
    tableSection.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } else {
    const [x, y] = focusedCellCoord;
    const tableHead = rootElement.getElementsByClassName('sn-table-head-cell')[0];
    const rowElements = rootElement.getElementsByClassName('sn-table-row');
    const cell = rowElements[x]?.getElementsByClassName('sn-table-cell')[y];

    if (cell.offsetTop - tableHead.offsetHeight - cell.offsetHeight <= tableSection.current.scrollTop) {
      const targetOffsetTop = tableSection.current.scrollTop - cell.offsetHeight - tableHead.offsetHeight;
      tableSection.current.scrollTo({
        top: Math.max(0, targetOffsetTop),
        behavior: 'smooth',
      });
    }
  }
};

export const getCellSelectionStatusNote = (rows) => {
  return rows.length === 1
    ? 'There is 1 selected value currently'
    : `There are ${rows.length} selected values currently`;
};

export const getMemoisedSrNotation = (prevCount = 0) => {
  let prevSelectedCount = prevCount || 0;

  return ({ focusedCellCoord, rootElement, selState }) => {
    if (!focusedCellCoord || focusedCellCoord[0] === 0) return '';

    const [rowIdx, colIdx] = focusedCellCoord;
    const rowElements = rootElement.getElementsByClassName('sn-table-row');
    const cell = rowElements[rowIdx]?.getElementsByClassName('sn-table-cell')[colIdx];

    const isCellSelected = cell && cell.classList.contains('selected');

    let notation = '';

    if (selState.rows.length) {
      const selectionNote = getCellSelectionStatusNote(selState.rows);

      if (prevSelectedCount < selState.rows.length) {
        // if we select cell
        notation += `value is selected. ${selectionNote}`;
      } else if (prevSelectedCount > selState.rows.length) {
        // if we deselect cell
        notation += `value is deselected. ${selectionNote}`;
      } else if (isCellSelected) {
        // if we are in selection mode and move to selected cell
        notation += 'value is selected.';
      } else {
        // if we are in selection mode and move to unselected cell
        notation += 'value is not selected.';
      }
    } else if (selState.rows.length === 0 && prevSelectedCount > 0) {
      // if we deselect last (selected) cell which means we close the selection mode
      notation += 'value deselected and exited selection mode.';
    }

    prevSelectedCount = selState.rows.length;
    return notation;
  };
};

export const getCellSrNotation = getMemoisedSrNotation();
