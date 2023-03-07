import React, { useRef } from 'react';
import { AdjusterProps } from '../../types';
import { useContextSelector, TableContext } from '../../context';
import { AdjusterHitArea, AdjusterHeadBorder, AdjusterBodyBorder } from './styles';
import { ColumnWidthTypes, MIN_COLUMN_WIDTH, PAGINATION_HEIGHT, KeyCodes } from '../../constants';
import { BORDER_WIDTH } from '../../styling-defaults';
import { preventDefaultBehavior } from '../../utils/keyboard-utils';
import { focusHeadMenuButton } from '../../utils/accessibility-utils';

/**
 * Component that is placed on top of column border.
 * The vertical borders in the header can be used to change the column width.
 * When you start dragging, mouse move and mouse up listeners are added.
 * While dragging the current column is updated, and on mouse up all other columns are updated.
 */
const ColumnAdjuster = ({ column, isLastColumn }: AdjusterProps) => {
  const { pageColIdx } = column;
  const { rootElement, applyColumnWidths, constraints } = useContextSelector(TableContext, (value) => value.baseProps);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const setColumnWidths = useContextSelector(TableContext, (value) => value.setColumnWidths);
  const tempWidths = useRef({ columnWidth: 0, initX: 0, initWidth: 0 });
  const borderHeight = rootElement.getBoundingClientRect().height - PAGINATION_HEIGHT + BORDER_WIDTH;

  if (!applyColumnWidths || constraints.active) return null;

  const updateWidth = (adjustedWidth: number) => {
    tempWidths.current.columnWidth = adjustedWidth;
    const newColumnWidths = [...columnWidths];
    newColumnWidths[pageColIdx] = adjustedWidth;
    setColumnWidths(newColumnWidths);
  };

  const confirmWidth = () => {
    if (tempWidths.current.columnWidth !== tempWidths.current.initWidth) {
      const newWidthData = { type: ColumnWidthTypes.PIXELS, pixels: tempWidths.current.columnWidth };
      applyColumnWidths(newWidthData, column);
    }
  };

  const mouseMoveHandler = (evt: MouseEvent) => {
    const deltaWidth = evt.clientX - tempWidths.current.initX;
    const adjustedWidth = Math.max(tempWidths.current.initWidth + deltaWidth, MIN_COLUMN_WIDTH);
    updateWidth(adjustedWidth);
  };

  const mouseUpHandler = (evt: MouseEvent) => {
    preventDefaultBehavior(evt);
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    confirmWidth();
  };

  const mouseDownHandler = (evt: React.MouseEvent) => {
    // evt.preventDefault();
    evt.stopPropagation();

    tempWidths.current = {
      initX: evt.clientX,
      initWidth: columnWidths[pageColIdx],
      columnWidth: columnWidths[pageColIdx],
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === KeyCodes.LEFT || event.key === KeyCodes.RIGHT) {
      const RESIZE_DISTANCE = 5;
      const initWidth = columnWidths[pageColIdx];
      const columnWidth = event.key === 'ArrowLeft' ? initWidth - RESIZE_DISTANCE : initWidth + RESIZE_DISTANCE;
      const adjustedWidth = Math.max(columnWidth, MIN_COLUMN_WIDTH);

      updateWidth(adjustedWidth);
    } else if (event.key === KeyCodes.SPACE || event.key === KeyCodes.ENTER) {
      preventDefaultBehavior(event);
      confirmWidth();
      focusHeadMenuButton(event);
    } else if (event.key === KeyCodes.ESC) {
      focusHeadMenuButton(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => focusHeadMenuButton(event);
  const handleFocus = () => {
    tempWidths.current.initWidth = columnWidths[pageColIdx];
  };
  const handleDoubleClick = () => applyColumnWidths({ type: ColumnWidthTypes.HUG }, column);

  return (
    <AdjusterHitArea
      id="adjuster-hit-area"
      isLastColumn={isLastColumn}
      key={`adjuster-${pageColIdx}`}
      onKeyDown={handleKeyDown}
      onMouseDown={mouseDownHandler}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onDoubleClick={handleDoubleClick}
      data-testid="sn-table-column-adjuster"
    >
      <AdjusterHeadBorder className="sn-table-adjuster-head-border" />
      <AdjusterBodyBorder borderHeight={borderHeight} className="sn-table-adjuster-head-border" />
    </AdjusterHitArea>
  );
};

export default ColumnAdjuster;
