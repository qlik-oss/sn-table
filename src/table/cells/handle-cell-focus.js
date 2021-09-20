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

export const removeAndFocus = (rootElement, newCoord, setfocusedCellCoord, focus) => {
  updateFocus({
    providedCell: findCellWithTabStop(rootElement),
    focusType: 'removeTab',
  });
  setfocusedCellCoord(newCoord);
  focus();
};

export const handleClickToFocusBody = (cell, rootElement, setfocusedCellCoord, keyboard) => {
  const { rawRowIdx, rawColIdx } = cell;
  removeAndFocus(rootElement, setfocusedCellCoord, [rawRowIdx + 1, rawColIdx], keyboard.focus);
};

export const handleClickToFocusHead = (columnIndex, rootElement, setfocusedCellCoord, keyboard) => {
  removeAndFocus(rootElement, setfocusedCellCoord, [0, columnIndex], keyboard.focus);
};

// export const handleResetFocus = (focusedCellCoord, rootElement, shouldRefocus, hasSelections) => {
//   const rowElements = getRowElements(rootElement);
//   updateFocus(rowElements, focusedCellCoord.current, 'removeTab');

//   // If we have selections ongoing, we want to stay on the same column
//   const nextCell = hasSelections ? [1, focusedCellCoord.current[1]] : [0, 0];
//   focusedCellCoord.current = nextCell;

//   if (shouldRefocus.current) {
//     updateFocus(rowElements, nextCell, 'focus');
//     shouldRefocus.current = false;

// export const handleClickToFocusBody = (cell, rootElement, setfocusedCellCoord) => {
//   const { rawRowIdx, rawColIdx } = cell;
//   const rowElements = rootElement.getElementsByClassName('sn-table-row');
//   updateFocus({
//     providedCell: findCellWithTabStop(rootElement),
//     shouldFocus: false,
//   });
//   setfocusedCellCoord([rawRowIdx + 1, rawColIdx]);
//   updateFocus({ rowElements, cellCoord: [rawRowIdx + 1, rawColIdx], shouldFocus: true });
// };

// export const handleClickToFocusHead = (columnIndex, rootElement, setfocusedCellCoord) => {
//   const rowElements = rootElement.getElementsByClassName('sn-table-row');
//   updateFocus({
//     providedCell: findCellWithTabStop(rootElement),
//     shouldFocus: false,
//   });
//   setfocusedCellCoord([0, columnIndex]);
//   updateFocus({ rowElements, cellCoord: [0, columnIndex], shouldFocus: true });
// };

export const handleResetFocus = ({
  focusedCellCoord,
  rootElement,
  shouldRefocus,
  hasSelections,
  setfocusedCellCoord,
}) => {
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  updateFocus({ focusType: 'removeTab', providedCell: findCellWithTabStop(rootElement) });

  // If we have selections ongoing, we want to stay on the same column
  const nextCell = hasSelections ? [1, focusedCellCoord.current[1]] : [0, 0];
  const focusType = shouldRefocus.current ? 'focus' : 'addStop';
  setfocusedCellCoord(nextCell);
  updateFocus({ focusType, rowElements, cellCoord: nextCell });
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
