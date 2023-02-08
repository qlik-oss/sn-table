import { useEffect, useState } from 'react';
import useOnPropsChange from './use-on-props-change';

const useScrollbarWidth = (ref: React.RefObject<HTMLDivElement>) => {
  const [xScrollbarWidth, setXScrollbarWidth] = useState(0);
  const [yScrollbarWidth, setYScrollbarWidth] = useState(0);
  const { offsetWidth = 0, offsetHeight = 0, clientWidth = 0, clientHeight = 0 } = ref.current ?? {};
  const widthDiff = offsetWidth - clientWidth;
  const heightDiff = offsetHeight - clientHeight;

  useEffect(() => {
    if (ref.current) {
      setYScrollbarWidth(ref.current.offsetWidth - ref.current.clientWidth);
      setXScrollbarWidth(ref.current.offsetHeight - ref.current.clientHeight);
    }
  }, [ref]);

  useOnPropsChange(() => {
    setYScrollbarWidth(widthDiff);
    setXScrollbarWidth(heightDiff);
  }, [widthDiff, heightDiff]);

  return { xScrollbarWidth, yScrollbarWidth };
};

export default useScrollbarWidth;
