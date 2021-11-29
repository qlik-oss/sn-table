import sortingFactory from '../sorting-factory';
import { generateLayout } from './generate-test-data';

describe('sorting-factory', () => {
  let layout;
  let model;
  let columnOrder;
  let changeSortOrder;
  let expectedPatches;

  beforeEach(() => {
    layout = generateLayout(2, 2, 2, [0, 1, 2, 3]);
    model = {
      applyPatches: sinon.spy(),
    };
    columnOrder = [0, 1, 2, 3];
    changeSortOrder = sortingFactory(model, columnOrder);
    expectedPatches = [
      {
        qPath: '/qHyperCubeDef/qInterColumnSortOrder',
        qOp: 'replace',
        qValue: '[0,1,2,3]',
      },
    ];
  });

  it('should call apply patches with second dimension first in sort order', () => {
    expectedPatches[0].qValue = '[1,0,2,3]';

    changeSortOrder(layout, true, 1);
    expect(model.applyPatches).to.have.been.calledWith(expectedPatches, true);
  });

  it('should call apply patches with another patch for qReverseSort for dimension', () => {
    expectedPatches.push({
      qPath: '/qHyperCubeDef/qDimensions/0/qDef/qReverseSort',
      qOp: 'replace',
      qValue: 'true',
    });

    changeSortOrder(layout, true, 0);
    expect(model.applyPatches).to.have.been.calledWith(expectedPatches, true);
  });

  it('should call apply patches with another patch for qReverseSort for measure', () => {
    layout.qHyperCube.qEffectiveInterColumnSortOrder = [2, 0, 1, 3];
    expectedPatches[0].qValue = '[2,0,1,3]';
    expectedPatches.push({
      qPath: '/qHyperCubeDef/qMeasures/0/qDef/qReverseSort',
      qOp: 'replace',
      qValue: 'true',
    });

    changeSortOrder(layout, false, 2);
    expect(model.applyPatches).to.have.been.calledWith(expectedPatches, true);
  });
});
