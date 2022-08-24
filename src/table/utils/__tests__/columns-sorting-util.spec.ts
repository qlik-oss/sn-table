import {
  fixTableHypercubeOrders,
  isInvalidOrderArray,
  storeColumnWidths,
  updateColumnInfoOrders,
  swap,
} from '../columns-sorting-util';
import { QHyperCubeDef } from '../../../types';

describe('table columns sorting util', () => {
  let hypercubeDef: QHyperCubeDef;

  beforeEach(() => {
    hypercubeDef = {
      qDimensions: [{ id: 'D1' }, { id: 'D2' }],
      qMeasures: [{ id: 'M1' }, { id: 'M2' }],
      qColumnOrder: [3, 1, 0, 2],
      qInterColumnSortOrder: [0, 1, 2, 3],
      columnWidths: [1, 2, 3, 4],
    } as unknown as QHyperCubeDef;
  });

  it('fixes a broken sort order', () => {
    fixTableHypercubeOrders(hypercubeDef);

    expect(hypercubeDef.qDimensions).toEqual([{ id: 'D2' }, { id: 'D1' }]);
    expect(hypercubeDef.qMeasures).toEqual([{ id: 'M2' }, { id: 'M1' }]);
    expect(hypercubeDef.qColumnOrder).toEqual([2, 0, 1, 3]);
    expect(hypercubeDef.qInterColumnSortOrder).toEqual([1, 0, 3, 2]);
  });

  it('fixes another broken sort order', () => {
    hypercubeDef = {
      qDimensions: [{ id: 'D1' }, { id: 'D2' }, { id: 'D3' }, { id: 'D4' }],
      qMeasures: [{ id: 'M1' }, { id: 'M2' }, { id: 'M3' }, { id: 'M4' }],
      qColumnOrder: [7, 4, 3, 0, 1, 6, 5, 2],
      qInterColumnSortOrder: [0, 1, 2, 3, 4, 5, 6, 7],
    } as unknown as QHyperCubeDef;
    fixTableHypercubeOrders(hypercubeDef);

    expect(hypercubeDef.qDimensions).toEqual([{ id: 'D4' }, { id: 'D1' }, { id: 'D2' }, { id: 'D3' }]);

    expect(hypercubeDef.qMeasures).toEqual([{ id: 'M4' }, { id: 'M1' }, { id: 'M3' }, { id: 'M2' }]);
    expect(hypercubeDef.qColumnOrder).toEqual([4, 5, 0, 1, 2, 6, 7, 3]);
    expect(hypercubeDef.qInterColumnSortOrder).toEqual([1, 2, 3, 0, 5, 7, 6, 4]);
  });

  it('fixes empty qColumnOrder and qInterColumnSortOrder arrays', () => {
    hypercubeDef.qColumnOrder = [];
    hypercubeDef.qInterColumnSortOrder = [];

    fixTableHypercubeOrders(hypercubeDef);

    expect(hypercubeDef.qDimensions).toEqual([{ id: 'D1' }, { id: 'D2' }]);
    expect(hypercubeDef.qMeasures).toEqual([{ id: 'M1' }, { id: 'M2' }]);
    expect(hypercubeDef.qColumnOrder).toEqual([0, 1, 2, 3]);
    expect(hypercubeDef.qInterColumnSortOrder).toEqual([0, 1, 2, 3]);
  });

  it('fixes columnOrder and qInterColumnSortOrder arrays of invalid lengths', () => {
    hypercubeDef.qColumnOrder.push(4);
    hypercubeDef.qInterColumnSortOrder.push(4);

    fixTableHypercubeOrders(hypercubeDef);

    expect(hypercubeDef.qDimensions).toEqual([{ id: 'D1' }, { id: 'D2' }]);
    expect(hypercubeDef.qMeasures).toEqual([{ id: 'M1' }, { id: 'M2' }]);
    expect(hypercubeDef.qColumnOrder).toEqual([0, 1, 2, 3]);
    expect(hypercubeDef.qInterColumnSortOrder).toEqual([0, 1, 2, 3]);
  });

  it('fixes qColumnOrder and qInterColumnSortOrder arrays with duplicate indexes', () => {
    hypercubeDef.qColumnOrder[2] = 3;
    hypercubeDef.qInterColumnSortOrder[0] = 0;

    fixTableHypercubeOrders(hypercubeDef);

    expect(hypercubeDef.qDimensions).toEqual([{ id: 'D1' }, { id: 'D2' }]);
    expect(hypercubeDef.qMeasures).toEqual([{ id: 'M1' }, { id: 'M2' }]);
    expect(hypercubeDef.qColumnOrder).toEqual([0, 1, 2, 3]);
    expect(hypercubeDef.qInterColumnSortOrder).toEqual([0, 1, 2, 3]);
  });

  it('fixes qColumnOrder and qInterColumnSortOrder arrays with incorrect order of indexes', () => {
    hypercubeDef.qColumnOrder[2] = 6;
    hypercubeDef.qInterColumnSortOrder[3] = -1;

    fixTableHypercubeOrders(hypercubeDef);

    expect(hypercubeDef.qDimensions).toEqual([{ id: 'D1' }, { id: 'D2' }]);
    expect(hypercubeDef.qMeasures).toEqual([{ id: 'M1' }, { id: 'M2' }]);
    expect(hypercubeDef.qColumnOrder).toEqual([0, 1, 2, 3]);
    expect(hypercubeDef.qInterColumnSortOrder).toEqual([0, 1, 2, 3]);
  });

  describe('validation', () => {
    // Added because of QLIK-30784 - Sorting more than 9 Measures of a table chart is not working
    it('validates that the array is NOT invalid with 10 or more columns', () => {
      const array = [0, 1, 2, 3, 4, 5, 6, 7, 10, 8, 9];
      expect(isInvalidOrderArray(Array(1), Array(10), array)).toEqual(false);
    });

    it("validates that the array is invalid when it don't start with 0", () => {
      const array = [1, 2, 3, 4];
      expect(isInvalidOrderArray(Array(1), Array(3), array)).toEqual(true);
    });

    it('validates that the array is NOT invalid when it starts with 0', () => {
      const array = [0, 1, 3, 2];
      expect(isInvalidOrderArray(Array(1), Array(3), array)).toEqual(false);
    });

    it('validates that the array is invalid when the length is to short', () => {
      const array = [0, 1, 3, 2];
      expect(isInvalidOrderArray(Array(1), Array(4), array)).toEqual(true);
    });

    it('validates that the array is invalid when the length is to long', () => {
      const array = [0, 1, 3, 2];
      expect(isInvalidOrderArray(Array(1), Array(2), array)).toEqual(true);
    });

    it('validates that the array is NOT invalid when the length is correct', () => {
      const array = [0, 1, 3, 2];
      expect(isInvalidOrderArray(Array(1), Array(3), array)).toEqual(false);
    });

    it('validates that the array is invalid when it contains duplicate indices', () => {
      const array = [0, 1, 2, 3, 1];
      expect(isInvalidOrderArray(Array(1), Array(4), array)).toEqual(true);
    });

    it('validates that the array is invalid when indices are missing', () => {
      const array = [0, 1, 2, 4];
      expect(isInvalidOrderArray(Array(1), Array(3), array)).toEqual(true);
    });
  });

  describe('storeColumnWidths', () => {
    it('should store columns widths', () => {
      storeColumnWidths(hypercubeDef);

      expect(hypercubeDef.qDimensions).toEqual([
        { id: 'D1', columnWidth: 1 },
        { id: 'D2', columnWidth: 2 },
      ]);
      expect(hypercubeDef.qMeasures).toEqual([
        { id: 'M1', columnWidth: 3 },
        { id: 'M2', columnWidth: 4 },
      ]);
    });
  });

  describe('updateColumnInfoOrders', () => {
    it('should update columnInfo orders', () => {
      hypercubeDef = {
        qDimensions: [
          { id: 'D1', columnWidth: -1 },
          { id: 'D2', columnWidth: -1 },
        ],
        qMeasures: [
          { id: 'M1', columnWidth: -1 },
          { id: 'M2', columnWidth: -1 },
        ],
        qColumnOrder: [0, 2, 1, 3],
        columnWidths: [-1, -1, -1, -1],
      } as unknown as QHyperCubeDef;

      updateColumnInfoOrders(hypercubeDef);

      expect(hypercubeDef.qDimensions).toEqual([{ id: 'D1' }, { id: 'D2' }]);
      expect(hypercubeDef.qMeasures).toEqual([{ id: 'M1' }, { id: 'M2' }]);
    });
  });

  describe('swap', () => {
    it('should swap items', () => {
      const array = [3, 2] as number[];
      swap(array, 0, 1);

      expect(array[0]).toBe(2);
      expect(array[1]).toBe(3);
    });
  });
});
