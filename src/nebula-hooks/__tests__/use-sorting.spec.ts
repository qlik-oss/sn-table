import { sortingFactory } from '../use-sorting';
import { generateLayout } from '../../__test__/generate-test-data';
import { Column, TableLayout, HyperCube } from '../../types';

describe('use-sorting', () => {
  describe('sortingFactory', () => {
    it('should return undefined when model is undefined', async () => {
      const model = undefined;
      const changeSortOrder = sortingFactory(model);
      expect(changeSortOrder).toBeUndefined();
    });
  });

  describe('changeSortOrder', () => {
    let originalOrder: number[];
    let column: Column;
    let layout: TableLayout;
    let model: EngineAPI.IGenericObject;
    let changeSortOrder: ((layout: TableLayout, column: Column) => Promise<void>) | undefined;
    let expectedPatches: EngineAPI.INxPatch[];

    beforeEach(() => {
      originalOrder = [0, 1, 2, 3];
      layout = generateLayout(2, 2, 2);
      column = { isDim: true, dataColIdx: 1 } as Column;
      model = {
        applyPatches: jest.fn(),
        getEffectiveProperties: async () =>
          Promise.resolve({
            qHyperCubeDef: {
              qInterColumnSortOrder: originalOrder,
            } as unknown as HyperCube,
          }),
      } as unknown as EngineAPI.IGenericObject;
      changeSortOrder = sortingFactory(model);
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
        await changeSortOrder(layout, column);
      }
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });

    it('should call apply patches with another patch for qReverseSort for dimension', async () => {
      column.dataColIdx = 0;
      expectedPatches.push({
        qPath: '/qHyperCubeDef/qDimensions/0/qDef/qReverseSort',
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        qValue: 'true',
      });

      if (changeSortOrder) {
        await changeSortOrder(layout, column);
      }
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });

    it('should call apply patches with another patch for qReverseSort for measure', async () => {
      column = { isDim: false, dataColIdx: 2 } as Column;
      originalOrder = [2, 0, 1, 3];
      expectedPatches[0].qValue = '[2,0,1,3]';
      expectedPatches.push({
        qPath: '/qHyperCubeDef/qMeasures/0/qDef/qReverseSort',
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        qValue: 'true',
      });

      if (changeSortOrder) {
        await changeSortOrder(layout, column);
      }
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });
  });
});
