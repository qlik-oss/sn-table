import { useEffect } from 'react';
import { handleHorizontalScroll } from '../utils/handle-scroll';
import { ViewService } from '../../types';

const useScrollListener = (
  tableContainerRef: React.MutableRefObject<HTMLDivElement | null>,
  direction: string | undefined,
  viewService: ViewService
) => {
  useEffect(() => {
    const memoedContainer = tableContainerRef.current;
    if (!memoedContainer) return undefined;

    const horizontalScrollCallback = (evt: WheelEvent) =>
      handleHorizontalScroll(evt, direction === 'rtl', memoedContainer);

    const scrollCallback = (evt: Event) => {
      viewService.scrollLeft = (evt.currentTarget as Element)?.scrollLeft || 0;
    };

    memoedContainer.addEventListener('wheel', horizontalScrollCallback);
    memoedContainer.addEventListener('scroll', scrollCallback);

    return () => {
      memoedContainer.removeEventListener('wheel', horizontalScrollCallback);
      memoedContainer.removeEventListener('scroll', scrollCallback);
    };
  }, [tableContainerRef, direction, viewService]);
};

export default useScrollListener;
