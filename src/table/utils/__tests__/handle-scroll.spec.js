import { handleHorizontalScroll, handleNavigateTop } from '../handle-scroll';

describe('handle-scroll', () => {
  describe('handleHorizontalScroll', () => {
    let evt;
    let memoedContainer;
    let isRTL;

    beforeEach(() => {
      evt = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        deltaX: -1,
      };
      memoedContainer = {
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

    it('should not run preventDefault when the scrollbar is at its leftmost place but is not scrolled left in LTR direction', () => {
      isRTL = false;
      evt = {
        ...evt,
        deltaX: 0,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });

    it('should not run preventDefault when the scrollbar is at its rightmost place but is not scrolled right in LTR direction', () => {
      evt = {
        ...evt,
        deltaX: 0,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 100,
      };
      isRTL = false;
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
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

    it('should not run preventDefault when the scrollbar is at its leftmost place but is not scroll left in RTL direction', () => {
      evt = {
        ...evt,
        deltaX: 0,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: -100,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });

    it('should not run preventDefault when the scrollbar is at its rightmost place but is not scrolled right in RTL direction', () => {
      evt = {
        ...evt,
        deltaX: 0,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 1,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('handleNavigateTop', () => {
    let rowHeight;
    let scrollTo;
    let tableContainerRef;
    let focusedCellCoord;
    let rootElement;

    beforeEach(() => {
      rowHeight = 100;
      scrollTo = jest.fn();
      tableContainerRef = { current: { scrollTo } };
      focusedCellCoord = [0, 0];
      rootElement = {};
    });

    it('should not do anything when ref is not setup yet', () => {
      tableContainerRef.current = {};

      handleNavigateTop({ tableContainerRef, focusedCellCoord, rootElement });
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it('should scroll upwards automatically if it detects the cursor gets behind <TableHead />', () => {
      const SCROLL_TOP_IDX = 7;
      focusedCellCoord = [8, 0];
      tableContainerRef = { current: { scrollTo, scrollTop: SCROLL_TOP_IDX * rowHeight } };
      rootElement = {
        getElementsByClassName: (query) => {
          if (query === 'sn-table-head-cell') {
            return [{ offsetHeight: 128 }];
          }

          return Array.from(Array(10).keys()).map((idx) => {
            const rowCell = {
              offsetHeight: rowHeight,
              offsetTop: idx * rowHeight,
            };

            return { getElementsByClassName: () => [rowCell] };
          });
        },
      };
      // targetOffsetTop = tableContainer.current.scrollTop - cell.offsetHeight - tableHead.offsetHeight;
      // 700 - 100 - 128 = 472 => so our scrollTo function might be called with 600
      const targetOffsetTop = 472;

      handleNavigateTop({ tableContainerRef, focusedCellCoord, rootElement });
      expect(scrollTo).toHaveBeenCalledTimes(1);
      expect(scrollTo).toHaveBeenCalledWith({ top: targetOffsetTop, behavior: 'instant' });
    });
  });
});
