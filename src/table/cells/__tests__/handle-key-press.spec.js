import handleKeyPress, { getRowAndColumnCount, arrowKeysNavigation } from '../handle-key-press';

describe('handle-key-press', () => {
  describe('arrowKeysNavigation', () => {
    let evt;
    const rowAndColumnCount = {};
    let rowIndex;
    let colIndex;

    beforeEach(() => {
      evt = {
        target: {
          offsetParent: {
            classList: {
              contains: () => {},
            },
          },
        },
      };
      rowAndColumnCount.rowCount = 1;
      rowAndColumnCount.columnCount = 1;
      rowIndex = 0;
      colIndex = 0;
    });

    it('should stay the current cell when move down', () => {
      evt.key = 'ArrowDown';
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should stay the current cell when move up', () => {
      evt.key = 'ArrowUp';
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should stay the current cell when move left', () => {
      evt.key = 'ArrowLeft';
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should stay the current cell when move right', () => {
      evt.key = 'ArrowRight';
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should go to one row down cell', () => {
      evt.key = 'ArrowDown';
      rowAndColumnCount.rowCount = 2;
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(1);
      expect(nextCol).to.eql(0);
    });

    it('should go to one row up cell', () => {
      evt.key = 'ArrowUp';
      rowAndColumnCount.rowCount = 2;
      rowIndex = 1;
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should go to one column left cell', () => {
      evt.key = 'ArrowLeft';
      rowAndColumnCount.columnCount = 2;
      colIndex = 1;
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should go to one column right cell', () => {
      evt.key = 'ArrowRight';
      rowAndColumnCount.columnCount = 2;
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(1);
    });
  });

  describe('getRowAndColumnCount', () => {
    let resolvedRowCount;
    let resolvedColumnCount;
    let resolvedRowElements;
    const rootElement = {};

    it('should return a rowElements, rowCount, and columnCount', () => {
      resolvedRowCount = 1;
      resolvedColumnCount = 1;
      resolvedRowElements = [{}];
      rootElement.getElementsByClassName = () => resolvedRowElements;
      const { rowElements, rowCount, columnCount } = getRowAndColumnCount(rootElement);
      expect(rowCount).to.equal(resolvedRowCount);
      expect(columnCount).to.equal(resolvedColumnCount);
      expect(rowElements).to.equal(resolvedRowElements);
    });
  });

  describe('handleKeyPress', () => {
    let rowIndex;
    let colIndex;
    let evt = {};
    let rootElement = {};
    let selState = {};
    let cell = [];

    beforeEach(() => {
      rowIndex = 0;
      colIndex = 0;
      evt = {
        key: 'ArrowDown',
        stopPropagation: sinon.spy(),
        preventDefault: sinon.spy(),
        target: {
          blur: sinon.spy(),
          setAttribute: sinon.spy(),
          offsetParent: {
            classList: {
              remove: () => {},
              contains: () => {},
            },
          },
        },
      };
      rootElement = {
        getElementsByClassName: () => [{ getElementsByClassName: () => [{ focus: () => {}, setAttribute: () => {} }] }],
      };
      selState = {
        api: {
          confirm: sinon.spy(),
          cancel: sinon.spy(),
        },
      };
      cell = [];
    });

    describe('ArrowDown', () => {
      it('should prevent default behavior and remove current focus', () => {
        handleKeyPress(evt, rootElement, rowIndex, colIndex);
        expect(evt.preventDefault).to.have.been.calledOnce;
        expect(evt.stopPropagation).to.have.been.calledOnce;
        expect(evt.target.blur).to.have.been.calledOnce;
        expect(evt.target.setAttribute).to.have.been.calledOnce;
      });
    });

    describe('Enter', () => {
      it('should confirms selections', () => {
        evt.key = 'Enter';
        handleKeyPress(evt, rootElement, rowIndex, colIndex, cell, selState);
        expect(evt.preventDefault).to.have.been.calledOnce;
        expect(evt.stopPropagation).to.have.been.calledOnce;
        expect(selState.api.confirm).to.have.been.calledOnce;
      });
    });

    describe('Cancel', () => {
      it('should cancel selection', () => {
        evt.key = 'Escape';
        handleKeyPress(evt, rootElement, rowIndex, colIndex, cell, selState);
        expect(evt.preventDefault).to.have.been.calledOnce;
        expect(evt.stopPropagation).to.have.been.calledOnce;
        expect(selState.api.cancel).to.have.been.calledOnce;
      });
    });
  });
});
