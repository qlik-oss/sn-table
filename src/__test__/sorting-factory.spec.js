import sortingFactory from '../sorting-factory';
import { generateLayout } from './generate-test-data';

describe('sorting-factory', () => {
  let originalOrder;
  let column;
  let layout;
  let model;
  let changeSortOrder;
  let expectedPatches;

  beforeEach(() => {
    originalOrder = [0, 1, 2, 3];
    layout = generateLayout(2, 2, 2);
    column = { isDim: true, dataColIdx: 1 };
    model = {
      applyPatches: jest.fn(),
      getEffectiveProperties: async () =>
        Promise.resolve({
          qHyperCubeDef: {
            qInterColumnSortOrder: originalOrder,
          },
        }),
    };
    changeSortOrder = sortingFactory(model);
    expectedPatches = [
      {
        qPath: '/qHyperCubeDef/qInterColumnSortOrder',
        qOp: 'replace',
        qValue: '[0,1,2,3]',
      },
    ];
  });

  it('should call apply patches with second dimension first in sort order', async () => {
    expectedPatches[0].qValue = '[1,0,2,3]';

    await changeSortOrder(layout, column);
    expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
  });

  it('should call apply patches with another patch for qReverseSort for dimension', async () => {
    column.dataColIdx = 0;
    expectedPatches.push({
      qPath: '/qHyperCubeDef/qDimensions/0/qDef/qReverseSort',
      qOp: 'replace',
      qValue: 'true',
    });

    await changeSortOrder(layout, column);
    expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
  });

  it('should call apply patches with another patch for qReverseSort for measure', async () => {
    column = { isDim: false, dataColIdx: 2 };
    originalOrder = [2, 0, 1, 3];
    expectedPatches[0].qValue = '[2,0,1,3]';
    expectedPatches.push({
      qPath: '/qHyperCubeDef/qMeasures/0/qDef/qReverseSort',
      qOp: 'replace',
      qValue: 'true',
    });

    await changeSortOrder(layout, column);
    expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
  });
});
