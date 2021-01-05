import manageData, { getColumnOrder, getColumnInfo } from '../handle-data';

describe('handle-data', () => {
  const createField = (idx) => ({ qFallbackTitle: `title-${idx}`, cId: `id-${idx}` });
  let layout;

  beforeEach(() => {
    layout = {
      qHyperCube: {
        qDimensionInfo: [createField('0'), createField('1')],
        qMeasureInfo: [createField('2'), createField('3')],
        qColumnOrder: [1, 2, 0, 3],
        qSize: { qcx: 4, qcy: 2 },
      },
    };
  });

  describe('getColumnInfo', () => {
    it('should return column info for dimension', () => {
      const colIdx = 1;
      const expectedInfo = {
        isDim: true,
        width: 200,
        label: `title-${colIdx}`,
        dataKey: `id-${colIdx}`,
        id: `id-${colIdx}`,
        align: 'left',
      };

      const columnInfo = getColumnInfo(layout, colIdx);
      expect(columnInfo).to.eql(expectedInfo);
    });

    it('should return column info for measure', () => {
      const colIdx = 3;
      const expectedInfo = {
        isDim: false,
        width: 200,
        label: `title-${colIdx}`,
        dataKey: `id-${colIdx}`,
        id: `id-${colIdx}`,
        align: 'right',
      };

      const columnInfo = getColumnInfo(layout, colIdx);
      expect(columnInfo).to.eql(expectedInfo);
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
      const getHyperCubeData = async () => {
        return [
          {
            qMatrix: [
              [{}, {}, {}, {}],
              [{}, {}, {}, {}],
            ],
          },
        ];
      };
      const model = { getHyperCubeData };
      const pageInfo = { top: 0, height: 100 };

      it('should return size, rows and columns correctly formatted', async () => {
        const { size, rows, columns } = await manageData(model, layout, pageInfo);

        expect(size).to.equal(layout.qHyperCube.qSize);
        expect(rows.length).to.equal(2);
        expect(columns.length).to.equal(4);
        columns.forEach((c, i) => {
          expect(c.id).to.equal(Object.keys(rows[0])[i]);
        });
      });
    });
  });
});
