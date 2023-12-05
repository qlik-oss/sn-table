import { useEffect } from "react";
import { FocusTypes } from "../constants";
import { TableContext, useContextSelector } from "../context";
import { updateFocus } from "../utils/accessibility-utils";
import { findCellWithTabStop, getCellElement } from "../utils/get-element-utils";

/**
 * When nebula handles keyboard navigation (keyboard.enabled === true)
 * and keyboard.active changes, either focus the first cell or blur the focusedCellCoord cell
 * when keyboard.focus() runs, keyboard.active is set to true
 * when keyboard.blur() runs, keyboard.active is set to false
 */
const useKeyboardActiveListener = () => {
  const { rootElement, keyboard } = useContextSelector(TableContext, (value) => value.baseProps);
  const focusedCellCoord = useContextSelector(TableContext, (value) => value.focusedCellCoord);
  const isNewHeadCellMenuEnabled = useContextSelector(
    TableContext,
    (value) => value.featureFlags.isNewHeadCellMenuEnabled,
  );

  useEffect(() => {
    let focusType = focusedCellCoord[0] > 0 ? FocusTypes.FOCUS : FocusTypes.FOCUS_BUTTON;
    focusType = keyboard.active ? focusType : FocusTypes.BLUR;
    focusType = isNewHeadCellMenuEnabled ? FocusTypes.FOCUS : focusType;
    const cell = keyboard.active ? getCellElement(rootElement, focusedCellCoord) : findCellWithTabStop(rootElement);

    updateFocus({ focusType, cell });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboard.active, rootElement, isNewHeadCellMenuEnabled]);
};

export default useKeyboardActiveListener;
