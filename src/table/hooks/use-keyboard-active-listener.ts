import { FIRST_BODY_CELL_COORD, FIRST_HEADER_CELL_COORD, FocusTypes } from '../constants';
import { useContextSelector, TableContext } from '../context';
import { updateFocus } from '../utils/accessibility-utils';
import { getCellElement } from '../utils/get-element-utils';
import useDidUpdateEffect from './use-did-update-effect';

const useKeyboardActiveListener = () => {
  const { selectionsAPI, rootElement, keyboard } = useContextSelector(TableContext, (value) => value.baseProps);
  const focusedCellCoord = useContextSelector(TableContext, (value) => value.focusedCellCoord);

  useDidUpdateEffect(() => {
    // When nebula handles keyboard navigation and keyboard.active changes,
    // make sure to focus the first cell or blur the focusedCellCoord
    // when keyboard.focus() runs, keyboard.active is true
    // when keyboard.blur() runs, keyboard.active is false
    const isSelectionMode = selectionsAPI.isModal();
    const firstCellCoord = isSelectionMode ? FIRST_BODY_CELL_COORD : FIRST_HEADER_CELL_COORD;
    const focusType = isSelectionMode ? FocusTypes.FOCUS : FocusTypes.FOCUS_BUTTON;
    updateFocus({
      focusType: keyboard.active ? focusType : FocusTypes.BLUR,
      cell: getCellElement(rootElement, keyboard.active ? firstCellCoord : focusedCellCoord),
    });
  }, [keyboard.active]);
};

export default useKeyboardActiveListener;
