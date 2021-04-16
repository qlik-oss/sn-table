import { expect } from 'chai';
import * as handleCellFocus from '../handle-cell-focus';

describe('handle-key-press', () => {
  let cell;
  let rootElement;
  let focusedCellCoord;

  beforeEach(() => {
    cell = { focus: sinon.spy(), blur: sinon.spy(), setAttribute: sinon.spy() };
    rootElement = { getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }] };
    focusedCellCoord = { current: [0, 0] };
  });

  describe('updateFocus', () => {
    let rowElements;
    let cellCoord;
    let shouldBlur;

    beforeEach(() => {
      rowElements = [{ getElementsByClassName: () => [cell] }];
      cellCoord = [0, 0];
      shouldBlur = false;
    });

    it('should focus cell and call setAttribute', () => {
      handleCellFocus.updateFocus(rowElements, cellCoord, shouldBlur);
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledOnce;
    });

    it('should blur cell and call setAttribute when shouldBlur is true', () => {
      shouldBlur = true;

      handleCellFocus.updateFocus(rowElements, cellCoord, shouldBlur);
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledOnce;
    });

    it('should not focus cell nor cell setAttribute when cell is not found', () => {
      cellCoord = [1, 0];

      handleCellFocus.updateFocus(rowElements, cellCoord, shouldBlur);
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
      handleCellFocus.handleClickToFocusBody(cellData, focusedCellCoord, rootElement);
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
    });
  });

  describe('handleHeadCellFocus', () => {
    const columnIndex = 0;

    it('should call focusCell', () => {
      handleCellFocus.handleClickToFocusHead(columnIndex, focusedCellCoord, rootElement);
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
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
      handleCellFocus.handleResetFocus(focusedCellCoord, rootElement, shouldRefocus, hasSelections);
      expect(cell.focus).to.not.have.been.called;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
    });

    it('should set tabindex on the first cell and focus when shouldRefocus is true', () => {
      shouldRefocus.current = true;

      handleCellFocus.handleResetFocus(focusedCellCoord, rootElement, shouldRefocus, hasSelections);
      expect(cell.focus).to.have.been.calledOnce;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
    });

    it('should set tabindex on the first cell in currently focused column when hasSelections is true', () => {
      focusedCellCoord = { current: [0, 1] };
      rootElement = { getElementsByClassName: () => [{ getElementsByClassName: () => [cell, cell] }] };
      hasSelections = true;

      handleCellFocus.handleResetFocus(focusedCellCoord, rootElement, shouldRefocus, hasSelections);
      expect(cell.focus).to.not.have.been.called;
      expect(cell.blur).to.have.been.calledOnce;
      expect(cell.setAttribute).have.been.calledTwice;
      expect(focusedCellCoord.current).to.eql([0, 1]);
    });
  });
});
