import { useEffect, useState, useSelections } from '@nebula.js/stardust';

export default function selectionsWrapper() {
  const api = useSelections();
  // const isInSelections = !!useLayout().qSelectionInfo.qInSelections;
  const [selectionObj] = useState({
    api,
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
    if (!selectionObj.api) {
      return () => {};
    }
    selectionObj.api = api;
    selectionObj.api.on('deactivated', resetSelections);
    selectionObj.api.on('canceled', resetSelections);
    selectionObj.api.on('confirmed', resetSelections);
    selectionObj.api.on('cleared', resetSelections);
    // Return function called on unmount
    return () => {
      selectionObj.api.removeListener('deactivated', resetSelections);
      selectionObj.api.removeListener('canceled', resetSelections);
      selectionObj.api.removeListener('confirmed', resetSelections);
      selectionObj.api.removeListener('cleared', resetSelections);
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

  return selectionObj;
}
