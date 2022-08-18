import { useEffect } from 'react';
import { handleHorizontalScroll } from '../utils/handle-scroll';

const useScrollListener = (
  tableContainerRef: React.MutableRefObject<HTMLDivElement | undefined>,
  direction?: string
) => {
  useEffect(() => {
    const memoedContainer = tableContainerRef.current;
    if (!memoedContainer) return undefined;

    const horizontalScrollCallback = (evt: WheelEvent) =>
      handleHorizontalScroll(evt, direction === 'rtl', memoedContainer);
    memoedContainer.addEventListener('wheel', horizontalScrollCallback);

    return () => {
      memoedContainer.removeEventListener('wheel', horizontalScrollCallback);
    };
  }, [tableContainerRef, direction]);
};

export default useScrollListener;
