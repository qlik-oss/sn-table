import React from 'react';
import { Column } from '../../../types';
import { GeneratedStyling } from '../../types';

interface HeaderCellProps {
  index: number;
  style: React.CSSProperties;
  data: {
    columns: Column[];
    headerStyle: GeneratedStyling;
  };
}

const HeaderCell = ({ index, style, data }: HeaderCellProps) => {
  const { columns, headerStyle } = data;
  const datum = columns[index];

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'solid',
        borderStyle: 'solid',
        borderWidth: '0px 1px 0px 0px',
        padding: '0px 14px',
        justifyContent: datum.align,
        boxSizing: 'border-box',
        cursor: 'default',
      }}
    >
      <span
        style={{
          fontSize: headerStyle.fontSize,
          fontFamily: headerStyle.fontFamily,
          color: headerStyle.color,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {datum.label}
      </span>
    </div>
  );
};

export default HeaderCell;
