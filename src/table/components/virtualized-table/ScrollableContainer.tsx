import { stardust } from '@nebula.js/stardust';
import React from 'react';

interface ScrollableContainerProps {
  children: (JSX.Element | null)[] | JSX.Element;
  forwardRef: React.RefObject<HTMLDivElement>;
  height: number;
  width: number;
  constraints: stardust.Constraints;
  onScroll: (event: React.SyntheticEvent<Element, Event>) => void;
}

const ScrollableContainer = ({
  children,
  width,
  height,
  forwardRef,
  constraints,
  onScroll,
}: ScrollableContainerProps): JSX.Element => {
  return (
    <div
      data-testid="scrollable-container"
      ref={forwardRef}
      style={{
        overflow: constraints.active ? 'hidden' : 'auto',
        width,
        height,
      }}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
};

export default ScrollableContainer;
