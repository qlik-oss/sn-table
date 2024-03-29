import manageData, { getColumnInfo, getColumns, getTotalInfo, getTotalPosition } from "../handle-data";
import {
  Cell,
  ExtendedNxAttrExprInfo,
  PageInfo,
  SetPageInfo,
  TableData,
  TableLayout,
  TotalsPosition,
  ViewService,
  ViewState,
} from "../types";
import { generateDataPages, generateLayout } from "./generate-test-data";

type ExpectedInfo = {
  isDim: boolean;
  qLibraryId?: string;
  isLocked?: boolean;
  totals?: string;
  isActivelySorted?: boolean;
};

describe("handle-data", () => {
  let layout: TableLayout;
  let colIdx: number;
  let pageColIdx: number;

  beforeEach(() => {
    layout = generateLayout(2, 2, 200, [0, 2, 1, 3], [{ qText: "-" }, { qText: "200" }], [0]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getColumnInfo", () => {
    colIdx = 1;
    pageColIdx = 2;

    const getExpectedInfo = ({ isDim, qLibraryId, isLocked, totals = "", isActivelySorted = false }: ExpectedInfo) => ({
      isDim,
      qLibraryId,
      label: `title-${colIdx}`,
      fieldId: isDim ? `title-${colIdx}` : "",
      id: `col-${pageColIdx}`,
      stylingIDs: [] as string[],
      totalInfo: totals,
      sortDirection: "A",
      colIdx,
      pageColIdx,
      isLocked,
      qApprMaxGlyphCount: 3,
      qReverseSort: false,
      bodyTextAlign: "auto",
      totalsTextAlign: "left",
      headTextAlign: "right",
      selectionColIdx: isDim ? colIdx : -1,
      isActivelySorted,
    });

    it("should return column info for dimension", () => {
      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx, colIdx);
      expect(columnInfo).toEqual(getExpectedInfo({ isDim: true }));
    });

    it("should return column info for dimension with align center", () => {
      layout.qHyperCube.qDimensionInfo[colIdx].textAlign = { auto: false, align: "center" };
      const expected = getExpectedInfo({ isDim: true });
      expected.bodyTextAlign = "center";
      expected.headTextAlign = "center";
      expected.totalsTextAlign = "center";

      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx, colIdx);
      expect(columnInfo).toEqual(expected);
    });

    it("should return column info for dimension with head cell align right", () => {
      layout.qHyperCube.qDimensionInfo[colIdx].qDimensionType = "N";
      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx, colIdx);
      const expected = getExpectedInfo({ isDim: true });
      expected.headTextAlign = "right";

      expect(columnInfo).toEqual(expected);
    });

    it("should return column info for dimension with stylingIDs", () => {
      layout.qHyperCube.qDimensionInfo[colIdx].qAttrExprInfo = [
        { id: "someId" },
      ] as unknown as ExtendedNxAttrExprInfo[];
      const expected = getExpectedInfo({ isDim: true });
      expected.stylingIDs = ["someId"];

      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx, colIdx);
      expect(columnInfo).toEqual(expected);
    });

    it("should return column info for dimension with isLocked", () => {
      layout.qHyperCube.qDimensionInfo[colIdx].qLocked = true;
      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx, colIdx);
      expect(columnInfo).toEqual(getExpectedInfo({ isDim: true, qLibraryId: undefined, isLocked: true }));
    });

    it("should return column info for master dimension", () => {
      layout.qHyperCube.qDimensionInfo[colIdx].qLibraryId = "#someId";
      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx, colIdx);
      expect(columnInfo).toEqual(getExpectedInfo({ isDim: true, qLibraryId: "#someId" }));
    });

    it("should return column info for measure with totals cell align right", () => {
      colIdx = 3;
      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx, 1); // colIdx 3 is the second index for measure
      const expected = getExpectedInfo({ isDim: false, qLibraryId: undefined, isLocked: false, totals: "200" });
      expected.totalsTextAlign = "right";

      expect(columnInfo).toEqual(expected);
    });

    it("should return column info with actively sorted status as true", () => {
      colIdx = 0;
      layout = generateLayout(2, 2, 200, [0, 2, 1, 3], [{ qText: "-" }, { qText: "200" }], [0]);
      const columnInfo = getColumnInfo(layout, colIdx, pageColIdx, colIdx);
      expect(columnInfo).toEqual(getExpectedInfo({ isDim: true, isActivelySorted: true }));
    });
  });

  describe("getColumns", () => {
    it("should return columns in default order when length of qColumnOrder does not equal number of columns", () => {
      layout.qHyperCube.qColumnOrder = [];

      const columns = getColumns(layout);
      expect(columns[0].colIdx).toBe(0);
      expect(columns[1].colIdx).toBe(1);
      expect(columns[2].colIdx).toBe(2);
      expect(columns[3].colIdx).toBe(3);
    });

    it("should return columns in defined column order when qColumnOrder is set", () => {
      const columns = getColumns(layout);
      expect(columns[0].colIdx).toBe(0);
      expect(columns[1].colIdx).toBe(2);
      expect(columns[2].colIdx).toBe(1);
      expect(columns[3].colIdx).toBe(3);
    });

    it("should return columns in defined column order when qColumnOrder is set, with hidden dimension removed", () => {
      layout.qHyperCube.qDimensionInfo[0].qError = { qErrorCode: 7005 };

      const columns = getColumns(layout);
      expect(columns[0].colIdx).toBe(2);
      expect(columns[0].selectionColIdx).toBe(-1);
      expect(columns[1].colIdx).toBe(1);
      expect(columns[1].selectionColIdx).toBe(0);
      expect(columns[2].colIdx).toBe(3);
      expect(columns[2].selectionColIdx).toBe(-1);
    });

    it("should return columns in defined column order when qColumnOrder is set, with hidden measure removed", () => {
      layout.qHyperCube.qMeasureInfo[0].qError = { qErrorCode: 7005 };

      const columns = getColumns(layout);
      expect(columns[0].colIdx).toBe(0);
      expect(columns[0].selectionColIdx).toBe(0);
      expect(columns[1].colIdx).toBe(1);
      expect(columns[1].selectionColIdx).toBe(1);
      expect(columns[2].colIdx).toBe(3);
      expect(columns[2].selectionColIdx).toBe(-1);
    });
  });

  describe("manageData", () => {
    let model: EngineAPI.IGenericObject;
    let pageInfo: PageInfo;
    let setPageInfo: SetPageInfo;
    let viewService: ViewService;

    beforeEach(() => {
      pageInfo = { page: 1, rowsPerPage: 100, rowsPerPageOptions: [10, 25, 100] };
      model = {
        getHyperCubeData: async () => generateDataPages(100, 4),
      } as unknown as EngineAPI.IGenericObject;
      setPageInfo = jest.fn();
      viewService = {
        qTop: 0,
        qHeight: 100,
        scrollLeft: 0,
        estimatedRowHeight: 25,
      };
    });

    it("should return size, rows and columns correctly formatted", async () => {
      const { totalColumnCount, totalRowCount, paginationNeeded, rows, columns } = (await manageData(
        model,
        layout,
        pageInfo,
        setPageInfo,
        viewService,
      )) as TableData;

      const firstColCell = rows[0]["col-0"] as Cell;
      const secondColCell = rows[0]["col-1"] as Cell;

      expect(totalColumnCount).toBe(layout.qHyperCube.qSize.qcx);
      expect(totalRowCount).toBe(layout.qHyperCube.qSize.qcy);
      expect(paginationNeeded).toBe(true);
      expect(rows).toHaveLength(100);
      expect(firstColCell.qText).toBe("0");
      expect(firstColCell.rowIdx).toBe(100);
      expect(firstColCell.colIdx).toBe(0);
      expect(firstColCell.pageRowIdx).toBe(0);
      expect(firstColCell.pageColIdx).toBe(0);
      expect(secondColCell.qText).toBe("1");
      expect(secondColCell.rowIdx).toBe(100);
      expect(secondColCell.colIdx).toBe(2);
      expect(secondColCell.pageRowIdx).toBe(0);
      expect(secondColCell.pageColIdx).toBe(1);
      expect(columns).toHaveLength(4);
      columns.forEach((c, i) => {
        expect(c.id).toBe(Object.keys(rows[0])[i + 1]); // skip the first key
      });
    });

    it("should return null and call setPageInfo when page is > 0 and page * rowsPerPage >= qcy", async () => {
      layout.qHyperCube.qSize.qcy = 100;
      const tableData = await manageData(model, layout, pageInfo, setPageInfo, viewService);

      expect(tableData).toBeNull();
      expect(setPageInfo).toHaveBeenCalledWith({ ...pageInfo, page: 0 });
    });

    it("should return null and call setPageInfo with rowsPerPage 25 when height * width > 10000 and width is 120", async () => {
      pageInfo = { ...pageInfo, page: 0 };
      layout = generateLayout(60, 60, 1100);
      const tableData = await manageData(model, layout, pageInfo, setPageInfo, viewService);

      expect(tableData).toBeNull();
      expect(setPageInfo).toHaveBeenCalledWith({ ...pageInfo, rowsPerPage: 25 });
    });

    it("should return null and call setPageInfo with rowsPerPage 4 when height * width > 10000 and width is 2200", async () => {
      pageInfo = { ...pageInfo, page: 0 };
      layout = generateLayout(1100, 1100, 100);
      const tableData = await manageData(model, layout, pageInfo, setPageInfo, viewService);

      expect(tableData).toBeNull();
      expect(setPageInfo).toHaveBeenCalledWith({ ...pageInfo, rowsPerPage: 4 });
    });

    it("should return null and call setPageInfo with rowsPerPage 4 when width > 10000", async () => {
      pageInfo = { ...pageInfo, page: 0 };
      layout = generateLayout(6000, 6000, 100);
      const tableData = await manageData(model, layout, pageInfo, setPageInfo, viewService);

      expect(tableData).toBeNull();
      expect(setPageInfo).toHaveBeenCalledWith({ ...pageInfo, rowsPerPage: 0 });
    });
  });

  describe("getTotalInfo:", () => {
    it("should show all the measures cells total values", () => {
      expect(getTotalInfo(layout, false, 2, 0)).toBe("-");
      expect(getTotalInfo(layout, false, 3, 1)).toBe("200");
    });

    it("should show Totals label for the first dimension and empty for the other dimensions", () => {
      expect(getTotalInfo(layout, true, 0, 2)).toBe("Totals");
      expect(getTotalInfo(layout, true, 1, 2)).toBe("");
    });

    it("should not show Totals label if the dimension is in another column order than 0", () => {
      expect(getTotalInfo(layout, true, 1, 1)).toBe("");
      expect(getTotalInfo(layout, true, 2, 2)).toBe("");
    });

    it("should return empty string as total measure value when qGrandTotalRow has no value", () => {
      layout.qHyperCube.qGrandTotalRow = [];
      expect(getTotalInfo(layout, false, 2, 0)).toBe("");
      expect(getTotalInfo(layout, false, 3, 1)).toBe("");
    });

    it("should return specified total label", () => {
      layout.totals.label = "Whatever";
      expect(getTotalInfo(layout, true, 0, 0)).toBe("Whatever");
    });

    it("should return total label for first dimension as empty string, when the label is set to empty string", () => {
      layout.totals.label = "";
      expect(getTotalInfo(layout, true, 0, 0)).toBe("");
    });
  });

  describe("getTotalPosition:", () => {
    let expectedPosition: TotalsPosition;
    let viewService: ViewService;

    beforeEach(() => {
      expectedPosition = { atBottom: false, atTop: false };
      viewService = {} as ViewService;
    });

    describe("When viewService?.viewState?.skipTotals is set", () => {
      it("should not show totals at top when the position is set to top but viewService?.viewState?.skipTotals = true", () => {
        layout.totals.position = "top";
        viewService.viewState = { skipTotals: true } as ViewState;
        expect(getTotalPosition(layout, viewService)).toEqual(expectedPosition);
      });

      it("should show totals at top when the position is set to top and viewService?.viewState?.skipTotals is falsy", () => {
        layout.totals.position = "top";
        expectedPosition.atTop = true;
        viewService.viewState = { skipTotals: false } as ViewState;
        expect(getTotalPosition(layout, viewService)).toEqual(expectedPosition);
      });
    });

    describe("When total auto mode is off", () => {
      it("should show totals at top when the position is set to top", () => {
        layout.totals.position = "top";
        expectedPosition.atTop = true;
        expect(getTotalPosition(layout, viewService)).toEqual(expectedPosition);
      });

      it("should show totals at bottom when the position is set to bottom", () => {
        layout.totals.position = "bottom";
        expectedPosition.atBottom = true;
        expect(getTotalPosition(layout, viewService)).toEqual(expectedPosition);
      });

      it("should not show totals when the position is set to none", () => {
        expect(getTotalPosition(layout, viewService)).toEqual(expectedPosition);
      });

      it("should not show totals when position is set to top but there is no grandTotal", () => {
        layout.totals.position = "top";
        layout.qHyperCube.qGrandTotalRow.length = 0;
        expect(getTotalPosition(layout, viewService)).toEqual(expectedPosition);
      });

      it("should not show totals when position is set to top but table has only dimensions", () => {
        layout.totals.position = "top";
        layout.qHyperCube.qMeasureInfo.length = 0;
        expect(getTotalPosition(layout, viewService)).toEqual(expectedPosition);
      });

      it("should show totals when table has only measure", () => {
        layout.qHyperCube.qDimensionInfo.length = 0;
        layout.totals.position = "top";
        expectedPosition.atTop = true;
        expect(getTotalPosition(layout, viewService)).toEqual(expectedPosition);
      });
    });

    describe("When total auto mode is on", () => {
      it("should show totals at top by default", () => {
        layout.totals.show = true;
        layout.totals.position = "noTotals";
        expectedPosition.atTop = true;
        expect(getTotalPosition(layout, viewService)).toEqual(expectedPosition);
      });

      it("should not show totals when table has only measures", () => {
        layout.totals.show = true;
        layout.qHyperCube.qDimensionInfo.length = 0;
        expect(getTotalPosition(layout, viewService)).toEqual(expectedPosition);
      });
    });
  });
});
