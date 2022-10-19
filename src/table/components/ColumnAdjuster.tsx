import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import { useContextSelector, TableContext } from '../context';
import { TableLayout } from '../../types';

interface AdjusterProps {
  rootElement: HTMLElement;
  columnIndex: number;
  model: EngineAPI.IGenericObject;
  layout: TableLayout;
}

function ColumnAdjuster({ rootElement, columnIndex, model, layout }: AdjusterProps) {
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const setColumnWidths = useContextSelector(TableContext, (value) => value.setColumnWidths);
  const localColumnWidth = useRef(columnWidths);

  let x = 0;
  let w = 0;

  const mouseMoveHandler = (e: MouseEvent) => {
    // Determine how far the mouse has been moved
    const dx = e.clientX - x;
    const newColumnWidths = [...columnWidths];
    if (columnWidths[columnIndex] <= 1) {
      const tableElement = rootElement.getElementsByClassName('sn-table-cell')[0];
      const styles = window.getComputedStyle(tableElement);
      const dPercentage = (dx / parseInt(styles.width, 10)) * columnWidths[columnIndex];
      newColumnWidths[columnIndex] = w + dPercentage;
      if (layout.resize.fitToView) newColumnWidths[columnIndex + 1] = w - dPercentage;
    } else {
      newColumnWidths[columnIndex] = w + dx;
    }

    // Update the width of column
    localColumnWidth.current = newColumnWidths;
    setColumnWidths(newColumnWidths);
  };

  // When user releases the mouse, remove the existing event listeners
  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    const qOp = (layout.qHyperCube.columnWidths.length ? 'replace' : 'add') as EngineAPI.NxPatchOpType;
    const patches = [
      {
        qPath: '/qHyperCubeDef/columnWidths',
        qOp,
        qValue: JSON.stringify(localColumnWidth.current),
      },
    ];

    model.applyPatches(patches, true);
  };

  const mouseDownHandler = (e: React.MouseEvent) => {
    // Get the current mouse position
    x = e.clientX;
    // Calculate the current width of column
    w = columnWidths[columnIndex]; // parseInt(styles.width, 10);
    // Attach listeners for document's events
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  return (
    <Box
      key={`adjuster-${columnIndex}`}
      sx={{
        left: `100%`,
        marginLeft: '-4px',
        height: '100%',
        width: '8px',
        background: 'red',
        opacity: 0.5,
        position: 'absolute',
        zIndex: 3,
        cursor: 'col-resize',
        top: '0px',
      }}
      onMouseDown={(evt) => mouseDownHandler(evt)}
    />
  );
}
export default ColumnAdjuster;
