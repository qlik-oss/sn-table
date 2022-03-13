import { handleHorizontalScroll, handleNavigateTop } from '../handle-scroll';

describe('handle-scroll', () => {
  describe('handleHorizontalScroll', () => {
    let evt;
    let memoedContainer;
    let isRTL;

    beforeEach(() => {
      evt = {
        stopPropagation: sinon.spy(),
        preventDefault: sinon.spy(),
        deltaX: -1,
      };
      memoedContainer = {
        scrollWidth: 2327,
        offsetWidth: 958,
        scrollLeft: 0,
      };
      isRTL = true;
    });

    it('should run preventDefault when scroll to the leftmost place and keep scrolling left in LTR direction', () => {
      isRTL = false;
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).have.been.calledOnce;
    });

    it('should run preventDefault when scroll to the rightmost place and keep scrolling right in LTR direction', () => {
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
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).have.been.calledOnce;
    });

    it('should not run preventDefault when not scroll to the leftmost place or the rightmost place in LTR direction', () => {
      isRTL = false;
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 400,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).not.have.been.called;
    });

    it('should not run preventDefault when scroll to the leftmost place but not keep scrolling left in LTR direction', () => {
      isRTL = false;
      evt = {
        ...evt,
        deltaX: 0,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).not.have.been.called;
    });

    it('should not run preventDefault when scroll to the rightmost place but not keep scrolling right in LTR direction', () => {
      evt = {
        ...evt,
        deltaX: 0,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 1369,
      };
      isRTL = false;
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).not.have.been.called;
    });

    it('should run preventDefault when scroll to the leftmost place and keep scrolling left in RTL direction', () => {
      evt = {
        ...evt,
        deltaX: -1,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: -1369,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).have.been.calledOnce;
    });

    it('should run preventDefault when scroll to the rightmost place and and keep scrolling right in RTL direction', () => {
      evt = {
        ...evt,
        deltaX: 1,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 1,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).have.been.calledOnce;
    });

    it('should not run preventDefault when not scroll to the leftmost place or the rightmost place in RTL direction', () => {
      evt = {
        ...evt,
        deltaX: -10,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: -855,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).not.have.been.called;
    });

    it('should not run preventDefault when scroll to the leftmost place but not keep scrolling left in RTL direction', () => {
      evt = {
        ...evt,
        deltaX: 0,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: -1369,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).not.have.been.called;
    });

    it('should not run preventDefault when scroll to the rightmost place but not keep scrolling right in RTL direction', () => {
      evt = {
        ...evt,
        deltaX: 0,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 1,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).not.have.been.called;
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
      scrollTo = sinon.spy();
      tableContainerRef = { current: { scrollTo } };
      focusedCellCoord = [0, 0];
      rootElement = {};
    });

    it('should not do anything when ref is not setup yet', () => {
      tableContainerRef.current = {};

      handleNavigateTop({ tableContainerRef, focusedCellCoord, rootElement });
      expect(scrollTo).to.not.have.been.called;
    });

    it('should scroll to the top when you reach the top two rows', () => {
      focusedCellCoord = [1, 0];

      handleNavigateTop({ tableContainerRef, focusedCellCoord, rootElement });
      expect(scrollTo).to.have.been.calledWith({ top: 0, behavior: 'smooth' });
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
      expect(scrollTo).to.have.been.calledOnce;
      expect(scrollTo).to.have.been.calledOnceWith({ top: targetOffsetTop, behavior: 'smooth' });
    });
  });
});
