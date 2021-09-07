import { expect } from 'chai';
import * as handleCellFocus from '../handle-cell-focus';

describe('handle-key-press', () => {
  let cell;
  let rootElement;
  let focusedCellCoord;
  let setfocusedCellCoord;

  beforeEach(() => {
    cell = { focus: sinon.spy(), blur: sinon.spy(), setAttribute: sinon.spy() };
    rootElement = { getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }] };
    focusedCellCoord = [0, 0];
    setfocusedCellCoord = sinon.spy();
  });

  describe('updateFocus', () => {
    let rowElements;
    let cellCoord;

    beforeEach(() => {
      rowElements = [{ getElementsByClassName: () => [cell] }];
      cellCoord = [0, 0];
    });

    it('should focus cell and call setAttribute', () => {
      handleCellFocus.updateFocus(rowElements, cellCoord);
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledOnce;
    });

    it('should blur cell and call setAttribute when shouldBlur is true', () => {
      const shouldFocus = false;

      handleCellFocus.updateFocus(rowElements, cellCoord, shouldFocus);
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledOnce;
    });

    it('should not focus cell nor cell setAttribute when cell is not found', () => {
      cellCoord = [1, 0];

      handleCellFocus.updateFocus(rowElements, cellCoord);
      expect(cell.focus).to.not.have.been.called;
      expect(cell.blur).to.not.have.been.called;
      expect(cell.setAttribute).to.not.have.been.called;
    });
  });

  describe('handleBodyCellFocus', () => {
    const cellData = {
      rawRowIdx: -1,
      rawColIdx: 0,
    };

    it('should call focusCell', () => {
      handleCellFocus.handleClickToFocusBody(cellData, focusedCellCoord, rootElement, setfocusedCellCoord);
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
      expect(setfocusedCellCoord).to.have.been.calledOnce;
    });
  });

  describe('handleHeadCellFocus', () => {
    const columnIndex = 0;

    it('should call focusCell', () => {
      handleCellFocus.handleClickToFocusHead(columnIndex, focusedCellCoord, rootElement, setfocusedCellCoord);
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
      expect(setfocusedCellCoord).to.have.been.calledOnce;
    });
  });

  describe('handleResetFocus', () => {
    let shouldRefocus;
    let hasSelections;
    let setfocusedCellCoord;

    beforeEach(() => {
      shouldRefocus = { current: false };
      hasSelections = false;
      setfocusedCellCoord = sinon.spy();
    });

    it('should set tabindex on the first cell and not focus', () => {
      handleCellFocus.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        hasSelections,
        setfocusedCellCoord,
      });
      expect(cell.focus).to.not.have.been.called;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
      expect(setfocusedCellCoord).to.have.been.calledOnceWith(focusedCellCoord);
    });

    it('should set tabindex on the first cell and focus when shouldRefocus is true', () => {
      shouldRefocus.current = true;

      handleCellFocus.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        hasSelections,
        setfocusedCellCoord,
      });
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
      expect(setfocusedCellCoord).to.have.been.calledOnceWith(focusedCellCoord);
    });

    it('should set tabindex on the first cell in currently focused column when hasSelections is true', () => {
      focusedCellCoord = [0, 1];
      rootElement = { getElementsByClassName: () => [{ getElementsByClassName: () => [cell, cell] }] };
      hasSelections = true;

      handleCellFocus.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        hasSelections,
        setfocusedCellCoord,
      });

      expect(cell.focus).to.not.have.been.called;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
      expect(setfocusedCellCoord).to.have.been.calledOnceWith(focusedCellCoord);
      expect(focusedCellCoord).to.eql([0, 1]);
    });
  });

  describe('handleNavigateTop', () => {
    let scrollTo;
    let tableSection;
    let rowHeight;

    beforeEach(() => {
      rowHeight = 100;
      scrollTo = sinon.spy();
      tableSection = { current: { scrollTo } };
    });

    it('should not do anything when ref is not setup yet', () => {
      tableSection.current = {};

      handleCellFocus.handleNavigateTop({ tableSection, focusedCellCoord, rootElement });
      expect(scrollTo).to.not.have.been.called;
    });

    it('should scroll to the top when you reach the top two rows', () => {
      focusedCellCoord = [1, 0];

      handleCellFocus.handleNavigateTop({ tableSection, focusedCellCoord, rootElement });
      expect(scrollTo).to.have.been.calledOnce;
    });

    it('should scroll upwards automatically if it detects the cursor gets behind <TableHead />', () => {
      let SCROLL_TOP_IDX = 7;
      focusedCellCoord = [8, 0];
      tableSection = { current: { scrollTo, scrollTop: SCROLL_TOP_IDX * rowHeight } };
      rootElement = {
        getElementsByClassName: () =>
          Array.from(Array(10).keys()).map((idx) => {
            let cell = {
              offsetHeight: rowHeight,
              offsetTop: idx * rowHeight,
            };

            return { getElementsByClassName: () => [cell] };
          }),
      };
      // targetOffsetTop = tableSection.current.scrollTop - cell.offsetHeight;
      // 700 - 100 = 600 => so our scrollTo function migth be called with 600
      let targetOffsetTop = 600;

      handleCellFocus.handleNavigateTop({ tableSection, focusedCellCoord, rootElement });
      expect(scrollTo).to.have.been.calledOnce;
      expect(scrollTo).to.have.been.calledOnceWith({ top: targetOffsetTop, behavior: 'smooth' });
    });
  });
});
