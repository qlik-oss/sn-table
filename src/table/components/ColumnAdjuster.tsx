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
  const tempWidths = useRef({ columnWidths, initX: 0, initWidth: 0 });

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
    // Need to create a new array for the context to detect the change
    const newColumnWidths = [...tempWidths.current.columnWidths];
    // Add the change in x position to the column width at mouse down
    newColumnWidths[dataColIdx] = tempWidths.current.initWidth + e.clientX - tempWidths.current.initX;
    tempWidths.current.columnWidths = newColumnWidths;
    setColumnWidths(newColumnWidths);
  };

  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    if (tempWidths.current.columnWidths[dataColIdx] !== tempWidths.current.initWidth)
      applyPatch({ type: 'pixels', widthPx: tempWidths.current.columnWidths[dataColIdx] });
  };

  const mouseDownHandler = (e: React.MouseEvent) => {
    // Prevent other header mouse down listeners
    e.preventDefault();
    e.stopPropagation();
    tempWidths.current = { initX: e.clientX, initWidth: columnWidths[dataColIdx], columnWidths };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  return (
    <AdjusterHitArea
      isLastColumn={isLastColumn}
      key={`adjuster-${dataColIdx}`}
      onMouseDown={mouseDownHandler}
      onDoubleClick={() => applyPatch({ type: 'hug' })}
    >
      <AdjusterHeadBorder className="sn-table-head-border" />
      <AdjusterBodyBorder className="sn-table-body-border" />
    </AdjusterHitArea>
  );
}
export default ColumnAdjuster;
