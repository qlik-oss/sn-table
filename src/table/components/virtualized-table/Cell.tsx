import React from 'react';
import { areEqual } from 'react-window';
import { Column, Row } from '../../../types';
import { GeneratedStyling } from '../../types';

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    rowsInPage: Row[];
    columns: Column[];
    bodyStyle: GeneratedStyling;
  };
}

const Cell = ({ columnIndex, rowIndex, style, data }: CellProps) => {
  const { rowsInPage, columns, bodyStyle } = data;
  const datum = rowsInPage[rowIndex]?.[`col-${columnIndex}`];

  if (datum) {
    const isLeftAligned = columns[columnIndex].align === 'left';

    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          borderColor: bodyStyle.borderColor,
          borderStyle: bodyStyle.borderStyle,
          borderWidth: `0px 1px 1px 0px`,
          justifyContent: columns[columnIndex].align,
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            fontSize: bodyStyle.fontSize,
            fontFamily: bodyStyle.fontFamily,
            color: bodyStyle.color,
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

  return (
    <div
      style={{
        ...style,
        borderColor: bodyStyle.borderColor,
        borderStyle: bodyStyle.borderStyle,
        borderWidth: `0px 1px 1px 0px`,
        boxSizing: 'border-box',
      }}
    />
  );
};

export default React.memo(Cell, areEqual);
