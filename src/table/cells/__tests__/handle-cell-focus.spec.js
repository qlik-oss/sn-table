import * as handleCellFocus from '../handle-cell-focus';

describe('handle-key-press', () => {
  describe('focusCell', () => {
    const nextCell = { focus: sinon.spy(), setAttribute: sinon.spy() };
    const rowElements = [
      {
        getElementsByClassName: () => [nextCell],
      },
    ];
    const nextCellCoord = [0, 0];
    handleCellFocus.focusCell(rowElements, nextCellCoord);
    expect(nextCell.focus).to.have.been.calledOnce;
    expect(nextCell.setAttribute).have.been.calledOnce;
  });

  describe('handleBodyCellFocus', () => {
    const nextCell = { focus: sinon.spy(), blur: sinon.spy(), setAttribute: sinon.spy() };
    const cell = {
      rawRowIdx: -1,
      rawColIdx: 0,
    };
    const focusedCellCoord = {
      current: [0, 0],
    };
    const rootElement = {
      getElementsByClassName: () => [{ getElementsByClassName: () => [nextCell] }],
    };

    it('should call focusCell', () => {
      handleCellFocus.handleClickToFocusBody(cell, focusedCellCoord, rootElement);
      expect(nextCell.focus).to.have.been.calledOnce;
      expect(nextCell.blur).to.have.been.calledOnce;
      expect(nextCell.setAttribute).have.been.calledTwice;
    });
  });

  describe('handleHeadCellFocus', () => {
    const nextCell = { focus: sinon.spy(), blur: sinon.spy(), setAttribute: sinon.spy() };
    const columnIndex = 0;
    const focusedCellCoord = {
      current: [0, 0],
    };
    const rootElement = {
      getElementsByClassName: () => [{ getElementsByClassName: () => [nextCell] }],
    };

    it('should call focusCell', () => {
      handleCellFocus.handleClickToFocusHead(columnIndex, focusedCellCoord, rootElement);
      expect(nextCell.focus).to.have.been.calledOnce;
      expect(nextCell.blur).to.have.been.calledOnce;
      expect(nextCell.setAttribute).have.been.calledTwice;
    });
  });
});
