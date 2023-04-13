import { useLayoutEffect, useState } from 'react';
import { useContextSelector, TableContext } from '../../context';

const useScrollbarWidth = (ref: React.RefObject<HTMLDivElement>) => {
  const { layout } = useContextSelector(TableContext, (value) => value.baseProps);
  const [xScrollbarWidth, setXScrollbarWidth] = useState(0);
  const [yScrollbarWidth, setYScrollbarWidth] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      const { offsetWidth = 0, offsetHeight = 0, clientWidth = 0, clientHeight = 0 } = ref.current ?? {};
      const widthDiff = offsetWidth - clientWidth;
      const heightDiff = offsetHeight - clientHeight;
      setYScrollbarWidth(widthDiff);
      setXScrollbarWidth(heightDiff);
    }
  }, [ref, layout]);

  return { xScrollbarWidth, yScrollbarWidth };
};

export default useScrollbarWidth;
