import { TotalsPosition, ViewService } from '../../../types';
import { findPaginationVisibleRows, findVirtualizedVisibleRows, getPartialTopScrollHeight } from '../find-visible-rows';

type RowRect = {
  top: number;
  bottom: number;
};

type Rect = {
  y: number;
  height: number;
};

const rowIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const createRects = (scrollTop: number) => {
  const rects: Array<RowRect> = [];
  rowIndices.forEach((i) => {
    // The previous row bottom value is the top value of the next row
    const top = i > 0 ? rects[i - 1].bottom : scrollTop;
    const bottom = top + 20;
    rects[i] = { top, bottom };
  });
  return rects;
};

describe('find-visible-rows', () => {
  describe('findPaginationVisibleRows', () => {
    let rootElement: HTMLElement;
    let totalsPosition: TotalsPosition;
    let tableContainer;
    let headRow;
    let totalsRow: unknown;
    let dataRows: Array<unknown>;
    let tableContainerRect: Rect;
    let headRowRect: Rect;
    let totalsRowRec: Rect;

    const createElements = (scrollTop: number) => {
      const rowRects = createRects(scrollTop);
      dataRows = rowRects.map((rect) => ({ getBoundingClientRect: (): RowRect => rect }));

      rootElement = {
        getElementsByClassName: (className: string) => {
          tableContainer = { getBoundingClientRect: (): Rect => tableContainerRect };
          headRow = { getBoundingClientRect: (): Rect => headRowRect };
          if (className === 'sn-table-totals-row') return [totalsRow];
          if (className === 'sn-table-container') return [tableContainer];
          if (className === 'sn-table-head-row') return [headRow];
          if (className === 'sn-table-data-row') return dataRows;
          return undefined;
        },
      } as unknown as HTMLDivElement;
    };

    beforeEach(() => {
      tableContainerRect = { y: 0, height: 200 };
      headRowRect = { y: 0, height: 50 };
    });

    describe('no total row', () => {
      beforeEach(() => {
        totalsPosition = { atTop: false, atBottom: false };
        totalsRow = undefined;
      });

      it('should return correct visible row indices when the whole first row is visible', () => {
        createElements(50);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(0);
        expect(visibleRowEndIndex).toEqual(7);
      });

      it('should return correct visible row indices when the first row is partially visible', () => {
        createElements(40);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(0);
        expect(visibleRowEndIndex).toEqual(7);
      });

      it('should return correct visible row indices when the whole last row is visible', () => {
        createElements(-100);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(7);
        expect(visibleRowEndIndex).toEqual(10);
      });

      it('should return correct visible row indices when the last row is partially visible', () => {
        createElements(-90);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(7);
        expect(visibleRowEndIndex).toEqual(10);
      });
    });

    describe('total row at bottom', () => {
      beforeEach(() => {
        totalsRowRec = { y: 280, height: 20 };
        totalsRow = { getBoundingClientRect: (): Rect => totalsRowRec };
        totalsPosition = { atTop: false, atBottom: true };
      });

      it('should return correct visible row indices when the whole first row is visible', () => {
        createElements(50);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(0);
        expect(visibleRowEndIndex).toEqual(6);
      });

      it('should return correct visible row indices when the first row is visible partially', () => {
        createElements(40);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(0);
        expect(visibleRowEndIndex).toEqual(6);
      });

      it('should return correct visible row indices when the whole last row is visible', () => {
        createElements(-100);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(7);
        expect(visibleRowEndIndex).toEqual(10);
      });

      it('should return correct visible row indices when the last row is visible partially', () => {
        createElements(-90);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(7);
        expect(visibleRowEndIndex).toEqual(10);
      });
    });

    describe('total row at top', () => {
      beforeEach(() => {
        totalsRowRec = { y: 50, height: 20 };
        totalsRow = { getBoundingClientRect: (): Rect => totalsRowRec };
        totalsPosition = { atTop: true, atBottom: false };
      });

      it('should return correct visible row indices when the whole first row is visible', () => {
        createElements(70);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(0);
        expect(visibleRowEndIndex).toEqual(6);
      });

      it('should return correct visible row indices when the first row is visible partially', () => {
        createElements(60);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(0);
        expect(visibleRowEndIndex).toEqual(6);
      });

      it('should return correct visible row indices when the whole last row is visible', () => {
        createElements(-100);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(8);
        expect(visibleRowEndIndex).toEqual(10);
      });

      it('should return correct visible row indices when the last row is partially visible', () => {
        createElements(-90);
        const { visibleRowStartIndex, visibleRowEndIndex } = findPaginationVisibleRows(rootElement, totalsPosition);
        expect(visibleRowStartIndex).toEqual(8);
        expect(visibleRowEndIndex).toEqual(10);
      });
    });

    describe('getPartialTopScrollHeight', () => {
      it('should return a partial height when there is a valid rowRect', () => {
        const rows = [
          { getBoundingClientRect: () => ({ top: 100 }) },
          { getBoundingClientRect: () => ({ top: 200 }) },
        ] as unknown as HTMLCollectionOf<Element>;
        const tableBodyRect = { top: 400, bottom: 400 };
        const partialHeight = getPartialTopScrollHeight(rows, tableBodyRect, 1);
        expect(partialHeight).toBe(200);
      });

      it('should return zero when rowRect top and table body top are equal', () => {
        const rows = [
          { getBoundingClientRect: () => ({ top: 100 }) },
          { getBoundingClientRect: () => ({ top: 200 }) },
        ] as unknown as HTMLCollectionOf<Element>;
        const tableBodyRect = { top: 200, bottom: 400 };
        const partialHeight = getPartialTopScrollHeight(rows, tableBodyRect, 1);
        expect(partialHeight).toBe(0);
      });

      it('should return zero when the row index is invalid', () => {
        const rows = [{ getBoundingClientRect: () => ({ top: 100 }) }] as unknown as HTMLCollectionOf<Element>;
        const tableBodyRect = { top: 400, bottom: 400 };
        const partialHeight = getPartialTopScrollHeight(rows, tableBodyRect, -1);
        expect(partialHeight).toBe(0);
      });

      it('should return zero when the rows are undefined', () => {
        const rows = [] as unknown as HTMLCollectionOf<Element>;
        const tableBodyRect = { top: 400, bottom: 400 };
        const partialHeight = getPartialTopScrollHeight(rows, tableBodyRect, 1);
        expect(partialHeight).toBe(0);
      });
    });
  });

  describe('findVirtualizedVisibleRows', () => {
    let rootElement: HTMLElement;
    let tableBody: {
      getBoundingClientRect?: () => Rect;
      querySelectorAll?: () => any;
    };
    let bodyRect: Rect;
    let cells: { getAttribute: () => string; getBoundingClientRect: () => Rect }[];
    let viewService: ViewService;
    const createNewRects = (scrollTop: number) => {
      const rects: Array<Rect> = [];
      rowIndices.forEach((item, i) => {
        const y = i > 0 ? rects[i - 1].y + rects[i - 1].height : scrollTop;
        const height = 20 + i * 5;
        rects[i] = { y, height };
      });
      return rects;
    };
    const createCell = (rect: Rect, index: number) => ({
      getAttribute: () => index.toString(),
      getBoundingClientRect: () => rect,
    });
    const createElements = (scrollTop: number) => {
      const cellRects = createNewRects(scrollTop);
      cells = cellRects.map((rect, index) => createCell(rect, index));
      tableBody = {
        getBoundingClientRect: (): Rect => bodyRect,
        querySelectorAll: () => cells,
      };
      rootElement = {
        querySelector: () => tableBody,
      } as unknown as HTMLDivElement;
    };

    beforeEach(() => {
      bodyRect = { y: 0, height: 495 };
    });

    describe('scrollTopRatio = 1', () => {
      beforeEach(() => {
        tableBody = {};
        viewService = {
          scrollTopRatio: 1,
          visibleTop: 0,
          visibleHeight: 11,
          page: 0,
          rowsPerPage: 100,
          qTop: 0,
          qHeight: 100,
        };
      });

      it('should return correct visible row indices when the whole first row is visible', () => {
        createElements(0);
        const { visibleRowStartIndex, visibleRowEndIndex } = findVirtualizedVisibleRows(rootElement, viewService);
        expect(visibleRowStartIndex).toEqual(0);
        expect(visibleRowEndIndex).toEqual(10);
      });

      it('should return correct visible row indices when the first row is partially visible', () => {
        createElements(-4);
        const { visibleRowStartIndex, visibleRowEndIndex } = findVirtualizedVisibleRows(rootElement, viewService);
        expect(visibleRowStartIndex).toEqual(0);
        expect(visibleRowEndIndex).toEqual(10);
      });

      it('should return correct visible row indices when more than 4px in the top of the first row is not visible', () => {
        createElements(-10);
        const { visibleRowStartIndex, visibleRowEndIndex } = findVirtualizedVisibleRows(rootElement, viewService);
        expect(visibleRowStartIndex).toEqual(1);
        expect(visibleRowEndIndex).toEqual(10);
      });
    });

    describe('scrollTopRatio < 1', () => {
      beforeEach(() => {
        tableBody = {};
        viewService = {
          scrollTopRatio: 0.9,
          visibleTop: 0,
          visibleHeight: 11,
          page: 0,
          rowsPerPage: 100,
          qTop: 0,
          qHeight: 100,
        };
      });

      it('should return correct visible row indices when the whole first row and the whole last row are visible', () => {
        createElements(0);
        const { visibleRowStartIndex, visibleRowEndIndex } = findVirtualizedVisibleRows(rootElement, viewService);
        expect(visibleRowStartIndex).toEqual(0);
        expect(visibleRowEndIndex).toEqual(10);
      });

      it('should return correct visible row indices when the first row the last row are partially visible', () => {
        createElements(-9);
        const { visibleRowStartIndex, visibleRowEndIndex } = findVirtualizedVisibleRows(rootElement, viewService);
        expect(visibleRowStartIndex).toEqual(0);
        expect(visibleRowEndIndex).toEqual(10);
      });
    });
  });
});
