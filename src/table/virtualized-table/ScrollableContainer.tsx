import React from 'react';
import { useContextSelector, TableContext } from '../context';

interface ScrollableContainerProps {
  children: (JSX.Element | null)[] | JSX.Element;
  height: number;
  width: number;
  onScroll: (event: React.SyntheticEvent<Element, Event>) => void;
}

const ScrollableContainer = React.forwardRef<HTMLDivElement, ScrollableContainerProps>((props, ref) => {
  const { children, width, height, onScroll } = props;
  const { constraints } = useContextSelector(TableContext, (value) => value.baseProps);

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
