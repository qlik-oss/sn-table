import { useEffect } from 'react';
import { handleFocusoutEvent } from '../utils/handle-accessibility';

const useFocusListener = (tableWrapperRef, shouldRefocus, keyboard) => {
  useEffect(() => {
    const memoedWrapper = tableWrapperRef.current;
    if (!memoedWrapper) return () => {};

    const focusOutCallback = (evt) => handleFocusoutEvent(evt, shouldRefocus, keyboard);
    memoedWrapper.addEventListener('focusout', focusOutCallback);

    return () => {
      memoedWrapper.removeEventListener('focusout', focusOutCallback);
    };
  }, [tableWrapperRef, shouldRefocus, keyboard]);
};

export default useFocusListener;
