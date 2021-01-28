export function getSelectionClass(selected, cell) {
  const { colIdx, rows } = selected;

  if (rows.length) {
    if (colIdx !== cell.colIdx) return 'excluded';

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].qElemNumber === cell.qElemNumber) return 'selected';
    }
  }

  return 'possible';
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
