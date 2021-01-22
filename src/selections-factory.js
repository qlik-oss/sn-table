import { useEffect, useState, useSelections } from '@nebula.js/stardust';

export function getSelectionStyles(selected, cell) {
  const hasSelectedElemNumber = !!selected.rows?.find((r) => r.qElemNumber === cell.qElemNumber);
  return selected.rows.length && selected.colIdx !== cell.colIdx
    ? { style: { backgroundColor: '#e8e8e8' }, stateClass: 'excluded' }
    : hasSelectedElemNumber
    ? { style: { backgroundColor: '#009845' }, stateClass: 'selected' }
    : { stateClass: 'possible' };
}

export function selectCell(selections, cell) {
  const { api, selected, setSelected } = selections;
  const { rowIdx, colIdx, qElemNumber } = cell;
  let rows = [];

  if (!api.isActive()) {
    api.begin('/qHyperCubeDef');
  } else {
    rows = selected.rows.concat();
  }

  const alreadySelectedIdx = rows.findIndex((r) => r.qElemNumber === qElemNumber);
  if (alreadySelectedIdx > -1) {
    rows.splice(alreadySelectedIdx, 1);
  } else {
    rows.push({ qElemNumber, rowIdx });
  }

  if (rows.length) {
    const selectedRows = rows.map((r) => r.rowIdx);
    api.select({
      method: 'selectHyperCubeCells',
      params: ['/qHyperCubeDef', selectedRows, [colIdx]],
    });
    setSelected({ colIdx, rows });
  } else {
    api.cancel();
    setSelected({ rows });
  }
}

export default function initSelections(el) {
  const api = useSelections();
  const [selections] = useState({
    api,
    getSelectionStyles: (cell) => getSelectionStyles(selections.selected, cell),
    selectCell: (cell) => selectCell(selections, cell),
    selected: { rows: [] },
    setSelected: (selected) => {
      selections.selected = selected;
    },
  });

  useEffect(() => {
    const resetSelections = () => {
      selections.selected = { rows: [] };
    };

    if (!selections.api) {
      return () => {};
    }

    selections.api = api;
    selections.api.on('deactivated', resetSelections);
    selections.api.on('canceled', resetSelections);
    selections.api.on('confirmed', resetSelections);
    selections.api.on('cleared', resetSelections);
    // Return function called on unmount
    return () => {
      selections.api.removeListener('deactivated', resetSelections);
      selections.api.removeListener('canceled', resetSelections);
      selections.api.removeListener('confirmed', resetSelections);
      selections.api.removeListener('cleared', resetSelections);
    };
  }, [api]);

  useEffect(() => {
    const onClick = (e) => {
      const classes = e.target.className;
      // TODO: isSelectableCell is false when dragging from one cell to another
      const isSelectableCell = classes.includes('selected') || classes.includes('possible');
      if (selections.api.isActive() && !isSelectableCell) {
        e.stopPropagation();
        selections.api.confirm();
      }
    };

    el.addEventListener('click', onClick, true);
    return () => {
      el.removeEventListener('click', onClick, true);
    };
  }, []);

  return selections;
}
