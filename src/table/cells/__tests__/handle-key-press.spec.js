import {
  getRowAndColumnCount,
  arrowKeysNavigation,
  bodyHandleKeyPress,
  headHandleKeyPress,
  updatePage,
} from '../handle-key-press';

describe('handle-key-press', () => {
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
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should stay the current cell when move up', () => {
      evt.key = 'ArrowUp';
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should stay the current cell when move left', () => {
      evt.key = 'ArrowLeft';
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should stay the current cell when move right', () => {
      evt.key = 'ArrowRight';
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should go to one row down cell', () => {
      evt.key = 'ArrowDown';
      rowAndColumnCount.rowCount = 2;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(1);
      expect(nextCol).to.eql(0);
    });

    it('should go to one row up cell', () => {
      evt.key = 'ArrowUp';
      rowAndColumnCount.rowCount = 2;
      rowIndex = 1;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should go to one column left cell', () => {
      evt.key = 'ArrowLeft';
      rowAndColumnCount.columnCount = 2;
      colIndex = 1;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should go to one column right cell', () => {
      evt.key = 'ArrowRight';
      rowAndColumnCount.columnCount = 2;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(1);
    });

    it('should stay the current cell when other keys are pressed', () => {
      evt.key = 'Control';
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
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

  describe('bodyHandleKeyPress', () => {
    let rowIndex;
    let colIndex;
    let evt = {};
    let rootElement = {};
    let selState = {};
    let cell = [];
    let selDispatch;
    let isAnalysisMode;
    let setfocusedCellCoord;

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
        },
      };
      rootElement = {
        getElementsByClassName: () => [{ getElementsByClassName: () => [{ focus: () => {}, setAttribute: () => {} }] }],
      };
      selState = {
        api: {
          confirm: sinon.spy(),
          cancel: sinon.spy(),
          begin: sinon.spy(),
          select: sinon.spy(),
        },
        rows: [],
        colIdx: -1,
      };
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1, isDim: true };
      selDispatch = sinon.spy();
      isAnalysisMode = true;
      setfocusedCellCoord = sinon.spy();
    });

    it('when press arrow-down key, should prevent default behavior, remove current focus and set focus and attribute to the next cell', () => {
      bodyHandleKeyPress(evt, rootElement, [rowIndex, colIndex], selState, null, null, false, setfocusedCellCoord);
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(evt.target.blur).to.have.been.calledOnce;
      expect(evt.target.setAttribute).to.have.been.calledOnce;
      expect(setfocusedCellCoord).to.have.been.calledOnce;
    });

    it('when press space bar key and dimension, should select value for dimension', () => {
      evt.key = ' ';
      bodyHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        selState,
        cell,
        selDispatch,
        isAnalysisMode,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selState.api.begin).to.have.been.calledOnce;
      expect(selState.api.select).to.have.been.calledOnce;
      expect(selDispatch).to.have.been.calledOnce;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when press space bar key not on dimension, should not select value for measure', () => {
      evt.key = ' ';
      cell = {
        isDim: false,
      };
      bodyHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        selState,
        cell,
        selDispatch,
        false,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selState.api.begin).not.have.been.called;
      expect(selState.api.select).not.have.been.called;
      expect(selDispatch).not.have.been.called;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when press space bar key not in analysis mode, should not select value for measure ', () => {
      evt.key = ' ';
      isAnalysisMode = false;
      bodyHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        selState,
        cell,
        selDispatch,
        false,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selState.api.begin).not.have.been.called;
      expect(selState.api.select).not.have.been.called;
      expect(selDispatch).not.have.been.called;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when press enter key, should confirms selections', () => {
      evt.key = 'Enter';
      bodyHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        selState,
        cell,
        selDispatch,
        isAnalysisMode,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selState.api.confirm).to.have.been.calledOnce;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when press enter key not in analysis mode, should not confirms selections', () => {
      evt.key = 'Enter';
      isAnalysisMode = false;
      bodyHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        selState,
        cell,
        selDispatch,
        isAnalysisMode,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selState.api.confirm).not.have.been.called;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when press cancel key, should cancel selection', () => {
      evt.key = 'Escape';
      bodyHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        selState,
        cell,
        selDispatch,
        isAnalysisMode,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selState.api.cancel).to.have.been.calledOnce;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when press cancel key not in analysis mode, should not cancel selection', () => {
      evt.key = 'Escape';
      isAnalysisMode = false;
      bodyHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        selState,
        cell,
        selDispatch,
        isAnalysisMode,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selState.api.cancel).not.have.been.called;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when press ArrowRight and shif and ctrl key, should not update the sorting', () => {
      evt.key = 'ArrowRight';
      evt.shiftKey = true;
      evt.ctrlKey = true;
      bodyHandleKeyPress(evt, rootElement, [rowIndex, colIndex], selState, cell, selDispatch, setfocusedCellCoord);
      expect(evt.preventDefault).not.have.been.called;
      expect(evt.stopPropagation).not.have.been.called;
      expect(selState.api.cancel).not.have.been.called;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when other keys are pressed, should not do anything', () => {
      evt.key = 'Control';
      bodyHandleKeyPress(evt, rootElement, [rowIndex, colIndex], selState, cell, selDispatch, setfocusedCellCoord);
      expect(evt.preventDefault).not.have.been.called;
      expect(evt.stopPropagation).not.have.been.called;
      expect(evt.target.blur).not.have.been.called;
      expect(evt.target.setAttribute).not.have.been.called;
      expect(selState.api.cancel).not.have.been.called;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });
  });

  describe('headHandleKeyPress', () => {
    let rowIndex;
    let colIndex;
    let evt = {};
    let rootElement = {};
    let changeSortOrder;
    let layout;
    let isDim;
    let isAnalysisMode;
    let setfocusedCellCoord;

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
        },
      };
      rootElement = {
        getElementsByClassName: () => [{ getElementsByClassName: () => [{ focus: () => {}, setAttribute: () => {} }] }],
      };
      changeSortOrder = sinon.spy();
      isAnalysisMode = true;
      setfocusedCellCoord = sinon.spy();
    });

    it('when press arrow down key, should prevent default behavior, remove current focus and set focus and attribute to the next cell', () => {
      headHandleKeyPress(evt, rootElement, [rowIndex, colIndex], null, null, null, false, setfocusedCellCoord);
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(evt.target.blur).to.have.been.calledOnce;
      expect(evt.target.setAttribute).to.have.been.calledOnce;
      expect(setfocusedCellCoord).to.have.been.calledOnce;
    });

    it('when press space bar key, should update the sorting', () => {
      evt.key = ' ';
      headHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        changeSortOrder,
        layout,
        isDim,
        isAnalysisMode,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(changeSortOrder).to.have.been.calledOnce;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when press space bar key not in analysis mdoe, should not update the sorting', () => {
      evt.key = ' ';
      isAnalysisMode = false;
      headHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        changeSortOrder,
        layout,
        isDim,
        isAnalysisMode,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(changeSortOrder).not.have.been.called;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when press enter key, should update the sorting', () => {
      evt.key = 'Enter';
      headHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        changeSortOrder,
        layout,
        isDim,
        isAnalysisMode,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(changeSortOrder).to.have.been.calledOnce;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when press enter key not in analysis mdoe, should not update the sorting', () => {
      evt.key = 'Enter';
      isAnalysisMode = false;
      headHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        changeSortOrder,
        layout,
        isDim,
        isAnalysisMode,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(changeSortOrder).not.have.been.called;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });

    it('when press ArrowRight and shif and ctrl key, should not update the sorting', () => {
      evt.key = 'ArrowRight';
      evt.shiftKey = true;
      evt.ctrlKey = true;
      headHandleKeyPress(
        evt,
        rootElement,
        [rowIndex, colIndex],
        changeSortOrder,
        layout,
        isDim,
        isAnalysisMode,
        setfocusedCellCoord
      );
      expect(evt.preventDefault).not.have.been.called;
      expect(evt.stopPropagation).not.have.been.called;
      expect(changeSortOrder).not.have.been.called;
      expect(setfocusedCellCoord).to.not.have.been.called;
    });
  });

  describe('updatePage', () => {
    const sandbox = sinon.createSandbox();
    let evt = {};
    let totalRowSize;
    let page;
    let rowsPerPage;
    let handleChangePage;
    let setShouldRefocus;

    beforeEach(() => {
      evt = {
        shiftKey: true,
        ctrlKey: true,
        metaKey: true,
        key: 'ArrowRight',
      };
      handleChangePage = sandbox.spy();
      setShouldRefocus = sandbox.spy();
    });

    afterEach(() => {
      sandbox.verifyAndRestore();
    });

    it('when shift key is not pressed, handleChangePage should not run', () => {
      evt.shiftKey = false;
      updatePage({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.have.been.called;
      expect(setShouldRefocus).not.have.been.called;
    });

    it('when ctrl key or meta key is not pressed, handleChangePage should not run', () => {
      evt.ctrlKey = false;
      evt.metaKey = false;
      updatePage({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.have.been.called;
      expect(setShouldRefocus).not.have.been.called;
    });

    it('when presss arrow right key on the first page which contains all rows, handleChangePage should not run', () => {
      page = 0;
      totalRowSize = 40;
      rowsPerPage = 40;
      updatePage({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.have.been.called;
      expect(setShouldRefocus).not.have.been.called;
    });

    it('when presss arrow left key on the first page, handleChangePage should not run', () => {
      evt.key = 'ArrowLeft';
      page = 0;
      totalRowSize = 40;
      rowsPerPage = 10;
      updatePage({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.have.been.called;
      expect(setShouldRefocus).not.have.been.called;
    });

    it('when presss arrow right key on the page whose next page contains rows, should change page', () => {
      totalRowSize = 40;
      page = 0;
      rowsPerPage = 10;
      updatePage({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).to.have.been.calledOnce;
      expect(setShouldRefocus).to.have.been.calledOnce;
    });

    it('when presss arrow left key not on the first page, should change page', () => {
      evt.key = 'ArrowLeft';
      totalRowSize = 40;
      page = 1;
      rowsPerPage = 40;
      updatePage({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).to.have.been.calledOnce;
      expect(setShouldRefocus).to.have.been.calledOnce;
    });
  });
});
