import { useEffect, useState, useSelections } from '@nebula.js/stardust';

export default function selectionHandler(model) {
  const selections = useSelections();
  // const isInSelections = !!useLayout().qSelectionInfo.qInSelections;
  const [selectionObj] = useState({
    selections,
    model,
    selected: [],
    setSelected: (selected) => {
      selectionObj.selected = selected;
    },
  });

  // useEffect(() => {
  //   autoRegister(translator);
  // }, [translator]);

  const resetSelections = () => {
    selectionObj.selected = [];
  };

  useEffect(() => {
    if (!selectionObj.selections) {
      return () => {};
    }
    selectionObj.selections = selections;
    selectionObj.selections.on('deactivated', resetSelections);
    selectionObj.selections.on('canceled', resetSelections);
    selectionObj.selections.on('confirmed', resetSelections);
    selectionObj.selections.on('cleared', resetSelections);
    // Return function called on unmount
    return () => {
      selectionObj.selections.removeListener('deactivated', resetSelections);
      selectionObj.selections.removeListener('canceled', resetSelections);
      selectionObj.selections.removeListener('confirmed', resetSelections);
      selectionObj.selections.removeListener('cleared', resetSelections);
    };
  }, [selections]);


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

  return selectionObj;
}
