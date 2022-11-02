import manageData, { getColumnOrder, getColumnInfo, getTotalInfo, getTotalPosition } from '../handle-data';
import { generateDataPages, generateLayout } from './generate-test-data';
import { TableLayout, PageInfo, SetPageInfo, TableData, Cell, ExtendedNxAttrExprInfo } from '../types';

describe('handle-data', () => {
  let layout: TableLayout;
  let colIdx: number;
  let pageColIdx: number;

  beforeEach(() => {
    layout = generateLayout(2, 2, 200, [1, 2, 0, 3], [{ qText: '-' }, { qText: '200' }]);
  });

  describe('getColumnInfo', () => {
    colIdx = 1;
    pageColIdx = 2;

    const getExpectedInfo = (isDim: boolean, isLocked?: boolean, totals = '') => ({
      isDim,
      label: `title-${colIdx}`,
      id: `col-${pageColIdx}`,
      align: isDim ? 'left' : 'right',
      stylingIDs: [] as string[],
      totalInfo: totals,
      sortDirection: 'asc',
      colIdx,
      pageColIdx,
      isLocked,
    });

    it('should return column info for dimension', () => {
      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx);
      expect(columnInfo).toEqual(getExpectedInfo(true));
    });

    it('should return column info for dimension with align center', () => {
      layout.qHyperCube.qDimensionInfo[colIdx].textAlign = { auto: false, align: 'center' };
      const expected = getExpectedInfo(true);
      expected.align = 'center';

      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx);
      expect(columnInfo).toEqual(expected);
    });

    it('should return column info for dimension with stylingIDs', () => {
      layout.qHyperCube.qDimensionInfo[colIdx].qAttrExprInfo = [
        { id: 'someId' },
      ] as unknown as ExtendedNxAttrExprInfo[];
      const expected = getExpectedInfo(true);
      expected.stylingIDs = ['someId'];

      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx);
      expect(columnInfo).toEqual(expected);
    });

    it('should return false for hidden column', () => {
      layout.qHyperCube.qDimensionInfo[colIdx].qError = { qErrorCode: 7005 };

      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx);
      expect(columnInfo).toBe(false);
    });

    it('should return column info for dimension with isLocked', () => {
      layout.qHyperCube.qDimensionInfo[colIdx].qLocked = true;
      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx);
      expect(columnInfo).toEqual(getExpectedInfo(true, true));
    });

    it('should return column info for measure', () => {
      colIdx = 3;
      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx);
      expect(columnInfo).toEqual(getExpectedInfo(false, false, '200'));
    });
  });

  describe('getColumnOrder', () => {
    it('should return qColumnOrder when length of qColumnOrder equals the number of columns', () => {
      const columnLayout = getColumnOrder(layout.qHyperCube);
      expect(columnLayout).toBe(layout.qHyperCube.qColumnOrder);
    });

    it('should return [0, 1, ... , number of columns] when length of qColumnOrder does not equal number of columns', () => {
      layout.qHyperCube.qColumnOrder = [];

      const columnLayout = getColumnOrder(layout.qHyperCube);
      expect(columnLayout).toEqual([0, 1, 2, 3]);
    });
  });

  describe('manageData', () => {
    let model: EngineAPI.IGenericObject;
    let pageInfo: PageInfo;
    let setPageInfo: SetPageInfo;

    beforeEach(() => {
      pageInfo = { page: 1, rowsPerPage: 100, rowsPerPageOptions: [10, 25, 100] };
      model = { getHyperCubeData: async () => generateDataPages(100, 4) } as unknown as EngineAPI.IGenericObject;
      setPageInfo = jest.fn();
    });

    it('should return size, rows and columns correctly formatted', async () => {
      const { totalColumnCount, totalRowCount, paginationNeeded, rows, columns } = (await manageData(
        model,
        layout,
        pageInfo,
        setPageInfo
      )) as TableData;

      const firstColCell = rows[0]['col-0'] as Cell;
      const secondColCell = rows[0]['col-1'] as Cell;

      expect(totalColumnCount).toBe(layout.qHyperCube.qSize.qcx);
      expect(totalRowCount).toBe(layout.qHyperCube.qSize.qcy);
      expect(paginationNeeded).toBe(true);
      expect(rows).toHaveLength(100);
      expect(firstColCell.qText).toBe('0');
      expect(firstColCell.rowIdx).toBe(100);
      expect(firstColCell.colIdx).toBe(1);
      expect(firstColCell.pageRowIdx).toBe(0);
      expect(firstColCell.pageColIdx).toBe(0);
      expect(secondColCell.qText).toBe('1');
      expect(secondColCell.rowIdx).toBe(100);
      expect(secondColCell.colIdx).toBe(2);
      expect(secondColCell.pageRowIdx).toBe(0);
      expect(secondColCell.pageColIdx).toBe(1);
      expect(columns).toHaveLength(4);
      columns.forEach((c, i) => {
        expect(c.id).toBe(Object.keys(rows[0])[i + 1]); // skip the first key
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

  describe('getTotalInfo:', () => {
    it('should show all the measures cells total values', () => {
      expect(getTotalInfo(layout, 2, 2, 2)).toBe('-');
      expect(getTotalInfo(layout, 3, 3, 2)).toBe('200');
    });

    it('should show Totals label for the first dimension and empty for the other dimensions', () => {
      expect(getTotalInfo(layout, 0, 0, 2)).toBe('Totals');
      expect(getTotalInfo(layout, 1, 1, 2)).toBe('');
    });

    it('should not show Totals label if the dimension is in another column order than 0', () => {
      expect(getTotalInfo(layout, 0, 2, 2)).toBe('');
      expect(getTotalInfo(layout, 1, 3, 2)).toBe('');
    });

    it('should not get any total measure value when qGrandTotalRow has no value', () => {
      layout.qHyperCube.qGrandTotalRow = [];
      expect(getTotalInfo(layout, 2, 2, 2)).toBe(undefined);
      expect(getTotalInfo(layout, 3, 3, 2)).toBe(undefined);
    });

    it('should return new total label value', () => {
      layout.totals.label = 'Whatever';
      expect(getTotalInfo(layout, 0, 0, 2)).toBe('Whatever');
    });

    it('should return first dimension total value as empty when the label is set to empty', () => {
      layout.totals.label = '';
      expect(getTotalInfo(layout, 0, 0, 2)).toBe('');
    });
  });

  describe('getTotalPosition:', () => {
    describe('When total auto mode is off', () => {
      it('should return top and show totals when the position is set to top', () => {
        layout.totals.position = 'top';
        expect(getTotalPosition(layout)).toBe('top');
      });

      it('should return noTotals and not to show totals when the position is set to none', () => {
        layout.totals.position = 'noTotals';
        expect(getTotalPosition(layout)).toBe('noTotals');
      });

      it('should return bottom when the position is set to bottom', () => {
        layout.totals.position = 'bottom';
        expect(getTotalPosition(layout)).toBe('bottom');
      });

      it('should not show totals when the position is set to be visible but there is no grandTotal', () => {
        layout.qHyperCube.qGrandTotalRow.length = 0;
        expect(getTotalPosition(layout)).toBe('noTotals');
      });

      it('should not show totals when position is set to be visible but table has only dimension', () => {
        layout.qHyperCube.qMeasureInfo.length = 0;
        expect(getTotalPosition(layout)).toBe('noTotals');
      });

      it('should show totals when table has only measure', () => {
        layout.qHyperCube.qDimensionInfo.length = 0;
        layout.totals.position = 'top';
        expect(getTotalPosition(layout)).toBe('top');
      });
    });

    describe('When total auto mode is on', () => {
      it('should show totals at top by default', () => {
        layout.totals.show = true;
        layout.totals.position = 'noTotals';
        expect(getTotalPosition(layout)).toBe('top');
      });

      it('should return not show totals when table has only measure', () => {
        layout.totals.show = true;
        layout.qHyperCube.qDimensionInfo.length = 0;
        expect(getTotalPosition(layout)).toBe('noTotals');
      });
    });
  });
});
