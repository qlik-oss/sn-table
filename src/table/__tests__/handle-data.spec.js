import manageData, { getColumnOrder, getColumnInfo } from '../handle-data';
import { generateDataPages, generateLayout } from '../../__test__/generate-test-data';

describe('handle-data', () => {
  let layout;

  beforeEach(() => {
    layout = generateLayout(2, 2, [1, 2, 0, 3]);
  });

  describe('getColumnInfo', () => {
    const getExpectedInfo = (colIdx, isDim) => ({
      isDim,
      width: 200,
      label: `title-${colIdx}`,
      dataKey: `id-${colIdx}`,
      id: `id-${colIdx}`,
      align: isDim ? 'left' : 'right',
    });

    it('should return column info for dimension', () => {
      const colIdx = 1;

      const columnInfo = getColumnInfo(layout, colIdx);
      expect(columnInfo).to.eql(getExpectedInfo(colIdx, true));
    });

    it('should return column info for measure', () => {
      const colIdx = 3;

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
        expect(c.id).to.equal(Object.keys(rows[0])[i]);
      });
    });
  });
});
