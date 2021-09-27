import { expect } from 'chai';
import * as handleCellFocus from '../handle-cell-focus';

describe('handle-key-press', () => {
  let cell;
  let rootElement;
  let focusedCellCoord;
  let setFocusedCellCoord;
  let keyboard;

  beforeEach(() => {
    cell = { focus: sinon.spy(), blur: sinon.spy(), setAttribute: sinon.spy() };
    rootElement = {
      getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }],
      querySelector: () => cell,
    };
    focusedCellCoord = [0, 0];
    setFocusedCellCoord = sinon.spy();
    keyboard = { focus: sinon.spy() };
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  describe('updateFocus', () => {
    let focusType;
    let rowElements;
    let cellCoord;
    let providedCell;

    beforeEach(() => {
      focusType = 'focus';
      rowElements = [{ getElementsByClassName: () => [cell] }];
      cellCoord = [0, 0];
    });

    it('should focus cell and call setAttribute when focusType is focus', () => {
      handleCellFocus.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.setAttribute).to.have.been.calledOnceWith('tabIndex', '0');
    });

    it('should blur cell and call setAttribute when focusType is blur', () => {
      focusType = 'blur';

      handleCellFocus.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).to.have.been.calledOnceWith('tabIndex', '-1');
    });

    it('should call setAttribute when focusType is addTab', () => {
      focusType = 'addTab';

      handleCellFocus.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.focus).to.not.have.been.called;
      expect(cell.setAttribute).to.have.been.calledOnceWith('tabIndex', '0');
    });

    it('should call setAttribute when focusType is removeTab', () => {
      focusType = 'removeTab';

      handleCellFocus.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.blur).to.not.have.been.called;
      expect(cell.setAttribute).to.have.been.calledOnceWith('tabIndex', '-1');
    });

    it('should not focus cell nor cell setAttribute when cell is not found', () => {
      cellCoord = [1, 0];

      handleCellFocus.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.focus).to.not.have.been.called;
      expect(cell.blur).to.not.have.been.called;
      expect(cell.setAttribute).to.not.have.been.called;
    });

    it('should pick up providedCell element if there was no rowElements provided', () => {
      providedCell = cell;

      handleCellFocus.updateFocus({ focusType, providedCell });
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.setAttribute).to.have.been.calledOnceWith('tabIndex', '0');
    });
  });

  describe('findCellWithTabStop', () => {
    const elementCreator = (type, tabIdx) => {
      const targetElement = global.document.createElement(type);
      targetElement.setAttribute('tabIndex', tabIdx);
      return targetElement;
    };

    beforeEach(() => {
      rootElement = {
        querySelector: () => {
          if ((cell.tagName === 'TD' || cell.tagName === 'TH') && cell.getAttribute('tabIndex') === '0') return cell;
          return null;
        },
      };
    });

    it('should return active td element', () => {
      cell = elementCreator('td', '0');

      const cellElement = handleCellFocus.findCellWithTabStop(rootElement);

      expect(cellElement).to.not.be.null;
      expect(cellElement.tagName).to.equal('TD');
      expect(cellElement).to.have.attr('tabIndex').match(/0/);
    });

    it('should return active th element', () => {
      cell = elementCreator('th', '0');

      const cellElement = handleCellFocus.findCellWithTabStop(rootElement);

      expect(cellElement).to.not.be.null;
      expect(cellElement.tagName).to.equal('TH');
      expect(cellElement).to.have.attr('tabIndex').match(/0/);
    });

    it('should return null', () => {
      cell = elementCreator('div', '-1');

      const cellElement = handleCellFocus.findCellWithTabStop(rootElement);

      expect(cellElement).to.be.null;
    });
  });

  describe('handleClickToFocusBody', () => {
    const cellData = {
      rawRowIdx: 0,
      rawColIdx: 0,
    };

    it('should call setFocusedCellCoord with adjusted index, and keyboard.focus', () => {
      handleCellFocus.handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard);
      expect(cell.setAttribute).have.been.calledOnceWith('tabIndex', '-1');
      expect(setFocusedCellCoord).to.have.been.calledOnceWith([1, 0]);
      expect(keyboard.focus).to.have.been.calledOnce;
    });
  });

  describe('handleClickToFocusHead', () => {
    const columnIndex = 2;

    it('should indirectly call updateFocus, setFocusedCellCoord and keyboard.focus', () => {
      handleCellFocus.handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard);
      expect(cell.setAttribute).have.been.calledOnceWith('tabIndex', '-1');
      expect(setFocusedCellCoord).to.have.been.calledOnceWith([0, 2]);
      expect(keyboard.focus).to.have.been.calledOnce;
    });
  });

  describe('handleResetFocus', () => {
    let shouldRefocus;
    let hasSelections;
    let shouldAddTabstop;

    beforeEach(() => {
      focusedCellCoord = [2, 1];
      shouldRefocus = { current: false };
      hasSelections = false;
      shouldAddTabstop = true;
    });

    it('should set tabindex on the first cell and not focus', () => {
      handleCellFocus.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        hasSelections,
        setFocusedCellCoord,
        shouldAddTabstop,
      });
      expect(cell.setAttribute).have.been.calledTwice;
      expect(setFocusedCellCoord).to.have.been.calledOnceWith([0, 0]);
      expect(cell.focus).to.not.have.been.called;
    });

    it('should set tabindex on the first cell and focus when shouldRefocus is true', () => {
      shouldRefocus.current = true;

      handleCellFocus.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        hasSelections,
        setFocusedCellCoord,
        shouldAddTabstop,
      });
      expect(cell.setAttribute).have.been.calledTwice;
      expect(setFocusedCellCoord).to.have.been.calledOnceWith([0, 0]);
      expect(cell.focus).to.have.been.called;
    });

    it('should set tabindex on the second cell in currently focused column when hasSelections is true', () => {
      hasSelections = true;
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      };

      handleCellFocus.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        hasSelections,
        setFocusedCellCoord,
        shouldAddTabstop,
      });
      expect(cell.setAttribute).have.been.calledTwice;
      expect(setFocusedCellCoord).to.have.been.calledOnceWith([1, 1]);
      expect(cell.focus).to.not.have.been.called;
    });
  });

  describe('handleNavigateTop', () => {
    let scrollTo;
    let tableSectionRef;
    let rowHeight;

    beforeEach(() => {
      rowHeight = 100;
      scrollTo = sinon.spy();
      tableSectionRef = { current: { scrollTo } };
    });

    it('should not do anything when ref is not setup yet', () => {
      tableSectionRef.current = {};

      handleCellFocus.handleNavigateTop({ tableSectionRef, focusedCellCoord, rootElement });
      expect(scrollTo).to.not.have.been.called;
    });

    it('should scroll to the top when you reach the top two rows', () => {
      focusedCellCoord = [1, 0];

      handleCellFocus.handleNavigateTop({ tableSectionRef, focusedCellCoord, rootElement });
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

      handleCellFocus.handleNavigateTop({ tableSectionRef, focusedCellCoord, rootElement });
      expect(scrollTo).to.have.been.calledOnce;
      expect(scrollTo).to.have.been.calledOnceWith({ top: targetOffsetTop, behavior: 'smooth' });
    });
  });
});
