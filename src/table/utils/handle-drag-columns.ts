import React, { DragEvent } from 'react';
import extend from 'extend';
import { storeColumnWidths, updateColumnInfoOrders, fixTableHypercubeOrders } from './columns-sorting-util';
import saveSoftProperties from './save-soft-properties';

type Column = {
  width: number;
  dataColIdx: number;
};

type DragStartProps = {
  event: DragEvent;
  layout: any;
  cellRef: React.RefObject<HTMLTableElement>;
  headRowRef: React.RefObject<HTMLTableElement>;
  cell: Column;
};

type DragOverProps = {
  event: DragEvent;
  model: EngineAPI.IGenericObject;
  rtl: boolean;
  columns: Column[];
  setEngagedColumn: (i: number) => void;
};

const applyColumnOrderSoftPatch = (model: any, add: string, columnOrder: number[]) => {
  const op = add ? 'add' : 'replace';

  const patches = [
    {
      qPath: '/qHyperCubeDef/qColumnOrder',
      qOp: op.toString(),
      qValue: JSON.stringify(columnOrder),
    },
  ];

  model.applyPatches(patches, true);
};

let tableWidth: number;
let column: Column;
let startPosition: number;
let cellXPositon: number;
let order: Array<number>;

export const handleDragStart = ({ event, layout, cellRef, headRowRef, cell }: DragStartProps) => {
  tableWidth = headRowRef.current!.clientWidth;
  column = cell;
  cellXPositon = cellRef.current!.offsetLeft;
  startPosition = event.clientX;
  order = layout.qHyperCube.qColumnOrder;
};

export const handleDragOver = ({ event, rtl, columns, setEngagedColumn }: DragOverProps) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  // compute new visible index for the reordering column
  let index = 0;
  let offset = 0;
  const moved = rtl
    ? tableWidth - column.width - (cellXPositon + event.clientX - startPosition)
    : cellXPositon + event.clientX - startPosition;
  const halfWidth = column.width / 2;
  const columnCenter = moved + halfWidth;
  let i;
  let currentCenter;
  let nextCenter;
  for (i = 0; i < columns.length; ++i) {
    if (columns[i].dataColIdx === column.dataColIdx) {
      // eslint-disable-next-line no-continue
      continue;
    }
    currentCenter = offset + halfWidth;
    nextCenter = offset + columns[i].width + halfWidth;
    if (Math.abs(currentCenter - columnCenter) < Math.abs(nextCenter - columnCenter)) {
      break;
    }
    index += 1;
    offset += columns[i].width;
  }
  const currentIndex = columns.indexOf(column);
  let visibleMapping: number[];
  let newMapping: number[];
  let newOrder: number[];
  if (currentIndex !== index) {
    visibleMapping = columns.map((h) => order.indexOf(h.dataColIdx));
    newMapping = visibleMapping.slice();
    // move the column from visible position at prevIndex to index
    newMapping.splice(index, 0, newMapping.splice(currentIndex, 1)[0]);
    columns.splice(index, 0, columns.splice(currentIndex, 1)[0]);
    newOrder = order.slice();
    newMapping.forEach((m, id) => {
      newOrder[visibleMapping[id]] = order[m];
    });
    order = newOrder;
    setEngagedColumn(index);
  }
};

export const handleDragEnd = (model: EngineAPI.IGenericObject, setEngagedColumn: (arg0: undefined) => void) => {
  applyColumnOrderSoftPatch(model, 'replace', order);
  model.getEffectiveProperties().then((properties: EngineAPI.IGenericObjectProperties) => {
    const oldProperties = extend(true, {}, properties);
    storeColumnWidths(properties.qHyperCubeDef);
    fixTableHypercubeOrders(properties.qHyperCubeDef);
    updateColumnInfoOrders(properties.qHyperCubeDef);
    saveSoftProperties(model, oldProperties, properties);
  });
  setEngagedColumn(undefined);
};
