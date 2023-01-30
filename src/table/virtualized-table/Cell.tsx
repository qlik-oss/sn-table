/* eslint jsx-a11y/no-static-element-interactions: 0 jsx-a11y/mouse-events-have-key-events: 0 */
import React from 'react';
import { areEqual } from 'react-window';
import { Column, Row } from '../../types';
import { useContextSelector, TableContext } from '../context';
import useSelector from './hooks/use-selector';
import EmptyCell from './EmptyCell';
import CellText from '../components/CellText';
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
    isHoverEnabled: boolean;
  };
}

const Cell = ({ columnIndex, rowIndex, style, data }: CellProps) => {
  const { rowsInPage, columns, bodyStyle, isHoverEnabled } = data;
  const cell = rowsInPage[rowIndex]?.[`col-${columnIndex}`];

  const rowIsHovered = useContextSelector(TableContext, (value) => value.hoverIndex === rowIndex);
  const setHoverIndex = useContextSelector(TableContext, (value) => value.setHoverIndex);

  const { handleMouseDown, handleMouseOver, handleMouseUp, cellSelectionState } = useSelector(cell);

  if (typeof cell === 'object') {
    const cellStyle = getCellStyle(
      cell,
      columns[columnIndex],
      isHoverEnabled && rowIsHovered,
      cellSelectionState,
      bodyStyle
    );

    return (
      <div
        className={`sn-table-cell ${cellSelectionState}`}
        style={{
          ...style,
          ...cellStyle,
          display: 'flex',
          alignItems: 'center',
          borderWidth: '0px',
          borderBottomWidth: cell.isLastRow ? '0px' : '1px',
          borderRightWidth: cell.isLastColumn ? '0px' : '1px',
          borderStyle: 'solid',
          justifyContent: columns[columnIndex].align,
          padding: '4px 12px',
          boxSizing: 'border-box',
          cursor: 'default',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOver={handleMouseOver}
        onMouseEnter={isHoverEnabled ? () => setHoverIndex(rowIndex) : undefined}
        onMouseLeave={isHoverEnabled ? () => setHoverIndex(-1) : undefined}
      >
        <CellText singleLine>{cell.qText}</CellText>
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
