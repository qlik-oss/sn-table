import { useEffect, useState, useSelections } from '@nebula.js/stardust';
import { getSelectionStyle, selectCell } from './selections-utils';

export default function initSelections(el) {
  const api = useSelections();
  const [selections] = useState({
    api,
    getSelectionStyle: (cell) => getSelectionStyle(selections.selected, cell),
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
    const onMouseUp = (e) => {
      const classes = e.target.className;
      // TODO: isSelectableCell is false when dragging from one cell to another
      const isSelectableCell = classes.includes('selected') || classes.includes('possible');
      if (selections.api.isActive() && !isSelectableCell) {
        e.stopPropagation();
        selections.api.confirm();
      }
    };

    el.addEventListener('mouseup', onMouseUp, true);
    return () => {
      el.removeEventListener('mouseup', onMouseUp, true);
    };
  }, []);

  return selections;
}
