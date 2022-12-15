import { useCallback } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';

const useScrollHandler = (
  headerRef: React.RefObject<VariableSizeList<any>>,
  totalsRef: React.RefObject<VariableSizeList<any>>,
  bodyRef: React.RefObject<VariableSizeGrid<any>>,
  innerForwardRef: React.RefObject<HTMLDivElement>,
  totalHeight: number,
  shrinkBodyHeightBy: number,
  setTotalHeight: React.Dispatch<React.SetStateAction<number>>
) =>
  useCallback(
    (event: React.SyntheticEvent) => {
      if (headerRef.current) {
        headerRef.current.scrollTo(event.currentTarget.scrollLeft);
      }

      if (totalsRef.current) {
        totalsRef.current.scrollTo(event.currentTarget.scrollLeft);
      }

      if (bodyRef.current) {
        bodyRef.current.scrollTo({
          scrollLeft: event.currentTarget.scrollLeft,
          scrollTop: event.currentTarget.scrollTop,
        });
      }

      if (innerForwardRef.current) {
        // Keep full size container in sync with the height calculation in react-window is doing
        if (totalHeight !== innerForwardRef.current.clientHeight) {
          setTotalHeight(innerForwardRef.current.clientHeight + shrinkBodyHeightBy);
        }
      }
    },
    [headerRef, totalsRef, bodyRef, innerForwardRef, totalHeight, shrinkBodyHeightBy, setTotalHeight]
  );

export default useScrollHandler;
