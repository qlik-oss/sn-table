export default function handleSelect(cell, colIdx, selectionObj) {
  const { model, selections, selected, setSelected } = selectionObj;
  const {dataRowIdx, qElemNumber } = cell;
  // const newState = state.concat();
  // newState.push(qText);

  if (model && selections) {
    let newSelected = [];

    if (!selections.isActive() || !selected) {
      selections.begin('/qHyperCubeDef');
      // model.beginSelections(['/qHyperCubeDef']);
      console.log('begin');
    } else {
      newSelected = selected.concat();
    }

    const alreadySelectedIdx = newSelected.findIndex((s) => s.qElemNumber === qElemNumber);
    if (alreadySelectedIdx > -1) {
      newSelected.splice(alreadySelectedIdx, 1);
    } else {
      newSelected.push({ qElemNumber, dataRowIdx })
    }

    if (newSelected.length === 0) {
      selections.clear();
      selections.selectionsMade = false;
    } else {
      const selectedRows = newSelected.map(s => s.dataRowIdx);
      model.selectHyperCubeCells('/qHyperCubeDef', selectedRows, [colIdx]);
      selections.selectionsMade = true;
    }

    setSelected(newSelected);
  }
}
