import React, { DragEvent } from 'react';
import { handleDragStart, handleDragOver, handleDragEnd } from '../handle-drag-columns';
import { TableLayout, HyperCube, Column } from '../../../types';
import { Model } from '../../types';
import * as ColumnsSortingsUtil from '../columns-sorting-util';
import * as SaveSoftProperties from '../save-soft-properties';

describe('handleDrag', () => {
  const startEvent = { clientX: 385 } as unknown as DragEvent;
  let dragoverEvent: DragEvent;
  let startLayout: TableLayout;
  let qHyperCube: HyperCube;
  let cellRef: React.RefObject<HTMLTableElement>;
  let headRowRef: React.RefObject<HTMLTableElement>;
  let cell: Column;
  let model: Model;
  const columns = [
    {
      width: 86,
      dataColIdx: 0,
    },
    {
      width: 86,
      dataColIdx: 1,
    },
    {
      width: 168,
      dataColIdx: 2,
    },
    {
      width: 245,
      dataColIdx: 3,
    },
  ] as unknown as Column[];
  const setEngagedColumn = jest.fn();
  jest.spyOn(ColumnsSortingsUtil, 'storeColumnWidths').mockImplementation(() => jest.fn());
  jest.spyOn(ColumnsSortingsUtil, 'fixTableHypercubeOrders').mockImplementation(() => jest.fn());
  jest.spyOn(ColumnsSortingsUtil, 'updateColumnInfoOrders').mockImplementation(() => jest.fn());
  jest.spyOn(SaveSoftProperties, 'default').mockImplementation();

  beforeEach(() => {
    qHyperCube = { qColumnOrder: [0, 1, 2, 3] } as unknown as HyperCube;
    startLayout = { qHyperCube } as unknown as TableLayout;
    cellRef = { current: { offsetLeft: 0 } } as React.RefObject<HTMLTableElement>;
    headRowRef = { current: { clientWidth: 500 } } as React.RefObject<HTMLTableElement>;
    cell = {
      width: 86,
      dataColIdx: 0,
    } as unknown as Column;
    model = {
      applyPatches: jest.fn(),
      getEffectiveProperties: async () => Promise.resolve({ qHyperCubeDef: {} }),
    } as unknown as Model;
    dragoverEvent = {
      clientX: 428,
      preventDefault: jest.fn(),
      dataTransfer: { dropEffect: null },
    } as unknown as DragEvent;
  });

  afterEach(() => jest.clearAllMocks());

  it('should not change columns when did not drag above new center position', () => {
    dragoverEvent = {
      clientX: 426,
      preventDefault: jest.fn(),
      dataTransfer: { dropEffect: null },
    } as unknown as DragEvent;
    handleDragStart({ event: startEvent, layout: startLayout, cellRef, headRowRef, cell });
    handleDragOver({ event: dragoverEvent, model, rtl: false, columns, setEngagedColumn });
    expect(model.applyPatches).toBeCalledTimes(0);
    expect(setEngagedColumn).toBeCalledTimes(0);
  });

  it('should change columns and set correct engaged column index when dragged above new center position', () => {
    handleDragStart({ event: startEvent, layout: startLayout, cellRef, headRowRef, cell });
    handleDragOver({ event: dragoverEvent, model, rtl: false, columns, setEngagedColumn });
    expect(model.applyPatches).toBeCalledTimes(1);
    expect(model.applyPatches).toBeCalledWith(
      [
        {
          qPath: '/qHyperCubeDef/qColumnOrder',
          qOp: 'replace',
          qValue: '[1,0,2,3]',
        },
      ],
      true
    );
    expect(setEngagedColumn).toBeCalledTimes(1);
    expect(setEngagedColumn).toBeCalledWith(1);
  });

  it('should save properties when drag is end', async () => {
    const event = { target: { blur: jest.fn() } } as unknown as DragEvent;
    await handleDragEnd({ event, model, setEngagedColumn });

    expect(ColumnsSortingsUtil.storeColumnWidths).toBeCalledTimes(1);
    expect(ColumnsSortingsUtil.storeColumnWidths).toBeCalledWith({});
    expect(ColumnsSortingsUtil.fixTableHypercubeOrders).toBeCalledTimes(1);
    expect(ColumnsSortingsUtil.fixTableHypercubeOrders).toBeCalledWith({});
    expect(ColumnsSortingsUtil.updateColumnInfoOrders).toBeCalledTimes(1);
    expect(ColumnsSortingsUtil.updateColumnInfoOrders).toBeCalledWith({});
    expect(SaveSoftProperties.default).toBeCalledTimes(1);
    expect(SaveSoftProperties.default).toBeCalledWith(model, { qHyperCubeDef: {} }, { qHyperCubeDef: {} });

    expect((event.target as HTMLTableElement).blur).toBeCalledTimes(1);
    expect(setEngagedColumn).toBeCalledTimes(1);
    expect(setEngagedColumn).toBeCalledWith(undefined);
  });
});
