import { stardust } from '@nebula.js/stardust';
import React, { useEffect } from 'react';
import { handleFocusoutEvent } from '../utils/handle-accessibility';

const useFocusListener = (
  tableWrapperRef: React.MutableRefObject<HTMLDivElement>,
  shouldRefocus: {
    current: boolean;
  },
  keyboard: stardust.Keyboard
) => {
  useEffect(() => {
    const memoedWrapper = tableWrapperRef.current;
    if (!memoedWrapper) return undefined;

    const focusOutCallback = (evt: FocusEvent) => handleFocusoutEvent(evt, shouldRefocus, keyboard);
    memoedWrapper.addEventListener('focusout', focusOutCallback);

    return () => {
      memoedWrapper.removeEventListener('focusout', focusOutCallback);
    };
  }, [tableWrapperRef, shouldRefocus, keyboard]);
};

export default useFocusListener;
