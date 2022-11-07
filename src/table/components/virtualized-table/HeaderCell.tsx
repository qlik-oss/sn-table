import React from 'react';
import { Column } from '../../../types';
import { GeneratedStyling } from '../../types';

interface HeaderCellProps {
  columnIndex: number;
  style: React.CSSProperties;
  data: {
    columns: Column[];
    headerStyle: GeneratedStyling;
  };
}

const HeaderCell = ({ columnIndex, style, data }: HeaderCellProps) => {
  const { columns, headerStyle } = data;
  const datum = columns[columnIndex];

  if (datum) {
    const isLeftAligned = columns[columnIndex].align === 'left';

    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          borderColor: headerStyle.borderColor,
          borderStyle: headerStyle.borderStyle,
          borderWidth: '0px 1px 0px 0px',
          justifyContent: datum.align,
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            fontSize: headerStyle.fontSize,
            fontFamily: headerStyle.fontFamily,
            color: headerStyle.color,
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

  return (
    <div
      style={{
        ...style,
        borderColor: headerStyle.borderColor,
        borderStyle: headerStyle.borderStyle,
        borderWidth: '0px 1px 0px 0px',
      }}
    />
  );
};

export default HeaderCell;
