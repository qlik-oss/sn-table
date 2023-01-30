import React from 'react';
import { areEqual } from 'react-window';

interface EmptyCellProps {
  style: React.CSSProperties;
  rowIndex: number;
  columnIndex: number;
}

const EmptyCell = ({ style, rowIndex, columnIndex }: EmptyCellProps) => (
  <div
    data-row-index={rowIndex}
    data-col-index={columnIndex}
    className="sn-table-cell"
    style={{
      ...style,
      borderWidth: '0px 1px 1px 0px',
      boxSizing: 'border-box',
    }}
  />
);

export default React.memo(EmptyCell, areEqual);
