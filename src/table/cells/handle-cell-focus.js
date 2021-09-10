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

export const handleClickToFocusBody = (cell, rootElement, setfocusedCellCoord, constraints) => {
  if (constraints.active) return;

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
