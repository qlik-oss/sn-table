import { useEffect, useState, useSelections } from '@nebula.js/stardust';

export function selectCell(selections, cell) {
  const { api, selected, setSelected } = selections;
  const { rowIdx, colIdx, qElemNumber } = cell;
  let newSelected = [];

  // prevent selection in other column
  if ((selected.length && selected[0].colIdx !== colIdx) || !api) {
    return;
  }

  if (!api.isActive() || !selected) {
    api.begin('/qHyperCubeDef');
  } else {
    newSelected = selected.concat();
  }

  const alreadySelectedIdx = newSelected.findIndex((s) => s.qElemNumber === qElemNumber);
  if (alreadySelectedIdx > -1) {
    newSelected.splice(alreadySelectedIdx, 1);
  } else {
    newSelected.push({ qElemNumber, rowIdx, colIdx });
  }

  if (newSelected.length) {
    const selectedRows = newSelected.map((s) => s.rowIdx);
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

export default function initSelections() {
  const api = useSelections();
  const [selections] = useState({
    api,
    selectCell: (cell, colIdx) => selectCell(selections, cell, colIdx, selections),
    selected: [],
    setSelected: (selected) => {
      selections.selected = selected;
    },
  });

  // useEffect(() => {
  //   autoRegister(translator);
  // }, [translator]);

  const resetSelections = () => {
    selections.selected = [];
  };

  useEffect(() => {
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

  // useEffect(() => {
  //   const addKeyPress = event => {
  //     if (event.key === 'Shift') {
  //       setSingleSelect(true);
  //     }
  //   };

  //   const removeKeyPress = event => {
  //     if (event.key === 'Shift') {
  //       setSingleSelect(false);
  //     }
  //   };
  //   document.addEventListener('keydown', addKeyPress);
  //   document.addEventListener('keyup', removeKeyPress);

  //   return () => {
  //     document.removeEventListener('keydown', addKeyPress);
  //     document.removeEventListener('keyup', removeKeyPress);
  //   };
  // }, []);

  return selections;
}
