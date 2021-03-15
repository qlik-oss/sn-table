import sortingFactory from '../sorting';
import { generateLayout } from './generate-test-data';

describe('sorting', () => {
  let layout;
  let model;
  let changeSortOrder;
  let expectedPatches;

  beforeEach(() => {
    layout = generateLayout(2, 2, [0, 1, 2, 3]);
    model = {
      applyPatches: sinon.spy(),
    };
    changeSortOrder = sortingFactory(model, layout);
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

    changeSortOrder(true, 1);
    expect(model.applyPatches).to.have.been.calledWith(expectedPatches, true);
  });

  it('should call apply patches with another patch for qReverseSort for dimension', () => {
    expectedPatches.push({
      qPath: '/qHyperCubeDef/qDimensions/0/qDef/qReverseSort',
      qOp: 'replace',
      qValue: 'true',
    });

    changeSortOrder(true, 0);
    expect(model.applyPatches).to.have.been.calledWith(expectedPatches, true);
  });

  it('should call apply patches with another patch for qReverseSort for measure', () => {
    layout.qHyperCube.qEffectiveInterColumnSortOrder = [2, 0, 1, 3];
    changeSortOrder = sortingFactory(model, layout);
    expectedPatches[0].qValue = '[2,0,1,3]';
    expectedPatches.push({
      qPath: '/qHyperCubeDef/qMeasures/0/qDef/qReverseSort',
      qOp: 'replace',
      qValue: 'true',
    });

    changeSortOrder(false, 2);
    expect(model.applyPatches).to.have.been.calledWith(expectedPatches, true);
  });
});
