import { handleScroll, handleNavigateTop } from '../handle-scroll';

describe('handle-scroll', () => {
  describe('handleNavigateTop', () => {
    let evt;
    let tableSection;

    beforeEach(() => {
      evt = {
        stopPropagation: sinon.spy(),
        preventDefault: sinon.spy(),
        deltaX: -1,
      };
      tableSection = {
        current: {
          scrollWidth: 2327,
          offsetWidth: 958,
          scrollLeft: 0,
        },
      };
    });

    it('should run preventDefault when scroll to leftmost place', () => {
      handleScroll(evt, tableSection);
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).have.been.calledOnce;
    });

    it('should not run preventDefault when not scroll to leftmost place', () => {
      tableSection.current.scrollLeft = 1369;
      handleScroll(evt, tableSection);
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(evt.preventDefault).not.have.been.called;
    });
  });

  describe('handleNavigateTop', () => {
    let rowHeight;
    let scrollTo;
    let tableSectionRef;
    let focusedCellCoord;
    let rootElement;

    beforeEach(() => {
      rowHeight = 100;
      scrollTo = sinon.spy();
      tableSectionRef = { current: { scrollTo } };
      focusedCellCoord = [0, 0];
      rootElement = {
        getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }],
        querySelector: () => cell,
      };
    });

    it('should not do anything when ref is not setup yet', () => {
      tableSectionRef.current = {};

      handleNavigateTop({ tableSectionRef, focusedCellCoord, rootElement });
      expect(scrollTo).to.not.have.been.called;
    });

    it('should scroll to the top when you reach the top two rows', () => {
      focusedCellCoord = [1, 0];

      handleNavigateTop({ tableSectionRef, focusedCellCoord, rootElement });
      expect(scrollTo).to.have.been.calledOnce;
    });

    it('should scroll upwards automatically if it detects the cursor gets behind <TableHead />', () => {
      const SCROLL_TOP_IDX = 7;
      focusedCellCoord = [8, 0];
      tableSectionRef = { current: { scrollTo, scrollTop: SCROLL_TOP_IDX * rowHeight } };
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
      // targetOffsetTop = tableSection.current.scrollTop - cell.offsetHeight - tableHead.offsetHeight;
      // 700 - 100 - 128 = 472 => so our scrollTo function migth be called with 600
      const targetOffsetTop = 472;

      handleNavigateTop({ tableSectionRef, focusedCellCoord, rootElement });
      expect(scrollTo).to.have.been.calledOnce;
      expect(scrollTo).to.have.been.calledOnceWith({ top: targetOffsetTop, behavior: 'smooth' });
    });
  });
});
