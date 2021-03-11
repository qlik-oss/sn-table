import manageData, { getColumnOrder, getColumnInfo } from '../handle-data';
import { generateDataPages, generateLayout } from './generate-test-data';

describe('handle-data', () => {
  let layout;
  let colIdx;

  beforeEach(() => {
    layout = generateLayout(2, 2, [1, 2, 0, 3]);
  });

  describe('getColumnInfo', () => {
    colIdx = 1;
    const getExpectedInfo = (colIx, isDim) => ({
      isDim,
      width: 200,
      label: `title-${colIx}`,
      id: `id-${colIx}`,
      align: isDim ? 'left' : 'right',
      stylingInfo: [],
    });

    it('should return column info for dimension', () => {
      const columnInfo = getColumnInfo(layout, colIdx);
      expect(columnInfo).to.eql(getExpectedInfo(colIdx, true));
    });

    it('should return column info for dimension with stylingInfo', () => {
      layout.qHyperCube.qDimensionInfo[colIdx].qAttrExprInfo = [{ id: 'someId' }];
      const expected = getExpectedInfo(colIdx, true);
      expected.stylingInfo = ['someId'];

      const columnInfo = getColumnInfo(layout, colIdx);
      expect(columnInfo).to.eql(expected);
    });

    it('should return false for hiddenc column', () => {
      layout.qHyperCube.qDimensionInfo[colIdx].qError = { qErrorCode: 7005 };

      const columnInfo = getColumnInfo(layout, colIdx);
      expect(columnInfo).to.be.false;
    });

    it('should return column info for measure', () => {
      colIdx = 3;

      const columnInfo = getColumnInfo(layout, colIdx);
      expect(columnInfo).to.eql(getExpectedInfo(colIdx, false));
    });
  });

  describe('getColumnOrder', () => {
    it('should return qColumnOrder when length of qColumnOrder equals the number of columns', () => {
      const columnLayout = getColumnOrder(layout);
      expect(columnLayout).to.equal(layout.qHyperCube.qColumnOrder);
    });

    it('should return [0, 1, ... , number of columns] when length of qColumnOrder does not equal number of columns', () => {
      layout.qHyperCube.qColumnOrder = [];

      const columnLayout = getColumnOrder(layout);
      expect(columnLayout).to.eql([0, 1, 2, 3]);
    });
  });

  describe('manageData', () => {
    const model = { getHyperCubeData: async () => generateDataPages(2, 4) };
    const pageInfo = { top: 100, height: 100 };

    it('should return size, rows and columns correctly formatted', async () => {
      const { size, rows, columns } = await manageData(model, layout, pageInfo);

      expect(size).to.equal(layout.qHyperCube.qSize);
      expect(rows.length).to.equal(2);
      expect(rows[0]['id-0'].rowIdx).to.equal(100);
      expect(columns.length).to.equal(4);
      columns.forEach((c, i) => {
        expect(c.id).to.equal(Object.keys(rows[0])[i + 1]); // skip the first key
      });
    });
  });
});
