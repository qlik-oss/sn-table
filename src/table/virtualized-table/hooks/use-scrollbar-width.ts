import { useRef, useState } from 'react';

const useScrollbarWidth = (ref: React.RefObject<HTMLDivElement>) => {
  const prevWidth = useRef({ x: 0, y: 0 });
  const [xScrollbarWidth, setXScrollbarWidth] = useState(0);
  const [yScrollbarWidth, setYScrollbarWidth] = useState(0);

  if (ref.current) {
    const widthDiff = ref.current.offsetWidth - ref.current.clientWidth;
    const heightDiff = ref.current.offsetHeight - ref.current.clientHeight;

    if (prevWidth.current.y !== widthDiff) {
      setYScrollbarWidth(widthDiff);
      prevWidth.current.y = widthDiff;
    }

    if (prevWidth.current.x !== heightDiff) {
      setXScrollbarWidth(heightDiff);
      prevWidth.current.x = heightDiff;
    }
  }

  return { xScrollbarWidth, yScrollbarWidth };
};

export default useScrollbarWidth;
