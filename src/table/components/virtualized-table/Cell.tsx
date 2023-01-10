/* eslint jsx-a11y/no-static-element-interactions: 0 jsx-a11y/mouse-events-have-key-events: 0 */
import React from 'react';
import { areEqual } from 'react-window';
import { Column, Row } from '../../../types';
import useSelector from './hooks/use-selector';
import EmptyCell from './EmptyCell';
import getCellStyle from './utils/get-cell-style';
import { BodyStyle } from './types';

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    rowsInPage: Row[];
    columns: Column[];
    bodyStyle: BodyStyle;
    hoverIndex: number;
    setHoverIndex: React.Dispatch<React.SetStateAction<number>>;
    showHoverEffect: boolean;
  };
}

const Cell = ({ columnIndex, rowIndex, style, data }: CellProps) => {
  const { rowsInPage, columns, bodyStyle, hoverIndex, setHoverIndex, showHoverEffect } = data;
  const datum = rowsInPage[rowIndex]?.[`col-${columnIndex}`];

  const { handleMouseDown, handleMouseOver, handleMouseUp, cellSelectionState } = useSelector(datum);

  if (typeof datum === 'object') {
    const isHoveringOnRow = showHoverEffect && hoverIndex === rowIndex;
    const cellStyle = getCellStyle(isHoveringOnRow, cellSelectionState, bodyStyle);

    return (
      <div
        className={`sn-table-cell ${cellSelectionState}`}
        style={{
          ...style,
          ...cellStyle,
          display: 'flex',
          alignItems: 'center',
          borderWidth: '0px 1px 1px 0px',
          borderStyle: 'solid',
          justifyContent: columns[columnIndex].align,
          padding: '0px 14px',
          boxSizing: 'border-box',
          cursor: 'default',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOver={handleMouseOver}
        onMouseEnter={showHoverEffect ? () => setHoverIndex(rowIndex) : undefined}
        onMouseLeave={showHoverEffect ? () => setHoverIndex(-1) : undefined}
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
