/* eslint jsx-a11y/no-static-element-interactions: 0 jsx-a11y/mouse-events-have-key-events: 0 */
import React from 'react';
import { areEqual } from 'react-window';
import { Column, Row } from '../../../types';
import { CellStyle, GeneratedStyling } from '../../types';
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

  const { handleMouseDown, handleMouseOver, handleMouseUp, selectionStyling } = useSelector(datum, {
    backgroundColor: bodyStyle.backgroundColor,
  } as CellStyle);

  if (typeof datum === 'object') {
    const isLeftAligned = columns[columnIndex].align === 'left';

    return (
      <div
        style={{
          ...style,
          ...bodyStyle,
          ...selectionStyling,
          display: 'flex',
          alignItems: 'center',
          borderWidth: '0px 1px 1px 0px',
          justifyContent: columns[columnIndex].align,
          boxSizing: 'border-box',
          cursor: 'default',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOver={handleMouseOver}
        className={selectionStyling?.selectedCellClass}
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
          {datum.qText}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        ...style,
        ...bodyStyle,
        borderWidth: '0px 1px 1px 0px',
        boxSizing: 'border-box',
      }}
    />
  );
};

export default React.memo(Cell, areEqual);
