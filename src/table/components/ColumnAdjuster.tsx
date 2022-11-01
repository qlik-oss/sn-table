import React, { useRef } from 'react';
import { Column, TableLayout } from '../../types';
import { useContextSelector, TableContext } from '../context';
import { AdjusterHitArea, AdjusterHeadBorder, AdjusterBodyBorder } from '../styles';

interface AdjusterProps {
  column: Column;
  layout: TableLayout;
  model: EngineAPI.IGenericObject;
  isLastColumn: boolean;
}

// TODO: now we assume correct column order, need to respect that later
function ColumnAdjuster({ column: { isDim, dataColIdx }, layout: { qHyperCube }, model, isLastColumn }: AdjusterProps) {
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const setColumnWidths = useContextSelector(TableContext, (value) => value.setColumnWidths);
  const localColumnWidths = useRef(columnWidths);

  let x = 0;
  let w = 0;

  const applyPatch = (newColumnSize: { type?: string; widthPx?: number }) => {
    const index = isDim ? dataColIdx : dataColIdx - qHyperCube.qDimensionInfo.length;
    const qPath = `/qHyperCubeDef/${isDim ? 'qDimensions' : 'qMeasures'}/${index}/qDef/columnSize`;
    const oldColumnSize = qHyperCube[isDim ? 'qDimensionInfo' : 'qMeasureInfo'][index].columnSize;
    const patch = oldColumnSize
      ? {
          qPath,
          qOp: 'Replace' as EngineAPI.NxPatchOpType,
          qValue: JSON.stringify({ ...oldColumnSize, ...newColumnSize }),
        }
      : {
          qPath,
          qOp: 'Add' as EngineAPI.NxPatchOpType,
          qValue: JSON.stringify(newColumnSize),
        };

    model.applyPatches([patch], true);
  };

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

    applyPatch({ type: 'pixels', widthPx: localColumnWidths.current[dataColIdx] });
  };

  const mouseDownHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Get the current mouse position
    x = e.clientX;
    // // Calculate the current width of column
    w = columnWidths[dataColIdx];
    // Attach listeners for document's events
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  return (
    <AdjusterHitArea
      isLastColumn={isLastColumn}
      key={`adjuster-${dataColIdx}`}
      onMouseDown={mouseDownHandler}
      // TODO: make sure that mouseDown/up waits for double
      onDoubleClick={() => applyPatch({ type: 'hug' })}
    >
      <AdjusterHeadBorder className="sn-table-head-border" />
      <AdjusterBodyBorder className="sn-table-body-border" />
    </AdjusterHitArea>
  );
}
export default ColumnAdjuster;
