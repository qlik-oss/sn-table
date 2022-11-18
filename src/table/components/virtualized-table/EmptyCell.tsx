import React from 'react';
import { areEqual } from 'react-window';
import { GeneratedStyling } from '../../types';

interface EmptyCellProps {
  style: React.CSSProperties;
  emptyStyle: GeneratedStyling;
}

const EmptyCell = ({ emptyStyle, style }: EmptyCellProps) => (
  <div
    style={{
      ...style,
      borderColor: emptyStyle.borderColor,
      borderStyle: emptyStyle.borderStyle,
      borderWidth: '0px 1px 1px 0px',
      boxSizing: 'border-box',
    }}
  />
);

export default React.memo(EmptyCell, areEqual);
