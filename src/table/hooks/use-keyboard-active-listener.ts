import { useEffect } from 'react';
import { FIRST_BODY_CELL_COORD, FIRST_HEADER_CELL_COORD, FocusTypes } from '../constants';
import { useContextSelector, TableContext } from '../context';
import { updateFocus } from '../utils/accessibility-utils';
import { findCellWithTabStop, getCellElement } from '../utils/get-element-utils';

/**
 * When nebula handles keyboard navigation (keyboard.enabled === true)
 * and keyboard.active changes, either focus the first cell or blur the focusedCellCoord cell
 * when keyboard.focus() runs, keyboard.active is set to true
 * when keyboard.blur() runs, keyboard.active is set to false
 */
const useKeyboardActiveListener = () => {
  const { selectionsAPI, rootElement, keyboard } = useContextSelector(TableContext, (value) => value.baseProps);

  useEffect(() => {
    const isSelectionMode = selectionsAPI.isModal();
    const firstCellCoord = isSelectionMode ? FIRST_BODY_CELL_COORD : FIRST_HEADER_CELL_COORD;
    const cell = keyboard.active ? getCellElement(rootElement, firstCellCoord) : findCellWithTabStop(rootElement);
    let focusType = isSelectionMode ? FocusTypes.FOCUS : FocusTypes.FOCUS_BUTTON;
    focusType = keyboard.active ? focusType : FocusTypes.BLUR;

    updateFocus({ focusType, cell });
  }, [keyboard.active, selectionsAPI, rootElement]);
};

export default useKeyboardActiveListener;
