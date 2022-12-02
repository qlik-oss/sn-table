import { useCallback, useRef } from 'react';

interface OnScroll {
  scrollLeft: number;
  scrollTop: number;
}

export enum ScrollDirection {
  Left = 'Left',
  Right = 'Right',
  Up = 'Up',
  Down = 'Down',
}

const useScrollDirection = () => {
  const prevScrollLeft = useRef(0);
  const prevScrollTop = useRef(0);
  const scrollDirection = useRef(ScrollDirection.Down);

  const scrollHandler = useCallback(
    ({ scrollTop, scrollLeft }: OnScroll) => {
      if (scrollTop > prevScrollTop.current) {
        scrollDirection.current = ScrollDirection.Down;
      } else if (scrollTop < prevScrollTop.current) {
        scrollDirection.current = ScrollDirection.Up;
      } else if (scrollLeft > prevScrollLeft.current) {
        scrollDirection.current = ScrollDirection.Right;
      } else if (scrollLeft < prevScrollLeft.current) {
        scrollDirection.current = ScrollDirection.Left;
      }

      prevScrollTop.current = scrollTop;
      prevScrollLeft.current = scrollLeft;
    },
    [prevScrollTop, prevScrollLeft, scrollDirection]
  );

  return {
    scrollHandler,
    scrollDirection,
  };
};

export default useScrollDirection;
