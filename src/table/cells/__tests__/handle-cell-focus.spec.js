import * as handleCellFocus from '../handle-cell-focus';

describe('handle-key-press', () => {
  describe('focusCell', () => {
    const rowElements = [
      {
        getElementsByClassName: () => [{ focus: sinon.spy(), setAttribute: sinon.spy() }],
      },
    ];
    const nextCellCoord = [0, 0];
    const nextCell = handleCellFocus.focusCell(rowElements, nextCellCoord);
    expect(nextCell.focus).to.have.been.calledOnce;
    expect(nextCell.setAttribute).have.been.calledOnce;
  });

  describe('handleBodyCellFocus', () => {
    const sandbox = sinon.createSandbox();
    const cell = {
      rawRowIdx: -1,
      rawColIdx: 0,
    };
    const focusedCellCoord = {
      current: [0, 0],
    };
    const rootElement = {
      getElementsByClassName: () => [
        { getElementsByClassName: () => [{ focus: sinon.spy(), setAttribute: sinon.spy() }] },
      ],
    };
    afterEach(() => {
      sandbox.verifyAndRestore();
      sandbox.resetHistory();
    });
    it('should call focusCell', () => {
      sandbox.replace(handleCellFocus, 'focusCell', sinon.spy());
      const nextCell = handleCellFocus.handleBodyCellFocus(cell, focusedCellCoord, rootElement);
      expect(nextCell.focus).to.have.been.calledOnce;
      expect(nextCell.setAttribute).have.been.calledOnce;
    });
  });

  describe('handleHeadCellFocus', () => {
    const sandbox = sinon.createSandbox();

    const columnIndex = 0;
    const focusedCellCoord = {
      current: [0, 0],
    };
    const rootElement = {
      getElementsByClassName: () => [
        { getElementsByClassName: () => [{ focus: sinon.spy(), setAttribute: sinon.spy() }] },
      ],
    };

    afterEach(() => {
      sandbox.verifyAndRestore();
      sandbox.resetHistory();
    });

    it('should call focusCell', () => {
      sandbox.replace(handleCellFocus, 'focusCell', sinon.spy());
      const nextCell = handleCellFocus.handleHeadCellFocus(columnIndex, focusedCellCoord, rootElement);
      expect(nextCell.focus).to.have.been.calledOnce;
      expect(nextCell.setAttribute).have.been.calledOnce;
    });
  });
});
