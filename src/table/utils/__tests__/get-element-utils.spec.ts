import { findCellWithTabStop, getNextCellCoord } from "../get-element-utils";

describe("get-element-utils", () => {
  let cell: HTMLElement | undefined;
  let rootElement: HTMLElement;

  beforeEach(() => {
    cell = { focus: jest.fn(), blur: jest.fn(), setAttribute: jest.fn() } as unknown as HTMLElement;
    rootElement = {
      getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }],
      querySelector: () => cell,
    } as unknown as HTMLElement;
  });

  afterEach(() => jest.clearAllMocks());

  describe("findCellWithTabStop", () => {
    const elementCreator = (type: string, tabIdx: string) => {
      const targetElement = global.document.createElement(type);
      targetElement.setAttribute("tabIndex", tabIdx);
      return targetElement;
    };

    beforeEach(() => {
      rootElement = {
        querySelector: () => {
          if ((cell?.tagName === "TD" || cell?.tagName === "TH") && cell?.getAttribute("tabIndex") === "0") return cell;
          return null;
        },
      } as unknown as HTMLElement;
    });

    it("should return active td element", () => {
      cell = elementCreator("td", "0");

      const cellElement = findCellWithTabStop(rootElement);

      expect(cellElement).not.toBeNull();
      expect(cellElement?.tagName).toBe("TD");
      expect(cellElement?.getAttribute("tabIndex")).toBe("0");
    });

    it("should return active th element", () => {
      cell = elementCreator("th", "0");
      const cellElement = findCellWithTabStop(rootElement);

      expect(cellElement).not.toBeNull();
      expect(cellElement?.tagName).toBe("TH");
      expect(cellElement?.getAttribute("tabIndex")).toBe("0");
    });

    it("should return null", () => {
      cell = elementCreator("div", "-1");
      const cellElement = findCellWithTabStop(rootElement);
      expect(cellElement).toBeNull();
    });
  });

  describe("getNextCellCoord", () => {
    let rowCount: number;
    let columnCount: number;
    let rowIndex: number;
    let colIndex: number;
    let evt: React.KeyboardEvent;

    beforeEach(() => {
      evt = {} as unknown as React.KeyboardEvent;
      rowCount = 1;
      columnCount = 1;
      rootElement = {
        getElementsByClassName: (className: string) =>
          className === "sn-table-row" ? Array(rowCount) : Array(columnCount),
      } as unknown as HTMLElement;
      rowIndex = 0;
      colIndex = 0;
    });

    it("should stay the current cell when move down", () => {
      evt.key = "ArrowDown";
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it("should not move to the next row when the totals row is set at the bottom", () => {
      evt.key = "ArrowDown";
      const allowedRows = { top: 0, bottom: 1 };
      rowCount = 3;
      rowIndex = 1;
      colIndex = 0;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex], allowedRows);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(0);
    });

    it("should stay the current cell when move up", () => {
      evt.key = "ArrowUp";
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it("should go to one row down cell", () => {
      evt.key = "ArrowDown";
      rowCount = 2;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(0);
    });

    it("should go to one row up cell", () => {
      evt.key = "ArrowUp";
      rowCount = 2;
      rowIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it("should go to one column left cell", () => {
      evt.key = "ArrowLeft";
      columnCount = 2;
      colIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it("should go to one column right cell", () => {
      evt.key = "ArrowRight";
      columnCount = 2;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(1);
    });

    it("should stay the current cell when other keys are pressed", () => {
      evt.key = "Control";
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it("should move to the next row when you reach to the end of the current row", () => {
      evt.key = "ArrowRight";
      rowCount = 3;
      columnCount = 3;
      rowIndex = 1;
      colIndex = 3;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(2);
      expect(nextCol).toBe(0);
    });

    it("should move to the prev row when we reach to the beginning of the current row", () => {
      evt.key = "ArrowLeft";
      rowCount = 3;
      columnCount = 3;
      rowIndex = 2;
      colIndex = 0;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(2);
    });

    it("should stay at the first row and first col of table when we reached to the beginning of the table", () => {
      evt.key = "ArrowLeft";
      rowCount = 2;
      columnCount = 2;
      rowIndex = 0;
      colIndex = 0;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it("should stay at the end row and end col of table when you reached to the end of the table", () => {
      evt.key = "ArrowRight";
      rowCount = 2;
      columnCount = 2;
      rowIndex = 1;
      colIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(1);
    });

    it("should stay at the current cell when allowedRows cell index is 1 and trying to move up from rowIdx 1", () => {
      evt.key = "ArrowUp";
      const allowedRows = { top: 1, bottom: 0 };
      rowCount = 3;
      rowIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex], allowedRows);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(0);
    });

    it("should stay at the current cell when trying to move left and allowedRows is > 0 (i.e in selection mode", () => {
      evt.key = "ArrowLeft";
      const allowedRows = { top: 1, bottom: 0 };
      rowCount = 3;
      columnCount = 3;
      rowIndex = 1;
      colIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex], allowedRows);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(1);
    });

    it("should stay at the current cell when trying to move right and allowedRows is > 0 (i.e in selection mode", () => {
      evt.key = "ArrowRight";
      const allowedRows = { top: 1, bottom: 0 };
      rowCount = 3;
      columnCount = 3;
      rowIndex = 1;
      colIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex], allowedRows);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(1);
    });
  });
});
