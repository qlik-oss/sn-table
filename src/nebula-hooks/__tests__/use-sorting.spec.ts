import { sortingFactory } from '../use-sorting';
import { generateLayout } from '../../__test__/generate-test-data';
import { Column, TableLayout, HyperCube, SortDirection } from '../../types';

describe('use-sorting', () => {
  describe('sortingFactory', () => {
    it('should return undefined when model is undefined', async () => {
      const model = undefined;
      const hyperCube = {} as HyperCube;
      const changeSortOrder = sortingFactory(model, hyperCube);
      expect(changeSortOrder).toBeUndefined();
    });
  });

  describe('changeSortOrder', () => {
    let originalOrder: number[];
    let column: Column;
    let layout: TableLayout;
    let model: EngineAPI.IGenericObject;
    let changeSortOrder: ((column: Column, sortOrder?: SortDirection) => Promise<void>) | undefined;
    let expectedPatches: EngineAPI.INxPatch[];

    beforeEach(() => {
      originalOrder = [0, 1, 2, 3];
      layout = generateLayout(2, 2, 2);
      column = { isDim: true, colIdx: 1 } as Column;
      model = {
        applyPatches: jest.fn(),
        getEffectiveProperties: async () =>
          Promise.resolve({
            qHyperCubeDef: {
              qInterColumnSortOrder: originalOrder,
            } as unknown as HyperCube,
          }),
      } as unknown as EngineAPI.IGenericObject;
      changeSortOrder = sortingFactory(model, layout.qHyperCube);
      expectedPatches = [
        {
          qPath: '/qHyperCubeDef/qInterColumnSortOrder',
          qOp: 'Replace' as EngineAPI.NxPatchOpType,
          qValue: '[0,1,2,3]',
        },
      ];
    });

    it('should call apply patches with second dimension first in sort order', async () => {
      expectedPatches[0].qValue = '[1,0,2,3]';

      if (changeSortOrder) {
        await changeSortOrder(column);
      }
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });

    it('should call apply patches with another patch for qReverseSort for dimension', async () => {
      column.colIdx = 0;
      expectedPatches.push({
        qPath: '/qHyperCubeDef/qDimensions/0/qDef/qReverseSort',
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        qValue: 'true',
      });

      if (changeSortOrder) {
        await changeSortOrder(column);
      }
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });

    it('should call apply patches with another patch for qReverseSort for measure', async () => {
      column = { isDim: false, colIdx: 2 } as Column;
      originalOrder = [2, 0, 1, 3];
      expectedPatches[0].qValue = '[2,0,1,3]';
      expectedPatches.push({
        qPath: '/qHyperCubeDef/qMeasures/0/qDef/qReverseSort',
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        qValue: 'true',
      });

      if (changeSortOrder) {
        await changeSortOrder(column);
      }
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });

    it('should not apply patches for qReverseSort for dimension when sortOrder and qSortIndicator are both ascending', async () => {
      column.colIdx = 0;
      if (changeSortOrder) {
        await changeSortOrder(column, 'asc');
      }
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });

    it('should not apply patches for qReverseSort for dimension when sortOrder and qSortIndicator are both descending', async () => {
      column.colIdx = 0;
      layout.qHyperCube.qDimensionInfo[0].qSortIndicator = 'D';

      if (changeSortOrder) {
        await changeSortOrder(column, 'desc');
      }
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });

    it('should apply patches for qReverseSort for dimension when sortOrder is ascending and qSortIndicator is descending', async () => {
      column.colIdx = 0;
      layout.qHyperCube.qDimensionInfo[0].qSortIndicator = 'D';
      expectedPatches.push({
        qPath: '/qHyperCubeDef/qDimensions/0/qDef/qReverseSort',
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        qValue: 'true',
      });

      if (changeSortOrder) {
        await changeSortOrder(column, 'asc');
      }
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });

    it('should apply patches for qReverseSort for dimension when sortOrder is descending and qSortIndicator is ascending', async () => {
      column.colIdx = 0;
      expectedPatches.push({
        qPath: '/qHyperCubeDef/qDimensions/0/qDef/qReverseSort',
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        qValue: 'true',
      });

      if (changeSortOrder) {
        await changeSortOrder(column, 'desc');
      }
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });
  });
});
