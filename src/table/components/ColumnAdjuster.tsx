import React, { useRef } from 'react';
import { AdjusterProps } from '../types';
import { useContextSelector, TableContext } from '../context';
import { AdjusterHitArea, AdjusterHeadBorder, AdjusterBodyBorder } from '../styles';

// TODO: now we assume correct column order, need to respect that later
const ColumnAdjuster = ({ column, isLastColumn, updateColumnWidth }: AdjusterProps) => {
  const { dataColIdx } = column;
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const setColumnWidths = useContextSelector(TableContext, (value) => value.setColumnWidths);
  const tempWidths = useRef({ columnWidths, initX: 0, initWidth: 0 });

  const mouseMoveHandler = (evt: MouseEvent) => {
    // Need to create a new array for the context to detect the change
    const newColumnWidths = [...tempWidths.current.columnWidths];
    // Add the change in x position to the column width at mouse down
    newColumnWidths[dataColIdx] = tempWidths.current.initWidth + evt.clientX - tempWidths.current.initX;
    tempWidths.current.columnWidths = newColumnWidths;
    setColumnWidths(newColumnWidths);
  };

  const mouseUpHandler = (evt: MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    if (tempWidths.current.columnWidths[dataColIdx] !== tempWidths.current.initWidth)
      updateColumnWidth({ type: 'pixels', widthPx: tempWidths.current.columnWidths[dataColIdx] }, column);
  };

  const mouseDownHandler = (evt: React.MouseEvent) => {
    // Prevent other header mouse down listeners
    evt.preventDefault();
    evt.stopPropagation();

    tempWidths.current = { initX: evt.clientX, initWidth: columnWidths[dataColIdx], columnWidths };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const handleDoubleClick = () => updateColumnWidth({ type: 'hug' }, column);

  return (
    <AdjusterHitArea
      isLastColumn={isLastColumn}
      key={`adjuster-${dataColIdx}`}
      onMouseDown={mouseDownHandler}
      onDoubleClick={handleDoubleClick}
    >
      <AdjusterHeadBorder className="sn-table-head-border" />
      <AdjusterBodyBorder className="sn-table-body-border" />
    </AdjusterHitArea>
  );
};
export default ColumnAdjuster;
