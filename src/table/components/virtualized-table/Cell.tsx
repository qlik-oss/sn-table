/* eslint jsx-a11y/no-static-element-interactions: 0 jsx-a11y/mouse-events-have-key-events: 0 */
import React from 'react';
import { areEqual } from 'react-window';
import { Column, Row } from '../../../types';
import { CellStyle, GeneratedStyling } from '../../types';
import useSelector from './hooks/use-selector';
import EmptyCell from './EmptyCell';

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
    return (
      <div
        className={`sn-table-cell ${selectionStyling?.selectedCellClass ?? ''}`}
        style={{
          ...style,
          ...bodyStyle,
          ...selectionStyling,
          display: 'flex',
          alignItems: 'center',
          borderWidth: '0px',
          borderBottomWidth: datum.isLastRow ? '0px' : '1px',
          borderRightWidth: datum.isLastColumn ? '0px' : '1px',
          borderStyle: 'solid',
          justifyContent: columns[columnIndex].align,
          padding: '0px 14px',
          boxSizing: 'border-box',
          cursor: 'default',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOver={handleMouseOver}
      >
        <span
          className="sn-table-cell-text"
          style={{
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
    <EmptyCell
      style={{
        ...style,
        ...bodyStyle,
        borderWidth: '0px 1px 1px 0px',
        borderStyle: 'solid',
        boxSizing: 'border-box',
      }}
    />
  );
};

export default React.memo(Cell, areEqual);
