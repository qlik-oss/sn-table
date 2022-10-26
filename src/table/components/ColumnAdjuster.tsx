import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import { useContextSelector, TableContext } from '../context';
import { Column, TableLayout } from '../../types';

interface AdjusterProps {
  column: Column;
  model: EngineAPI.IGenericObject;
  layout: TableLayout;
}

// TODO: now we assume correct column order, need to respect that later
function ColumnAdjuster({ column: { isDim, dataColIdx }, model, layout: { qHyperCube } }: AdjusterProps) {
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const setColumnWidths = useContextSelector(TableContext, (value) => value.setColumnWidths);
  const localColumnWidths = useRef(columnWidths);

  // const {  }
  let x = 0;
  let w = 0;

  const mouseMoveHandler = (e: MouseEvent) => {
    // Determine how far the mouse has been moved
    const dx = e.clientX - x;
    const newColumnWidths = [...columnWidths];
    newColumnWidths[dataColIdx] = w + dx;

    // Update the width of column
    localColumnWidths.current = newColumnWidths;
    setColumnWidths(newColumnWidths);
  };

  // When user releases the mouse, remove the existing event listeners
  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    const index = isDim ? dataColIdx : dataColIdx - qHyperCube.qDimensionInfo.length;
    const columnPath = `/qHyperCubeDef/${isDim ? 'qDimensions' : 'qMeasures'}/${index}/qDef/`;
    // const qOp = (qHyperCube.qDimensionInfo[index].columnSize ? 'replace' : 'add') as EngineAPI.NxPatchOpType;
    const patches = [
      {
        qPath: `${columnPath}columnSize`,
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        qValue: localColumnWidths.current[dataColIdx].toString(),
      },
      {
        qPath: `${columnPath}columnSizeType`,
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        // eslint-disable-next-line prettier/prettier, no-useless-escape
        qValue: '"pixels"',
      },
    ];

    model.applyPatches(patches, true);
  };

  const mouseDownHandler = (e: React.MouseEvent) => {
    // Get the current mouse position
    x = e.clientX;
    // Calculate the current width of column
    w = columnWidths[dataColIdx];
    // Attach listeners for document's events
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseDoubleClickHandler = (e: React.MouseEvent) => {
    const index = isDim ? dataColIdx : dataColIdx - qHyperCube.qDimensionInfo.length;
    const columnPath = `/qHyperCubeDef/${isDim ? 'qDimensions' : 'qMeasures'}/${index}/qDef/`;
    // const qOp = (qHyperCube.qDimensionInfo[index].columnSize ? 'replace' : 'add') as EngineAPI.NxPatchOpType;
    const patches = [
      {
        qPath: `${columnPath}columnSizeType`,
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        // eslint-disable-next-line prettier/prettier, no-useless-escape
        qValue: '"hug"',
      },
    ];

    console.log('double');
    model.applyPatches(patches, true);
  };

  return (
    <Box
      key={`adjuster-${dataColIdx}`}
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
      onMouseDown={mouseDownHandler}
      onDoubleClick={mouseDoubleClickHandler}
    />
  );
}
export default ColumnAdjuster;
