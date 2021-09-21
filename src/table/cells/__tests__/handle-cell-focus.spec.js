import { expect } from 'chai';
import * as handleCellFocus from '../handle-cell-focus';

describe('handle-key-press', () => {
  let cell;
  let rootElement;
  let focusedCellCoord;
  let setfocusedCellCoord;

  beforeEach(() => {
    cell = { focus: sinon.spy(), blur: sinon.spy(), setAttribute: sinon.spy() };
    rootElement = {
      getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }],
      querySelector: () => cell,
    };
    focusedCellCoord = [0, 0];
    setfocusedCellCoord = sinon.spy();
  });

  describe('updateFocus', () => {
    let rowElements;
    let cellCoord;
    let shouldFocus;
    let providedCell;

    beforeEach(() => {
      rowElements = [{ getElementsByClassName: () => [cell] }];
      cellCoord = [0, 0];
    });

    it('should focus cell and call setAttribute', () => {
      handleCellFocus.updateFocus({ rowElements, cellCoord });
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledOnce;
    });

    it('should blur cell and call setAttribute when shouldBlur is true', () => {
      shouldFocus = false;

      handleCellFocus.updateFocus({ rowElements, cellCoord, shouldFocus });
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledOnce;
    });

    it('should not focus cell nor cell setAttribute when cell is not found', () => {
      cellCoord = [1, 0];

      handleCellFocus.updateFocus({ rowElements, cellCoord });
      expect(cell.focus).to.not.have.been.called;
      expect(cell.blur).to.not.have.been.called;
      expect(cell.setAttribute).to.not.have.been.called;
    });

    it('should pick up providedCell element if there was no rowElements provided', () => {
      providedCell = cell;

      handleCellFocus.updateFocus({ providedCell });

      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.setAttribute).to.have.been.calledOnce;
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

  describe('handleBodyCellFocus', () => {
    const cellData = {
      rawRowIdx: -1,
      rawColIdx: 0,
    };

    it('should call focusCell', () => {
      handleCellFocus.handleClickToFocusBody(cellData, rootElement, setfocusedCellCoord);
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
      expect(setfocusedCellCoord).to.have.been.calledOnce;
    });
  });

  describe('handleHeadCellFocus', () => {
    const columnIndex = 0;

    it('should call focusCell', () => {
      handleCellFocus.handleClickToFocusHead(columnIndex, rootElement, setfocusedCellCoord);
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
      expect(setfocusedCellCoord).to.have.been.calledOnce;
    });
  });

  describe('handleResetFocus', () => {
    let shouldRefocus;
    let hasSelections;

    beforeEach(() => {
      shouldRefocus = { current: false };
      hasSelections = false;
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
      const SCROLL_TOP_IDX = 7;
      focusedCellCoord = [8, 0];
      tableSection = { current: { scrollTo, scrollTop: SCROLL_TOP_IDX * rowHeight } };
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

      handleCellFocus.handleNavigateTop({ tableSection, focusedCellCoord, rootElement });
      expect(scrollTo).to.have.been.calledOnce;
      expect(scrollTo).to.have.been.calledOnceWith({ top: targetOffsetTop, behavior: 'smooth' });
    });
  });

  describe('getCellSelectionStatusNote', () => {
    let rows;

    it('should return singular notation for array with single item', () => {
      rows = [1];
      const result = handleCellFocus.getCellSelectionStatusNote(rows);
      expect(result).to.equal('There is 1 selected value currently');
    });

    it('should return plural notation for arrays with multiple items', () => {
      rows = [1, 2, 3];
      const result = handleCellFocus.getCellSelectionStatusNote(rows);
      expect(result).to.equal(`There are ${rows.length} selected values currently`);
    });
  });

  describe('getCellSrNotation', () => {
    let selState;
    let getCellSrNotation;

    beforeEach(() => {
      selState = { rows: [1, 2] };
      getCellSrNotation = handleCellFocus.getMemoisedSrNotation();
    });

    it('should return empty string while we are in first row', () => {
      focusedCellCoord = [0, 1];
      const notation = getCellSrNotation({ focusedCellCoord, rootElement, selState });

      expect(notation).to.equal('');
    });

    it('should return empty string while there is no selected items', () => {
      selState = { rows: [] };
      focusedCellCoord = [1, 1];
      const notatino = getCellSrNotation({ focusedCellCoord, rootElement, selState });

      expect(notatino).to.equal('');
    });

    it('should return `value selected` and selected rows count while we are selecting a row', () => {
      focusedCellCoord = [1, 1];
      selState = { rows: ['some row data'] };
      const notation = getCellSrNotation({ focusedCellCoord, rootElement, selState });

      expect(notation).to.equal('value is selected. There is 1 selected value currently');
    });

    it('should return `value selected` and selected rows count while we are selecting multiple rows', () => {
      const focusedCellCoord = [2, 1];
      selState = { rows: ['row#01', 'row#02'] };
      getCellSrNotation = handleCellFocus.getMemoisedSrNotation(1);

      const notation = getCellSrNotation({ focusedCellCoord, rootElement, selState });

      expect(notation).to.equal('value is selected. There are 2 selected values currently');
    });

    it('should be able to deselect previously selected value', () => {
      const focusedCellCoord = [2, 1];
      selState = { rows: ['row#01', 'row#02'] };
      getCellSrNotation = handleCellFocus.getMemoisedSrNotation(3);

      const notation = getCellSrNotation({ focusedCellCoord, rootElement, selState });

      expect(notation).to.equal('value is deselected. There are 2 selected values currently');
    });

    it('should be able to detect if cell has been selected while changing the focus to cell if we are in selection mode', () => {
      const focusedCellCoord = [1, 1];
      selState = { rows: ['row#01', 'row#02'] };
      getCellSrNotation = handleCellFocus.getMemoisedSrNotation(2);
      cell = document.createElement('td');
      cell.classList.add('selected');
      rootElement = {
        getElementsByClassName: () => [{}, { getElementsByClassName: () => [null, cell] }],
      };

      const notation = getCellSrNotation({ focusedCellCoord, rootElement, selState });

      expect(notation).to.equal('value is selected.');
    });

    it('should be able to detect if cell has not been selected while changing the focus to cell if we are in selection mode', () => {
      const focusedCellCoord = [2, 1];
      selState = { rows: ['row#01', 'row#02'] };
      getCellSrNotation = handleCellFocus.getMemoisedSrNotation(2);

      const notation = getCellSrNotation({ focusedCellCoord, rootElement, selState });

      expect(notation).to.equal('value is not selected.');
    });

    it('should convey selection exited when we deselect very last selected cell in column', () => {
      const focusedCellCoord = [2, 1];
      selState = { rows: [] };
      getCellSrNotation = handleCellFocus.getMemoisedSrNotation(1);

      const notation = getCellSrNotation({ focusedCellCoord, rootElement, selState });

      expect(notation).to.equal('value deselected and exited selection mode.');
    });
  });
});
