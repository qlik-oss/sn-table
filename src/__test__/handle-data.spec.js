import manageData, { getColumnOrder, getColumnInfo } from '../handle-data';
import { generateDataPages, generateLayout } from './generate-test-data';

describe('handle-data', () => {
  let layout;
  let colIdx;

  beforeEach(() => {
    layout = generateLayout(2, 2, 200, [1, 2, 0, 3]);
  });

  describe('getColumnInfo', () => {
    colIdx = 1;

    const getExpectedInfo = (colIx, isDim) => ({
      isDim,
      width: 200,
      label: `title-${colIx}`,
      id: `col-${colIx}`,
      align: isDim ? 'left' : 'right',
      stylingInfo: [],
      sortDirection: 'asc',
      dataColIdx: colIx,
    });

    it('should return column info for dimension', () => {
      const columnInfo = getColumnInfo(layout.qHyperCube, colIdx);
      expect(columnInfo).toEqual(getExpectedInfo(colIdx, true));
    });

    it('should return column info for dimension with align center', () => {
      layout.qHyperCube.qDimensionInfo[colIdx].textAlign = { auto: false, align: 'center' };
      const expected = getExpectedInfo(colIdx, true);
      expected.align = 'center';
    });

    it('should return column info for dimension with stylingInfo', () => {
      layout.qHyperCube.qDimensionInfo[colIdx].qAttrExprInfo = [{ id: 'someId' }];
      const expected = getExpectedInfo(colIdx, true);
      expected.stylingInfo = ['someId'];

      const columnInfo = getColumnInfo(layout.qHyperCube, colIdx);
      expect(columnInfo).toEqual(expected);
    });

    it('should return false for hidden column', () => {
      layout.qHyperCube.qDimensionInfo[colIdx].qError = { qErrorCode: 7005 };

      const columnInfo = getColumnInfo(layout.qHyperCube, colIdx);
      expect(columnInfo).toBeFalsy();
    });

    it('should return column info for measure', () => {
      colIdx = 3;

      const columnInfo = getColumnInfo(layout.qHyperCube, colIdx);
      expect(columnInfo).toEqual(getExpectedInfo(colIdx, false));
    });
  });

  describe('getColumnOrder', () => {
    it('should return qColumnOrder when length of qColumnOrder equals the number of columns', () => {
      const columnLayout = getColumnOrder(layout.qHyperCube);
      expect(columnLayout).toEqual(layout.qHyperCube.qColumnOrder);
    });

    it('should return [0, 1, ... , number of columns] when length of qColumnOrder does not equal number of columns', () => {
      layout.qHyperCube.qColumnOrder = [];

      const columnLayout = getColumnOrder(layout.qHyperCube);
      expect(columnLayout).toEqual([0, 1, 2, 3]);
    });
  });

  describe('manageData', () => {
    let model;
    let pageInfo;
    let setPageInfo;

    beforeEach(() => {
      pageInfo = { page: 1, rowsPerPage: 100, rowsPerPageOptions: [10, 25, 100] };
      model = { getHyperCubeData: async () => generateDataPages(100, 4) };
      setPageInfo = jest.fn();
    });

    it('should return size, rows and columns correctly formatted', async () => {
      const { size, rows, columns } = await manageData(model, layout, pageInfo, setPageInfo);

      expect(size).toEqual(layout.qHyperCube.qSize);
      expect(rows).toHaveLength(100);
      expect(rows[0]['col-0'].qText).toEqual('2');
      expect(rows[0]['col-0'].rowIdx).toEqual(100);
      expect(rows[0]['col-0'].colIdx).toEqual(0);
      expect(rows[0]['col-0'].rawRowIdx).toEqual(0);
      expect(rows[0]['col-0'].rawColIdx).toEqual(2);
      expect(rows[0]['col-1'].qText).toEqual('0');
      expect(rows[0]['col-1'].rowIdx).toEqual(100);
      expect(rows[0]['col-1'].colIdx).toEqual(1);
      expect(rows[0]['col-1'].rawRowIdx).toEqual(0);
      expect(rows[0]['col-1'].rawColIdx).toEqual(0);
      expect(columns).toHaveLength(4);
      columns.forEach((c, i) => {
        expect(c.id).toEqual(Object.keys(rows[0])[i + 1]); // skip the first key
      });
    });

    it('should return null and call setPageInfo when page is > 0 and page * rowsPerPage >= qcy', async () => {
      layout.qHyperCube.qSize.qcy = 100;
      const tableData = await manageData(model, layout, pageInfo, setPageInfo);

      expect(tableData).toBeNull();
      expect(setPageInfo).toHaveBeenCalledWith({ ...pageInfo, page: 0 });
    });

    it('should return null and call setPageInfo with rowsPerPage 25 when height * width > 10000 and width is 120', async () => {
      pageInfo = { ...pageInfo, page: 0 };
      layout = generateLayout(60, 60, 1100);
      const tableData = await manageData(model, layout, pageInfo, setPageInfo);

      expect(tableData).toBeNull();
      expect(setPageInfo).toHaveBeenCalledWith({ ...pageInfo, rowsPerPage: 25 });
    });

    it('should return null and call setPageInfo with rowsPerPage 4 when height * width > 10000 and width is 2200', async () => {
      pageInfo = { ...pageInfo, page: 0 };
      layout = generateLayout(1100, 1100, 100);
      const tableData = await manageData(model, layout, pageInfo, setPageInfo);

      expect(tableData).toBeNull();
      expect(setPageInfo).toHaveBeenCalledWith({ ...pageInfo, rowsPerPage: 4 });
    });

    it('should return null and call setPageInfo with rowsPerPage 4 when width > 10000', async () => {
      pageInfo = { ...pageInfo, page: 0 };
      layout = generateLayout(6000, 6000, 100);
      const tableData = await manageData(model, layout, pageInfo, setPageInfo);

      expect(tableData).toBeNull();
      expect(setPageInfo).toHaveBeenCalledWith({ ...pageInfo, rowsPerPage: 0 });
    });
  });
});
