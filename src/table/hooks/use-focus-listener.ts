import { stardust } from "@nebula.js/stardust";
import { useEffect } from "react";
import { handleFocusoutEvent } from "../utils/accessibility-utils";

const useFocusListener = (
  tableWrapperRef: React.MutableRefObject<HTMLDivElement | null>,
  shouldRefocus: React.MutableRefObject<boolean>,
  keyboard: stardust.Keyboard
) => {
  useEffect(() => {
    const memoedWrapper = tableWrapperRef.current;
    if (!memoedWrapper) return undefined;

    const focusOutCallback = (evt: FocusEvent) => handleFocusoutEvent(evt, shouldRefocus, keyboard);
    memoedWrapper.addEventListener("focusout", focusOutCallback);

    return () => {
      memoedWrapper.removeEventListener("focusout", focusOutCallback);
    };
  }, [tableWrapperRef, shouldRefocus, keyboard]);
};

export default useFocusListener;
