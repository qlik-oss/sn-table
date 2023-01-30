import { useCallback, useRef } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { ROW_DATA_BUFFER_SIZE } from '../constants';
import { BodyRef } from '../types';

function interpolate(from: number, to: number, t: number) {
  return from * (1 - t) + to * t;
}

const useScrollHandler = (
  headerRef: React.RefObject<VariableSizeList<any>>,
  totalsRef: React.RefObject<VariableSizeList<any>>,
  bodyRef: React.RefObject<VariableSizeGrid<any>>,
  innerForwardRef: React.RefObject<HTMLDivElement>,
  containerHeight: number,
  headerAndTotalsHeight: number,
  setContainerHeight: React.Dispatch<React.SetStateAction<number>>,
  bRef: React.RefObject<BodyRef>
) => {
  const prevScrollTop = useRef(0);
  return useCallback(
    (event: React.SyntheticEvent) => {
      const { scrollHeight } = event.currentTarget;
      const diff = event.currentTarget.scrollTop - prevScrollTop.current;
      const distance = Math.abs(diff);
      // if (distance > 26 * ROW_DATA_BUFFER_SIZE) {
      //   const t =
      //     diff > 0
      //       ? (event.currentTarget.clientHeight + event.currentTarget.scrollTop) / scrollHeight
      //       : event.currentTarget.scrollTop / scrollHeight;
      //   const targetIndex = Math.ceil(interpolate(0, 9209, t));
      //   // console.log('t', t, 'targetIndex', targetIndex);
      //   // console.log('big scroll', 'scroll to index', targetIndex);
      //   // bodyRef.current?.scrollToItem({ rowIndex: targetIndex });
      //   bRef.current?.scrollToIndex(targetIndex);
      // } else {
      const t =
        diff > 0
          ? (event.currentTarget.clientHeight + event.currentTarget.scrollTop) / scrollHeight
          : event.currentTarget.scrollTop / scrollHeight;
      console.log('t scrollTo', t, 'cleintHeight', innerForwardRef.current?.clientHeight);
      const interpolatedScrollTop = interpolate(0, innerForwardRef.current?.clientHeight ?? 0, t);
      bRef.current?.scrollTo(interpolatedScrollTop, Math.ceil(diff / 26), t);
      // bodyRef.current?.scrollTo({
      //   // scrollLeft: event.currentTarget.scrollLeft,
      //   scrollTop: event.currentTarget.scrollTop,
      // });
      // }

      headerRef.current?.scrollTo(event.currentTarget.scrollLeft);

      totalsRef.current?.scrollTo(event.currentTarget.scrollLeft);

      bodyRef.current?.scrollTo({
        scrollLeft: event.currentTarget.scrollLeft,
        // scrollTop: event.currentTarget.scrollTop,
      });

      // bodyRef.current?.scrollToItem({ rowIndex: targetIndex });

      if (innerForwardRef.current) {
        // Keep full size container in sync with the height calculation in react-window is doing
        // if (scrollHeight !== containerHeight) {
        //   setContainerHeight(scrollHeight);
        // }
      }

      prevScrollTop.current = event.currentTarget.scrollTop;
    },
    [headerRef, totalsRef, bodyRef, innerForwardRef, containerHeight, headerAndTotalsHeight, setContainerHeight, bRef]
  );
};

export default useScrollHandler;
