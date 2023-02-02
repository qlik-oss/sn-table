import { useCallback, useRef } from 'react';
import { VariableSizeList } from 'react-window';
import { BodyRef } from '../types';

const useScrollHandler = (
  headerRef: React.RefObject<VariableSizeList<any>>,
  totalsRef: React.RefObject<VariableSizeList<any>>,
  bodyRef: React.RefObject<BodyRef>
) => {
  const prevScrollTop = useRef(0);
  return useCallback(
    (event: React.SyntheticEvent) => {
      const { scrollHeight, clientHeight, scrollTop, scrollLeft } = event.currentTarget;
      const ratio = Math.max(0, Math.min(1, scrollTop / (scrollHeight - clientHeight)));

      bodyRef.current?.interpolatedScrollTo(ratio, scrollLeft);

      headerRef.current?.scrollTo(scrollLeft);

      totalsRef.current?.scrollTo(scrollLeft);

      prevScrollTop.current = scrollTop;
    },
    [headerRef, totalsRef, bodyRef]
  );
};

export default useScrollHandler;
