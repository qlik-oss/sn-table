import { TotalsPosition } from '../../../types';
import findVisibleRows from '../find-visible-rows';

type Rect = {
  y: number;
  height: number;
};

describe('find-visible-rows', () => {
  let rootElement: HTMLElement;
  let totalsPosition: TotalsPosition;
  let tableContainer;
  let headRow;
  let totalsRow: unknown;
  let dataRows: Array<unknown>;
  let tableContainerRect: Rect;
  let headRowRect: Rect;
  let totalsRowRec: Rect;
  const rowIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const createElements = (scrollTop: number) => {
    const rowRects: Array<Rect> = [];
    rowIndices.forEach((item, i) => {
      const y = i ? rowRects[i - 1].y + rowRects[i - 1].height : scrollTop;
      const height = 20 + i * 5;
      rowRects[i] = { y, height };
    });
    dataRows = rowRects.map((rect) => ({ getBoundingClientRect: (): Rect => rect }));

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
    tableContainerRect = { y: 0, height: 300 };
    headRowRect = { y: 0, height: 50 };
  });

  describe('no total row', () => {
    beforeEach(() => {
      totalsPosition = { atTop: false, atBottom: false };
      totalsRow = undefined;
    });

    it('should return correct visible row indices when the whole first row is visible', () => {
      createElements(50);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(0);
      expect(visibleRowEndIndex).toEqual(6);
    });

    it('should return correct visible row indices when 50% of the first row is visible', () => {
      createElements(40);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(0);
      expect(visibleRowEndIndex).toEqual(6);
    });

    it('should return correct visible row indices when less than 50% of the first row is half visible', () => {
      createElements(39);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(1);
      expect(visibleRowEndIndex).toEqual(6);
    });

    it('should return correct visible row indices when the whole last row is visible', () => {
      createElements(-125);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(6);
      expect(visibleRowEndIndex).toEqual(9);
    });

    it('should return correct visible row indices when 50% of the last row is visible', () => {
      createElements(-92.5);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(5);
      expect(visibleRowEndIndex).toEqual(9);
    });

    it('should return correct visible row indices when  lest than 50% of the last row is visible', () => {
      createElements(-91.5);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(5);
      expect(visibleRowEndIndex).toEqual(8);
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
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(0);
      expect(visibleRowEndIndex).toEqual(6);
    });

    it('should return correct visible row indices when 50% of the first row is visible', () => {
      createElements(40);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(0);
      expect(visibleRowEndIndex).toEqual(6);
    });

    it('should return correct visible row indices when less than 50% of the first row is half visible', () => {
      createElements(39);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(1);
      expect(visibleRowEndIndex).toEqual(6);
    });

    it('should return correct visible row indices when the whole last row is visible', () => {
      createElements(-145);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(6);
      expect(visibleRowEndIndex).toEqual(9);
    });

    it('should return correct visible row indices when 50% of the last row is visible', () => {
      createElements(-112.5);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(5);
      expect(visibleRowEndIndex).toEqual(9);
    });

    it('should return correct visible row indices when  lest than 50% of the last row is visible', () => {
      createElements(-111.5);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(5);
      expect(visibleRowEndIndex).toEqual(8);
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
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(0);
      expect(visibleRowEndIndex).toEqual(6);
    });

    it('should return correct visible row indices when 50% of the first row is visible', () => {
      createElements(60);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(0);
      expect(visibleRowEndIndex).toEqual(6);
    });

    it('should return correct visible row indices when less than 50% of the first row is half visible', () => {
      createElements(59);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(1);
      expect(visibleRowEndIndex).toEqual(6);
    });

    it('should return correct visible row indices when the whole last row is visible', () => {
      createElements(-125);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(6);
      expect(visibleRowEndIndex).toEqual(9);
    });

    it('should return correct visible row indices when 50% of the last row is visible', () => {
      createElements(-92.5);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(5);
      expect(visibleRowEndIndex).toEqual(9);
    });

    it('should return correct visible row indices when  lest than 50% of the last row is visible', () => {
      createElements(-91.5);
      const { visibleRowStartIndex, visibleRowEndIndex } = findVisibleRows(rootElement, totalsPosition);
      expect(visibleRowStartIndex).toEqual(5);
      expect(visibleRowEndIndex).toEqual(8);
    });
  });
});
