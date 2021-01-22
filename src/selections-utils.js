export function getSelectionStyle(selected, cell) {
  const isExcluded = selected.rows.length && selected.colIdx !== cell.colIdx;
  const hasSelectedElemNumber = !!selected.rows?.find((r) => r.qElemNumber === cell.qElemNumber);

  return isExcluded
    ? { style: { backgroundColor: '#e8e8e8' }, identifyerClass: 'excluded' }
    : hasSelectedElemNumber
    ? { style: { backgroundColor: '#009845' }, identifyerClass: 'selected' }
    : { identifyerClass: 'possible' };
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
