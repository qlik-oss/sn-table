import { number } from 'yargs';
import { handleHorizontalScroll, handleNavigateTop } from '../handle-scroll';

describe('handle-scroll', () => {
  describe('handleHorizontalScroll', () => {
    let evt: WheelEvent;
    let memoedContainer: HTMLDivElement;
    let isRTL: boolean;

    beforeEach(() => {
      evt = {
        ...evt,
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        deltaX: -1,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollWidth: 200,
        offsetWidth: 100,
        scrollLeft: 0,
      };
      isRTL = true;
    });

    it('should run preventDefault when the scrollbar is at its leftmost place and is scrolled left in LTR direction', () => {
      isRTL = false;
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should run preventDefault when the scrollbar is at its rightmost place and is scrolled right in LTR direction', () => {
      evt = {
        ...evt,
        deltaX: 1,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 100.5,
      };
      isRTL = false;
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should not run preventDefault when the scrollbar is not at its leftmost place or the rightmost place in LTR direction', () => {
      isRTL = false;
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 50,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });

    it('should early return when the it does not scroll horizontally', () => {
      isRTL = false;
      evt = {
        ...evt,
        deltaX: 0,
      };
      const result = handleHorizontalScroll(evt, isRTL, memoedContainer);

      expect(result).toBe(undefined);
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });

    it('should run preventDefault when the scrollbar is at its leftmost place and is scrolled left in RTL direction', () => {
      evt = {
        ...evt,
        deltaX: -1,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: -100,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should run preventDefault when the scrollbar is at its rightmost place and and is scrolled right in RTL direction', () => {
      evt = {
        ...evt,
        deltaX: 1,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 1,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should not run preventDefault when the scrollbar is not at its leftmost place or the rightmost place in RTL direction', () => {
      evt = {
        ...evt,
        deltaX: -10,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: -50,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('handleNavigateTop', () => {
    let tableContainerRef: {
      current: {
        scrollTo?: () => void;
        scrollTop?: number;
      };
    };
    let focusedCellCoord: [number, number];
    let rootElement: Element;
    let rowHeight: number;

    beforeEach(() => {
      rowHeight = 100;
      tableContainerRef = {
        current: {
          scrollTo: jest.fn(),
        },
      };
      focusedCellCoord = [0, 0];
    });

    it('should not do anything when ref is not setup yet', () => {
      delete tableContainerRef.current.scrollTo;
      expect(
        handleNavigateTop({
          tableContainerRef: tableContainerRef as React.MutableRefObject<HTMLDivElement>,
          focusedCellCoord,
          rootElement,
        })
      ).toBe(undefined);
    });

    it('should the scrollbar is at its top when you reach the top two rows', () => {
      focusedCellCoord = [1, 0];

      handleNavigateTop({
        tableContainerRef: tableContainerRef as React.MutableRefObject<HTMLDivElement>,
        focusedCellCoord,
        rootElement,
      });
      expect(tableContainerRef.current.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should scroll upwards automatically if it detects the cursor gets behind <TableHead />', () => {
      const SCROLL_TOP_IDX = 7;
      focusedCellCoord = [8, 0];
      tableContainerRef = {
        current: {
          scrollTo: jest.fn(),
          scrollTop: SCROLL_TOP_IDX * rowHeight,
        },
      };

      rootElement = {
        getElementsByClassName: (query: string) => {
          if (query === 'sn-table-head-cell') {
            return [{ offsetHeight: 128 }];
          }
          return Array.from(Array(10).keys()).map((idx) => {
            return {
              getElementsByClassName: () => [
                {
                  offsetHeight: rowHeight,
                  offsetTop: idx * rowHeight,
                },
              ],
            };
          });
        },
      };

      // targetOffsetTop = tableContainer.current.scrollTop - cell.offsetHeight - tableHead.offsetHeight;
      // 700 - 100 - 128 = 472 => so our scrollTo function might be called with 600
      const targetOffsetTop = 472;

      handleNavigateTop({
        tableContainerRef: tableContainerRef as React.MutableRefObject<HTMLDivElement>,
        focusedCellCoord,
        rootElement,
      });
      expect(tableContainerRef.current.scrollTo).toHaveBeenCalledTimes(1);
      expect(tableContainerRef.current.scrollTo).toHaveBeenCalledWith({ top: targetOffsetTop, behavior: 'smooth' });
    });
  });
});
