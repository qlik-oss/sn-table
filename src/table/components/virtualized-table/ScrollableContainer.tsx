import { stardust } from '@nebula.js/stardust';
import React from 'react';

interface ScrollableContainerProps {
  children: (JSX.Element | null)[] | JSX.Element;
  height: number;
  width: number;
  constraints: stardust.Constraints;
  onScroll: (event: React.SyntheticEvent<Element, Event>) => void;
}

const ScrollableContainer = React.forwardRef<HTMLDivElement, ScrollableContainerProps>((props, ref) => {
  const { children, width, height, constraints, onScroll } = props;

  return (
    <div
      data-testid="scrollable-container"
      ref={ref}
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
});

export default ScrollableContainer;
