import { expect } from 'chai';
import * as handleAccessibility from '../handle-accessibility';

describe('handle-accessibility', () => {
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
    keyboard = { focus: sinon.spy(), focusSelection: sinon.spy(), enabled: true };
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

    it('should indirectly call setFocusedCellCoord with adjusted index, and keyboard.focus', () => {
      handleAccessibility.handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard);
      expect(cell.setAttribute).have.been.calledOnceWith('tabIndex', '-1');
      expect(setFocusedCellCoord).to.have.been.calledOnceWith([1, 0]);
      expect(keyboard.focus).to.have.been.calledOnce;
    });
    it('should indirectly call setFocusedCellCoord with adjusted index, but not keyboard.focus when keyboard.enabled is falsey', () => {
      keyboard.enabled = false;
      handleAccessibility.handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard);
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

  describe('handleFocusinEvent', () => {
    let containsRelatedTarget;
    let evt;
    let announce;

    beforeEach(() => {
      containsRelatedTarget = false;
      evt = {
        currentTarget: {
          contains: () => containsRelatedTarget,
        },
      };
      announce = sinon.spy();
    });

    it('should call announce when currentTarget does not contain relatedTarget', () => {
      handleAccessibility.handleFocusinEvent(evt, announce);
      expect(announce).to.have.been.calledOnce;
    });

    it('should not call announce when currentTarget contains relatedTarget', () => {
      containsRelatedTarget = true;
      handleAccessibility.handleFocusinEvent(evt, announce);
      expect(announce).to.not.have.been.called;
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

    it('should call blur when currentTarget does not contain relatedTarget, shouldRefocus is false and keyboard.enabled is true', () => {
      handleAccessibility.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).to.have.been.calledOnceWith(false);
    });

    it('should not call blur when currentTarget contains relatedTarget', () => {
      containsRelatedTarget = true;

      handleAccessibility.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).to.not.have.been.called;
    });

    it('should not call blur when shouldRefocus is true', () => {
      shouldRefocus.current = true;

      handleAccessibility.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).to.not.have.been.called;
    });

    it('should not call blur when keyboard.enabled is falsey', () => {
      keyboard.enabled = false;

      handleAccessibility.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).to.not.have.been.called;
    });
  });

  describe('focusSelectionToolbar', () => {
    let element;
    let parentElement;
    let last;

    beforeEach(() => {
      parentElement = { focus: sinon.spy() };
      element = {
        closest: () => ({ querySelector: () => ({ parentElement }) }),
      };
      last = false;
    });

    it('should call parentElement.focus when clientConfirmButton exists', () => {
      handleAccessibility.focusSelectionToolbar(element, keyboard, last);
      expect(parentElement.focus).to.have.been.calledOnce;
      expect(keyboard.focusSelection).to.not.have.been.called;
    });

    it("should call keyboard.focusSelection when clientConfirmButton doesn't exist", () => {
      parentElement = null;
      handleAccessibility.focusSelectionToolbar(element, keyboard, last);
      expect(keyboard.focusSelection).to.have.been.calledOnceWith(false);
    });
  });
});
