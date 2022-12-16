import { useCallback } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';

const useScrollHandler = (
  headerRef: React.RefObject<VariableSizeList<any>>,
  totalsRef: React.RefObject<VariableSizeList<any>>,
  bodyRef: React.RefObject<VariableSizeGrid<any>>,
  innerForwardRef: React.RefObject<HTMLDivElement>,
  containerHeight: number,
  shrinkBodyHeightBy: number,
  setContainerHeight: React.Dispatch<React.SetStateAction<number>>
) =>
  useCallback(
    (event: React.SyntheticEvent) => {
      headerRef.current?.scrollTo(event.currentTarget.scrollLeft);

      totalsRef.current?.scrollTo(event.currentTarget.scrollLeft);

      bodyRef.current?.scrollTo({
        scrollLeft: event.currentTarget.scrollLeft,
        scrollTop: event.currentTarget.scrollTop,
      });

      if (innerForwardRef.current) {
        // Keep full size container in sync with the height calculation in react-window is doing
        if (containerHeight !== innerForwardRef.current.clientHeight + shrinkBodyHeightBy) {
          setContainerHeight(innerForwardRef.current.clientHeight + shrinkBodyHeightBy);
        }
      }
    },
    [headerRef, totalsRef, bodyRef, innerForwardRef, containerHeight, shrinkBodyHeightBy, setContainerHeight]
  );

export default useScrollHandler;
