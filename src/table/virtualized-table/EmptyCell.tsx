import React from 'react';
import { areEqual } from 'react-window';

interface EmptyCellProps {
  style: React.CSSProperties;
}

const EmptyCell = ({ style }: EmptyCellProps) => (
  <div
    className="sn-table-cell"
    style={{
      ...style,
      borderWidth: '0px 1px 1px 0px',
      boxSizing: 'border-box',
    }}
  />
);

export default React.memo(EmptyCell, areEqual);
