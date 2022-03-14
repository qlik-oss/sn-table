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
        scrollWidth: 2327,
        offsetWidth: 958,
        scrollLeft: 0,
      };
      isRTL = true;
    });

    it('should run preventDefault when scroll to leftmost place in ltr direction', () => {
      isRTL = false;
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should run preventDefault when scroll to rightmost place in ltr direction', () => {
      evt = {
        ...evt,
        deltaX: 10,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 1369,
      };
      isRTL = false;
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should not run preventDefault when not scroll to leftmost place in ltr direction', () => {
      isRTL = false;
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 400,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });

    it('should not run preventDefault when not scroll to rightmost place in ltr direction', () => {
      evt = {
        ...evt,
        deltaX: 10,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 400,
      };
      isRTL = false;
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });

    it('should run preventDefault when scroll to leftmost place in isRTL direction', () => {
      evt = {
        ...evt,
        deltaX: -1,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: -1369,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should run preventDefault when scroll to rightmost place in isRTL direction', () => {
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

    it('should not run preventDefault when not scroll to leftmost place in isRTL direction', () => {
      evt = {
        ...evt,
        deltaX: -10,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: -855,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });

    it('should not run preventDefault when not scroll to rightmost place in isRTL direction', () => {
      evt = {
        ...evt,
        deltaX: 10,
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

    it('should scroll to the top when you reach the top two rows', () => {
      focusedCellCoord = [1, 0];

      handleNavigateTop({ tableContainerRef, focusedCellCoord, rootElement });
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
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
      // 700 - 100 - 128 = 472 => so our scrollTo function migth be called with 600
      const targetOffsetTop = 472;

      handleNavigateTop({ tableContainerRef, focusedCellCoord, rootElement });
      expect(scrollTo).toHaveBeenCalledTimes(1);
      expect(scrollTo).toHaveBeenCalledWith({ top: targetOffsetTop, behavior: 'smooth' });
    });
  });
});
