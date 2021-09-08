export const updateFocus = ({ rowElements = {}, cellCoord = [], shouldFocus = true, providedCell = undefined }) => {
  const cell = rowElements[cellCoord[0]]?.getElementsByClassName('sn-table-cell')[cellCoord[1]] || providedCell;
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

export const handleClickToFocusBody = (cell, focusedCellCoord, rootElement, setfocusedCellCoord) => {
  const { rawRowIdx, rawColIdx } = cell;
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus({ rowElements, cellCoord: focusedCellCoord, shouldFocus: false });
  setfocusedCellCoord([rawRowIdx + 1, rawColIdx]);
  updateFocus({ rowElements, cellCoord: [rawRowIdx + 1, rawColIdx], shouldFocus: true });
};

export const handleClickToFocusHead = (columnIndex, focusedCellCoord, rootElement, setfocusedCellCoord) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus({ rowElements, cellCoord: focusedCellCoord, shouldFocus: false });
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
    const rowElements = rootElement.getElementsByClassName('sn-table-row');
    const cell = rowElements[x]?.getElementsByClassName('sn-table-cell')[y];

    if (cell.offsetTop - cell.offsetHeight * MIN_ROW_COUNT < tableSection.current.scrollTop) {
      const targetOffsetTop = tableSection.current.scrollTop - cell.offsetHeight;
      tableSection.current.scrollTo({
        top: targetOffsetTop <= 0 ? 0 : targetOffsetTop,
        behavior: 'smooth',
      });
    }
  }
};
