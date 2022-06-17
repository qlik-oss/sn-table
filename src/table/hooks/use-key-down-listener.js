import { useEffect } from 'react';
import { handleNavigateTop } from '../utils/handle-scroll';

const useKeyDownListener = (tableBodyWrapperRef, tableContainerRef, focusedCellCoord, rootElement) => {
  useEffect(() => {
    const memoedContainer = tableBodyWrapperRef.current;
    if (!memoedContainer) return () => {};

    const keyDownHandler = (evt) => {
      evt.key === 'ArrowUp' && handleNavigateTop({ tableContainerRef, focusedCellCoord, rootElement });
    };
    memoedContainer.addEventListener('keydown', keyDownHandler);

    return () => {
      memoedContainer.removeEventListener('keydown', keyDownHandler);
    };
  }, [tableBodyWrapperRef, tableContainerRef, focusedCellCoord, rootElement]);
};

export default useKeyDownListener;
