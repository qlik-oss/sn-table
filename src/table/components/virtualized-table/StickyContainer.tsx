import React from 'react';
import { GeneratedStyling } from '../../types';
import { StickyContainerRect } from './types';

interface StickyContainerProps {
  children: (JSX.Element | null)[] | JSX.Element;
  rect: StickyContainerRect;
  style: GeneratedStyling;
}

const StickyContainer = ({ children, rect, style }: StickyContainerProps): JSX.Element => {
  return (
    <div
      data-testid="sticky-container"
      style={{
        position: 'sticky',
        top: '0px',
        left: '0px',
        width: rect.width,
        height: rect.height,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: style.borderColor,
      }}
    >
      {children}
    </div>
  );
};

export default StickyContainer;
