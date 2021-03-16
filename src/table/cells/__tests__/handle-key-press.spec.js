import handleKeyPress, {
  cellElementFocus,
  moveToNextFocus,
  getRowAndColumnCount,
  arrowKeysNavigation,
} from '../handle-key-press';

describe('handle-key-press', () => {
  describe('cellElementFocus', () => {
    const rowIndex = 0;
    const colIndex = 0;
    const rootElement = {
      getElementsByClassName: () => [{ getElementsByClassName: () => [{ focus: sinon.spy() }] }],
    };
    it('should focus a cell', () => {
      cellElementFocus(rootElement, rowIndex, colIndex);
      expect(rootElement.getElementsByClassName()[0].getElementsByClassName()[0].focus).to.have.been.calledOnce;
    });
  });

  describe('moveToNextFocus', () => {
    const nextRow = 0;
    const nextCol = 0;
    const rootElement = [{ getElementsByClassName: () => [{ focus: sinon.spy(), setAttribute: sinon.spy() }] }];
    it('should focus and set attribute for next cell', () => {
      moveToNextFocus(rootElement, nextRow, nextCol);
      expect(rootElement[0].getElementsByClassName()[0].focus).to.have.been.calledOnce;
    });
  });

  describe('arrowKeysNavigation', () => {
    let evt;
    const rowAndColumnCount = {};
    let rowIndex;
    let colIndex;

    beforeEach(() => {
      evt = {};
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
    const rowIndex = 0;
    const colIndex = 0;
    const evt = {
      key: 'ArrowDown',
      stopPropagation: sinon.spy(),
      preventDefault: sinon.spy(),
    };
    evt.target = {
      blur: sinon.spy(),
      setAttribute: sinon.spy(),
    };
    const rootElement = {
      getElementsByClassName: () => [{ getElementsByClassName: () => [{ focus: () => {}, setAttribute: () => {} }] }],
    };

    it('should prevent default behavior and remove current focus', () => {
      handleKeyPress(evt, rootElement, rowIndex, colIndex);
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(evt.target.blur).to.have.been.calledOnce;
      expect(evt.target.setAttribute).to.have.been.calledOnce;
    });

    // it('should prevent default behavior, remove current focus and ', () => {
    //   const clock = sinon.useFakeTimers();
    //   // evt.key = 'Escape';
    //   const cell = {
    //     isDim: true,
    //   };

    //   handleKeyPress(evt, rootElement, rowIndex, colIndex, cell);
    //   clock.tick(200);
    //   // eslint-disable-next-line import/no-named-as-default-member
    //   expect(cellElementFocus).to.have.been.calledOnce;
    //   clock.restore();
    // });
  });
});
