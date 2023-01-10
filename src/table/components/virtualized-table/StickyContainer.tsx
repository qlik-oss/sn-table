import React from 'react';
import { StickyContainerRect } from './types';

interface StickyContainerProps {
  children: (JSX.Element | null)[] | JSX.Element;
  rect: StickyContainerRect;
}

const StickyContainer = ({ children, rect }: StickyContainerProps): JSX.Element => {
  return (
    <div
      data-testid="sticky-container"
      style={{
        position: 'sticky',
        top: '0px',
        left: '0px',
        width: rect.width,
        height: rect.height,
      }}
    >
      {children}
    </div>
  );
};

export default StickyContainer;
