import { stardust } from '@nebula.js/stardust';
import React from 'react';
import { GeneratedStyling } from '../../types';

interface ScrollableContainerProps {
  children: (JSX.Element | null)[] | JSX.Element;
  forwardRef: React.RefObject<HTMLDivElement>;
  height: number;
  width: number;
  style: GeneratedStyling;
  constraints: stardust.Constraints;
  onScroll: (event: React.SyntheticEvent<Element, Event>) => void;
}

const ScrollableContainer = ({
  children,
  width,
  height,
  style,
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
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: style.borderColor,
        // boxSizing: 'border-box',
      }}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
};

export default ScrollableContainer;
