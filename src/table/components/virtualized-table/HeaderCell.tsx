import React from 'react';
import { Column } from '../../../types';

interface HeaderCellProps {
  columnIndex: number;
  style: React.CSSProperties;
  data: {
    columns: Column[];
  };
}

const HeaderCell = ({ columnIndex, style, data }: HeaderCellProps) => {
  const { columns } = data;
  const datum = columns[columnIndex];

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
          justifyContent: datum.align,
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
          {datum.label}
        </span>
      </div>
    );
  }

  return <div style={{ ...style, borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc' }} />;
};

export default HeaderCell;
