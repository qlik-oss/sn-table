import React from "react";
import { TableContext, useContextSelector } from "../context";

interface ScrollableContainerProps {
  children: (JSX.Element | null)[] | JSX.Element;
  height: number;
  width: number;
  onScroll: (event: React.SyntheticEvent<Element, Event>) => void;
}

const ScrollableContainer = React.forwardRef<HTMLDivElement, ScrollableContainerProps>((props, ref) => {
  const { children, width, height, onScroll } = props;
  const { interactions } = useContextSelector(TableContext, (value) => value.baseProps);

  return (
    <div
      data-testid="scrollable-container"
      ref={ref}
      style={{
        overflow: interactions.active ? "auto" : "hidden",
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
