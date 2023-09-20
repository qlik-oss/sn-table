import { useCallback, useRef } from "react";

interface OnScroll {
  scrollLeft: number;
  scrollTop: number;
}

export enum ScrollDirection {
  Left = "Left",
  Right = "Right",
  Up = "Up",
  Down = "Down",
  None = "None", // If the user is not scrolling in any direction, use this value
}

const useScrollDirection = () => {
  const prevScrollLeft = useRef(0);
  const prevScrollTop = useRef(0);
  const verticalScrollDirection = useRef(ScrollDirection.None);
  const horizontalScrollDirection = useRef(ScrollDirection.None);

  const scrollHandler = useCallback(
    ({ scrollTop, scrollLeft }: OnScroll) => {
      // Set vertical scroll direction
      if (scrollTop > prevScrollTop.current) {
        verticalScrollDirection.current = ScrollDirection.Down;
      } else if (scrollTop < prevScrollTop.current) {
        verticalScrollDirection.current = ScrollDirection.Up;
      } else {
        verticalScrollDirection.current = ScrollDirection.None;
      }

      // Set horizontal scroll direction
      if (scrollLeft > prevScrollLeft.current) {
        horizontalScrollDirection.current = ScrollDirection.Right;
      } else if (scrollLeft < prevScrollLeft.current) {
        horizontalScrollDirection.current = ScrollDirection.Left;
      } else {
        horizontalScrollDirection.current = ScrollDirection.None;
      }

      prevScrollTop.current = scrollTop;
      prevScrollLeft.current = scrollLeft;
    },
    [prevScrollTop, prevScrollLeft, verticalScrollDirection, horizontalScrollDirection]
  );

  return {
    scrollHandler,
    verticalScrollDirection,
    horizontalScrollDirection,
  };
};

export default useScrollDirection;
