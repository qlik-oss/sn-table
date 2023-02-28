import { useCallback } from 'react';
import { VariableSizeList } from 'react-window';
import { BodyRef } from '../types';

const useScrollHandler = (
  headerRef: React.RefObject<VariableSizeList<any>>,
  totalsRef: React.RefObject<VariableSizeList<any>>,
  bodyRef: React.RefObject<BodyRef>
) => {
  return useCallback(
    (event: React.SyntheticEvent) => {
      const { scrollHeight, clientHeight, scrollTop, scrollLeft } = event.currentTarget;
      const ratio = Math.max(0, Math.min(1, scrollTop / (scrollHeight - clientHeight)));

      bodyRef.current?.interpolatedScrollTo(Number.isNaN(ratio) ? 0 : ratio, scrollLeft);

      headerRef.current?.scrollTo(scrollLeft);

      totalsRef.current?.scrollTo(scrollLeft);
    },
    [headerRef, totalsRef, bodyRef]
  );
};

export default useScrollHandler;
