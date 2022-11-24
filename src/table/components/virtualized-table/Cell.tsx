/* eslint jsx-a11y/no-static-element-interactions: 0 jsx-a11y/mouse-events-have-key-events: 0 */
import React from 'react';
import { areEqual } from 'react-window';
import { Column, Row } from '../../../types';
import { GeneratedStyling } from '../../types';
import useSelector from './hooks/use-selector';

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

  const { handleMouseDown, handleMouseOver, handleMouseUp, selectionStyling } = useSelector(datum);

  if (typeof datum === 'object') {
    const isLeftAligned = columns[columnIndex].align === 'left';

    return (
      <div
        style={{
          ...style,
          ...selectionStyling,
          display: 'flex',
          alignItems: 'center',
          borderColor: bodyStyle.borderColor,
          borderStyle: bodyStyle.borderStyle,
          borderWidth: '0px 1px 1px 0px',
          justifyContent: columns[columnIndex].align,
          boxSizing: 'border-box',
          cursor: 'default',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOver={handleMouseOver}
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
          {datum.qText}
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
        borderWidth: '0px 1px 1px 0px',
        boxSizing: 'border-box',
      }}
    />
  );
};

export default React.memo(Cell, areEqual);
