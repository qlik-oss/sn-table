import { expect } from 'chai';
import * as handleAccessibility from '../handle-accessibility';

<<<<<<< HEAD:src/table/cells/__tests__/handle-cell-focus.spec.js
describe('handle-cell-focus', () => {
=======
describe('handle-accessibility', () => {
>>>>>>> main:src/table/utils/__tests__/handle-accessiblity.spec.js
  let cell;
  let rootElement;
  let focusedCellCoord;
  let setFocusedCellCoord;
  let keyboard;
  let translator;

  beforeEach(() => {
    cell = { focus: sinon.spy(), blur: sinon.spy(), setAttribute: sinon.spy() };
    rootElement = {
      getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }],
      querySelector: () => cell,
    };
    focusedCellCoord = [0, 0];
    setFocusedCellCoord = sinon.spy();
    keyboard = { focus: sinon.spy(), enabled: true };
    translator = { get: (s) => s };
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
      handleAccessibility.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.setAttribute).to.have.been.calledOnceWith('tabIndex', '0');
    });

    it('should blur cell and call setAttribute when focusType is blur', () => {
      focusType = 'blur';

      handleAccessibility.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).to.have.been.calledOnceWith('tabIndex', '-1');
    });

    it('should call setAttribute when focusType is addTab', () => {
      focusType = 'addTab';

      handleAccessibility.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.focus).to.not.have.been.called;
      expect(cell.setAttribute).to.have.been.calledOnceWith('tabIndex', '0');
    });

    it('should call setAttribute when focusType is removeTab', () => {
      focusType = 'removeTab';

      handleAccessibility.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.blur).to.not.have.been.called;
      expect(cell.setAttribute).to.have.been.calledOnceWith('tabIndex', '-1');
    });

    it('should not focus cell nor cell setAttribute when cell is not found', () => {
      cellCoord = [1, 0];

      handleAccessibility.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.focus).to.not.have.been.called;
      expect(cell.blur).to.not.have.been.called;
      expect(cell.setAttribute).to.not.have.been.called;
    });

    it('should pick up providedCell element if there was no rowElements provided', () => {
      providedCell = cell;

      handleAccessibility.updateFocus({ focusType, providedCell });
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

      const cellElement = handleAccessibility.findCellWithTabStop(rootElement);

      expect(cellElement).to.not.be.null;
      expect(cellElement.tagName).to.equal('TD');
      expect(cellElement).to.have.attr('tabIndex').match(/0/);
    });

    it('should return active th element', () => {
      cell = elementCreator('th', '0');

      const cellElement = handleAccessibility.findCellWithTabStop(rootElement);

      expect(cellElement).to.not.be.null;
      expect(cellElement.tagName).to.equal('TH');
      expect(cellElement).to.have.attr('tabIndex').match(/0/);
    });

    it('should return null', () => {
      cell = elementCreator('div', '-1');

      const cellElement = handleAccessibility.findCellWithTabStop(rootElement);

      expect(cellElement).to.be.null;
    });
  });

  describe('handleClickToFocusBody', () => {
    const cellData = {
      rawRowIdx: 0,
      rawColIdx: 0,
    };

<<<<<<< HEAD:src/table/cells/__tests__/handle-cell-focus.spec.js
    it('should indirectly call setFocusedCellCoord with adjusted index, and keyboard.focus', () => {
      handleCellFocus.handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard);
=======
    it('should call setFocusedCellCoord with adjusted index, and keyboard.focus', () => {
      handleAccessibility.handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard);
>>>>>>> main:src/table/utils/__tests__/handle-accessiblity.spec.js
      expect(cell.setAttribute).have.been.calledOnceWith('tabIndex', '-1');
      expect(setFocusedCellCoord).to.have.been.calledOnceWith([1, 0]);
      expect(keyboard.focus).to.have.been.calledOnce;
    });
    it('should indirectly call setFocusedCellCoord with adjusted index, but not keyboard.focus when keyboard.enabled is falsey', () => {
      keyboard.enabled = false;
      handleCellFocus.handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard);
      expect(cell.setAttribute).have.been.calledOnceWith('tabIndex', '-1');
      expect(setFocusedCellCoord).to.have.been.calledOnceWith([1, 0]);
      expect(keyboard.focus).to.not.have.been.called;
    });
  });

  describe('handleClickToFocusHead', () => {
    const columnIndex = 2;

    it('should indirectly call updateFocus, setFocusedCellCoord and keyboard.focus', () => {
      handleAccessibility.handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard);
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
      handleAccessibility.handleResetFocus({
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

      handleAccessibility.handleResetFocus({
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

      handleAccessibility.handleResetFocus({
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

  describe('getCellSelectionStatusNote', () => {
    let rows;

    it('should return singular notation for array with single item', () => {
      rows = [1];
      const result = handleAccessibility.getCellSelectionStatusNote(rows, translator);
      expect(result).to.equal('SNTable.SelectionLabel.OneSelectedValue');
    });

    it('should return plural notation for arrays with multiple items', () => {
      rows = [1, 2, 3];
      const result = handleAccessibility.getCellSelectionStatusNote(rows, translator);
      expect(result).to.equal(`SNTable.SelectionLabel.SelectedValues`);
    });
  });

  describe('getCellSrNotation', () => {
    let selectionState;
    let getCellSrNotation;
    let isActiveElementInTable;

    beforeEach(() => {
      selectionState = { rows: [1, 2] };
      isActiveElementInTable = true;
      getCellSrNotation = handleAccessibility.getMemoisedSrNotation();
    });

    it('should return empty string while we are in first row', () => {
      focusedCellCoord = [0, 1];
      const notation = getCellSrNotation({
        focusedCellCoord,
        rootElement,
        selectionState,
        translator,
        isActiveElementInTable,
      });

      expect(notation).to.equal('');
    });

    it('should return empty string while there is no selected items', () => {
      selectionState = { rows: [] };
      focusedCellCoord = [1, 1];
      const notatino = getCellSrNotation({
        focusedCellCoord,
        rootElement,
        selectionState,
        translator,
        isActiveElementInTable,
      });

      expect(notatino).to.equal('');
    });

    it('should return empty string when focused cell is not in the table', () => {
      selectionState = { rows: [] };
      focusedCellCoord = [1, 1];
      isActiveElementInTable = false;
      const notatino = getCellSrNotation({
        focusedCellCoord,
        rootElement,
        selectionState,
        translator,
        isActiveElementInTable,
      });

      expect(notatino).to.equal('');
    });

    it('should return `value selected` and selected rows count while we are selecting multiple rows', () => {
      focusedCellCoord = [2, 1];
      selectionState = { rows: ['row#01', 'row#02'] };
      getCellSrNotation = handleAccessibility.getMemoisedSrNotation(1);

      const notation = getCellSrNotation({
        focusedCellCoord,
        rootElement,
        selectionState,
        translator,
        isActiveElementInTable,
      });

      expect(notation).to.equal('SNTable.SelectionLabel.SelectedValue SNTable.SelectionLabel.SelectedValues');
    });

    it('should be able to deselect previously selected value', () => {
      focusedCellCoord = [2, 1];
      selectionState = { rows: ['row#01', 'row#02'] };
      getCellSrNotation = handleAccessibility.getMemoisedSrNotation(3);

      const notation = getCellSrNotation({
        focusedCellCoord,
        rootElement,
        selectionState,
        translator,
        isActiveElementInTable,
      });

      expect(notation).to.equal('SNTable.SelectionLabel.DeselectedValue SNTable.SelectionLabel.SelectedValues');
    });

    it('should be able to detect if cell has been selected while changing the focus to cell if we are in selection mode', () => {
      focusedCellCoord = [1, 1];
      selectionState = { rows: ['row#01', 'row#02'] };
      getCellSrNotation = handleAccessibility.getMemoisedSrNotation(2);
      cell = global.document.createElement('td');
      cell.classList.add('selected');
      rootElement = {
        getElementsByClassName: () => [{}, { getElementsByClassName: () => [null, cell] }],
      };

      const notation = getCellSrNotation({
        focusedCellCoord,
        rootElement,
        selectionState,
        translator,
        isActiveElementInTable,
      });

      expect(notation).to.equal('SNTable.SelectionLabel.SelectedValue');
    });

    it('should be able to detect if cell has not been selected while changing the focus to cell if we are in selection mode', () => {
      focusedCellCoord = [2, 1];
      selectionState = { rows: ['row#01', 'row#02'] };
      getCellSrNotation = handleAccessibility.getMemoisedSrNotation(2);

      const notation = getCellSrNotation({
        focusedCellCoord,
        rootElement,
        selectionState,
        translator,
        isActiveElementInTable,
      });

      expect(notation).to.equal('SNTable.SelectionLabel.NotSelectedValue');
    });

    it('should convey selection exited when we deselect very last selected cell in column', () => {
      focusedCellCoord = [2, 1];
      selectionState = { rows: [] };
      getCellSrNotation = handleAccessibility.getMemoisedSrNotation(1);

      const notation = getCellSrNotation({
        focusedCellCoord,
        rootElement,
        selectionState,
        translator,
        isActiveElementInTable,
      });

      expect(notation).to.equal('SNTable.SelectionLabel.ExitedSelectionMode');
    });
  });

  describe('handleFocusoutEvent', () => {
    let containsRelatedTarget;
    let evt;
    let shouldRefocus;

    beforeEach(() => {
      containsRelatedTarget = false;
      evt = {
        currentTarget: {
          contains: () => containsRelatedTarget,
        },
      };
      shouldRefocus = { current: false };
      keyboard = { enabled: true, blur: sinon.spy() };
    });

<<<<<<< HEAD:src/table/cells/__tests__/handle-cell-focus.spec.js
    it('should call blur when currentTarget doesnt contain relatedTarget, shouldRefocus is false and keyboard.enabled is true', () => {
      handleCellFocus.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).to.have.been.calledOnceWith(false);
=======
    it('should call blur when currentTarget doesnt contain relatedTarget and shouldRefocus is false', () => {
      handleAccessibility.handleFocusoutEvent(evt, shouldRefocus, blur);
      expect(blur).to.have.been.calledOnceWith(false);
>>>>>>> main:src/table/utils/__tests__/handle-accessiblity.spec.js
    });

    it('should not call blur when currentTarget contains relatedTarget', () => {
      containsRelatedTarget = true;

<<<<<<< HEAD:src/table/cells/__tests__/handle-cell-focus.spec.js
      handleCellFocus.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).to.not.have.been.called;
=======
      handleAccessibility.handleFocusoutEvent(evt, shouldRefocus, blur);
      expect(blur).to.not.have.been.called;
>>>>>>> main:src/table/utils/__tests__/handle-accessiblity.spec.js
    });

    it('should not call blur when shouldRefocus is true', () => {
      shouldRefocus.current = true;

<<<<<<< HEAD:src/table/cells/__tests__/handle-cell-focus.spec.js
      handleCellFocus.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).to.not.have.been.called;
    });

    it('should not call blur when keyboard.enabled is falsey', () => {
      keyboard.enabled = false;

      handleCellFocus.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).to.not.have.been.called;
=======
      handleAccessibility.handleFocusoutEvent(evt, shouldRefocus, blur);
      expect(blur).to.not.have.been.called;
>>>>>>> main:src/table/utils/__tests__/handle-accessiblity.spec.js
    });
  });
});
