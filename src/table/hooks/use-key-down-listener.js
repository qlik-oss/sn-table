import { useEffect } from 'react';
import { handleNavigateTop } from '../utils/handle-scroll';

const useKeyDownListener = (tableBodyWrapperRef, focusedCellCoord, rootElement, totalsPosition) => {
  useEffect(() => {
    const memoedContainer = tableBodyWrapperRef.current;
    if (!memoedContainer) return undefined;

    const keyDownHandler = (evt) =>
      evt.key === 'ArrowUp' && handleNavigateTop({ focusedCellCoord, rootElement, totalsPosition });
    memoedContainer.addEventListener('keyup', keyDownHandler);

    return () => {
      memoedContainer.removeEventListener('keyup', keyDownHandler);
    };
  }, [tableBodyWrapperRef, focusedCellCoord, rootElement, totalsPosition]);
};

export default useKeyDownListener;
