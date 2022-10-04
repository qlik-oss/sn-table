import React from 'react';
import { Column, Row } from '../../../types';

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    rows: Row[];
    columns: Column[];
  };
}

const Cell = ({ columnIndex, rowIndex, style, data }: CellProps) => {
  const { rows, columns } = data;
  const datum = rows[rowIndex]?.[`col-${columnIndex}`];

  if (datum) {
    const isLeftAligned = columns[columnIndex].align === 'left';

    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          borderRight: '1px solid #ccc',
          borderBottom: '1px solid #ccc',
          justifyContent: columns[columnIndex].align,
        }}
      >
        <span
          style={{
            paddingLeft: isLeftAligned ? '14px' : '4px',
            paddingRight: isLeftAligned ? '4px' : '14px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {typeof datum === 'string' ? datum : datum.qText}
        </span>
      </div>
    );
  }

  return <div style={{ ...style, borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc' }} />;
};

export default Cell;
