export default function handleSelect(cell, colIdx, selectionObj) {
  const { api, selected, setSelected } = selectionObj;
  const { dataRowIdx, qElemNumber } = cell;
  let newSelected = [];

  // prevent selection in other column
  if ((selected.length && selected[0].colIdx !== colIdx) || !api) {
    return;
  }

  if (!api.isActive() || !selected) {
    api.begin('/qHyperCubeDef');
    console.log('begin');
  } else{
    newSelected = selected.concat();
  }

  const alreadySelectedIdx = newSelected.findIndex((s) => s.qElemNumber === qElemNumber);
  if (alreadySelectedIdx > -1) {
    newSelected.splice(alreadySelectedIdx, 1);
  } else {
    newSelected.push({ qElemNumber, dataRowIdx, colIdx })
  }

  if (newSelected.length) {
    const selectedRows = newSelected.map(s => s.dataRowIdx);
    api.select({
      method: 'selectHyperCubeCells',
      params: ['/qHyperCubeDef', selectedRows, [colIdx]],
    });
  } else {
    api.select({
      method: 'resetMadeSelections',
      params: [],
    });
  }

  setSelected(newSelected);
}
