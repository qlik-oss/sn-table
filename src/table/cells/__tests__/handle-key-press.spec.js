import { arrowKeysNavigation, getRowAndColumnCount } from '../handleKeyPress';

const { JSDOM } = require('jsdom');

describe('handle-key-press', () => {
  describe('moveToNextFocus', () => {});

  describe('arrowKeysNavigation', () => {
    const evt = {};
    const rowAndColumnCount = {};
    let rowIndex;
    let colIndex;

    it('should stay the current cell', () => {
      evt.key = 'ArrowDown';
      rowAndColumnCount.rowCount = 1;
      rowAndColumnCount.columnCount = 1;
      rowIndex = 0;
      colIndex = 0;
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should go to one row down cell', () => {
      evt.key = 'ArrowDown';
      rowAndColumnCount.rowCount = 2;
      rowAndColumnCount.columnCount = 1;
      rowIndex = 0;
      colIndex = 0;
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(1);
      expect(nextCol).to.eql(0);
    });

    it('should go to one row up cell', () => {
      evt.key = 'ArrowUp';
      rowAndColumnCount.rowCount = 2;
      rowAndColumnCount.columnCount = 1;
      rowIndex = 1;
      colIndex = 0;
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should go to one column left cell', () => {
      evt.key = 'ArrowLeft';
      rowAndColumnCount.rowCount = 1;
      rowAndColumnCount.columnCount = 2;
      rowIndex = 0;
      colIndex = 1;
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should go to one column right cell', () => {
      evt.key = 'ArrowRight';
      rowAndColumnCount.rowCount = 1;
      rowAndColumnCount.columnCount = 2;
      rowIndex = 0;
      colIndex = 0;
      const { nextRow, nextCol } = arrowKeysNavigation(evt, rowAndColumnCount, rowIndex, colIndex);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(1);
    });
  });

  describe('getRowAndColumnCount', () => {
    let resolvedRowCount;
    let resolvedColumnCount;

    it('should return a rowElements, rowCount, and columnCount', () => {
      resolvedRowCount = 15;
      resolvedColumnCount = 2;
      JSDOM.fromFile('src/table/cells/__tests__/table.html').then((dom) => {
        const rootElement = dom.window.document;
        const { rowCount, columnCount } = getRowAndColumnCount(rootElement);
        expect(rowCount).to.equal(resolvedRowCount);
        expect(columnCount).to.equal(resolvedColumnCount);
      });
    });
  });
});
