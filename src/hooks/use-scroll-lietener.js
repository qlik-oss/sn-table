import { useEffect } from 'react';
import { handleHorizontalScroll } from '../table/utils/handle-scroll';

const useScrollListener = (tableContainerRef, direction) => {
  useEffect(() => {
    const memoedContainer = tableContainerRef.current;
    if (!memoedContainer) return () => {};

    const horizontalScrollCallback = (evt) => handleHorizontalScroll(evt, direction === 'rtl', memoedContainer);
    memoedContainer.addEventListener('wheel', horizontalScrollCallback);

    return () => {
      memoedContainer.removeEventListener('wheel', horizontalScrollCallback);
    };
  }, [tableContainerRef, direction]);
};

export default useScrollListener;
