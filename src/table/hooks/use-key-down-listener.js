import { useEffect } from 'react';
import { handleNavigateTop } from '../utils/handle-scroll';

const useKeyDownListener = (tableBodyWrapperRef, tableContainerRef, focusedCellCoord, rootElement, totalsPosition) => {
  useEffect(() => {
    const memoedContainer = tableBodyWrapperRef.current;
    if (!memoedContainer) return undefined;

    const keyDownHandler = (evt) =>
      evt.key === 'ArrowUp' && handleNavigateTop({ tableContainerRef, focusedCellCoord, rootElement, totalsPosition });
    memoedContainer.addEventListener('keydown', keyDownHandler);

    return () => {
      memoedContainer.removeEventListener('keydown', keyDownHandler);
    };
  }, [tableBodyWrapperRef, tableContainerRef, focusedCellCoord, rootElement, totalsPosition]);
};

export default useKeyDownListener;
