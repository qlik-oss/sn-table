import { expect } from 'chai';
import {
  getRowAndColumnCount,
  arrowKeysNavigation,
  bodyHandleKeyPress,
  headHandleKeyPress,
  handleTableWrapperKeyDown,
} from '../handle-key-press';

import * as handleAccessibility from '../handle-accessibility';

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

    it('should move to the next row when we reach to the end of the current row', () => {
      evt.key = 'ArrowRight';
      rowAndColumnCount.rowCount = 3;
      rowAndColumnCount.columnCount = 3;
      rowIndex = 1;
      colIndex = 3;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(2);
      expect(nextCol).to.eql(0);
    });

    it('should move to the prev row when we reach to the beganing of the current row', () => {
      evt.key = 'ArrowLeft';
      rowAndColumnCount.rowCount = 3;
      rowAndColumnCount.columnCount = 3;
      rowIndex = 2;
      colIndex = 0;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(1);
      expect(nextCol).to.eql(2);
    });

    it('should stay at the first row and first col of table when we reached to the beganing of the table', () => {
      evt.key = 'ArrowLeft';
      rowAndColumnCount.rowCount = 2;
      rowAndColumnCount.columnCount = 2;
      rowIndex = 0;
      colIndex = 0;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(0);
      expect(nextCol).to.eql(0);
    });

    it('should stay at the end row and end col of table when we reached to the end of the table', () => {
      evt.key = 'ArrowRight';
      rowAndColumnCount.rowCount = 2;
      rowAndColumnCount.columnCount = 2;
      rowIndex = 1;
      colIndex = 1;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).to.eql(1);
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

  describe('bodyHandleKeyPress', () => {
    let rowIndex;
    let colIndex;
    let evt = {};
    let rootElement = {};
    let selectionState = {};
    let cell = [];
    let selDispatch;
    let isAnalysisMode;
    let setFocusedCellCoord;
    let isModal;
    let announce;

    beforeEach(() => {
      rowIndex = 0;
      colIndex = 0;
      isModal = false;
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
      selectionState = {
        api: {
          confirm: sinon.spy(),
          cancel: sinon.spy(),
          begin: sinon.spy(),
          select: sinon.spy(),
          isModal: () => isModal,
        },
        rows: [],
        colIdx: -1,
      };
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1, isDim: true };
      selDispatch = sinon.spy();
      isAnalysisMode = true;
      setFocusedCellCoord = sinon.spy();
      announce = sinon.spy();
      sinon.stub(handleAccessibility, 'focusConfirmButton').returns(sinon.spy());
    });

    afterEach(() => {
      sinon.verifyAndRestore();
      sinon.resetHistory();
    });

    it('when press arrow down key on body cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell', () => {
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        isAnalysisMode: false,
        setFocusedCellCoord,
      });
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(evt.target.setAttribute).to.have.been.calledOnce;
      expect(setFocusedCellCoord).to.have.been.calledOnce;
    });

    it('when press space bar key and dimension, should select value for dimension', () => {
      evt.key = ' ';
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selectionState.api.begin).to.have.been.calledOnce;
      expect(selectionState.api.select).to.have.been.calledOnce;
      expect(selDispatch).to.have.been.calledOnce;
      expect(setFocusedCellCoord).to.not.have.been.called;
      expect(announce).to.have.been.calledWith({
        keys: ['SNTable.SelectionLabel.SelectedValue', 'SNTable.SelectionLabel.OneSelectedValue'],
      });
    });

    it('when moving to a cell on a dimension column which is selected, also have some selections already, should announce the value is selected', () => {
      isModal = true;
      cell = global.document.createElement('td');
      cell.classList.add('selected');

      rootElement = { getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }] };
      selectionState = { ...selectionState, rows: ['key#01'] };
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        setFocusedCellCoord,
        announce,
      });
      expect(announce).to.have.been.calledWith({
        keys: 'SNTable.SelectionLabel.SelectedValue',
      });
    });

    it('when moving to a cell on a dimension column which is not selected, also have some selections already, should announce the value is not selected', () => {
      isModal = true;
      cell = global.document.createElement('td');
      rootElement = { getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }] };
      selectionState = { ...selectionState, rows: ['key#01'] };
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        setFocusedCellCoord,
        announce,
      });
      expect(announce).to.have.been.calledWith({
        keys: 'SNTable.SelectionLabel.NotSelectedValue',
      });
    });

    it('when press space bar key not on dimension, should not select value for measure', () => {
      evt.key = ' ';
      cell = {
        isDim: false,
      };
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        isAnalysisMode: false,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selectionState.api.begin).not.have.been.called;
      expect(selectionState.api.select).not.have.been.called;
      expect(selDispatch).not.have.been.called;
      expect(setFocusedCellCoord).to.not.have.been.called;
      expect(announce).not.have.been.called;
    });

    it('when press space bar key not in analysis mode, should not select value for measure ', () => {
      evt.key = ' ';
      isAnalysisMode = false;
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        isAnalysisMode: false,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selectionState.api.begin).not.have.been.called;
      expect(selectionState.api.select).not.have.been.called;
      expect(selDispatch).not.have.been.called;
      expect(setFocusedCellCoord).to.not.have.been.called;
      expect(announce).not.have.been.called;
    });

    it('when press enter key, should confirms selections', () => {
      evt.key = 'Enter';
      isModal = true;
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selectionState.api.confirm).to.have.been.calledOnce;
      expect(setFocusedCellCoord).to.not.have.been.called;
      expect(announce).to.have.been.calledWith({ keys: 'SNTable.SelectionLabel.SelectionsConfirmed' });
    });

    it('when press enter key not in analysis mode, should not confirms selections', () => {
      evt.key = 'Enter';
      isAnalysisMode = false;
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selectionState.api.confirm).not.have.been.called;
      expect(setFocusedCellCoord).to.not.have.been.called;
      expect(announce).to.not.have.been.called;
    });

    it('when press cancel key, should cancel selection', () => {
      isModal = true;
      evt.key = 'Escape';
      selectionState.rows = [{}];
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(selectionState.api.cancel).to.have.been.calledOnce;
      expect(setFocusedCellCoord).to.not.have.been.called;
      expect(announce).to.have.been.calledWith({ keys: 'SNTable.SelectionLabel.ExitedSelectionMode' });
    });

    it('when press cancel key not in analysis mode, should not cancel selection', () => {
      isModal = true;
      evt.key = 'Escape';
      isAnalysisMode = false;
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).to.not.have.been.called;
      expect(evt.stopPropagation).to.not.have.been.called;
      expect(selectionState.api.cancel).to.not.have.been.called;
      expect(setFocusedCellCoord).to.not.have.been.called;
      expect(announce).to.not.have.been.called;
    });

    it('when press ArrowRight and shif and ctrl key, should not update the sorting', () => {
      evt.key = 'ArrowRight';
      evt.shiftKey = true;
      evt.ctrlKey = true;
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).not.have.been.called;
      expect(evt.stopPropagation).not.have.been.called;
      expect(selectionState.api.cancel).not.have.been.called;
      expect(setFocusedCellCoord).to.not.have.been.called;
      expect(announce).to.not.have.been.called;
    });

    it('when shift + tab is pressed should prevent defualt and call focusConfirmButton', () => {
      evt.key = 'Tab';
      evt.shiftKey = true;
      isModal = true;

      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).have.been.calledOnce;
      expect(evt.stopPropagation).have.been.calledOnce;
      expect(handleAccessibility.focusConfirmButton).to.have.been.calledOnce;
      expect(announce).to.not.have.been.called;
    });

    it('when only tab is pressed should not prevent defualt nor call focusConfirmButton', () => {
      evt.key = 'Tab';
      isModal = true;

      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).to.not.have.been.calledOnce;
      expect(evt.stopPropagation).to.not.have.been.calledOnce;
      expect(handleAccessibility.focusConfirmButton).to.not.have.been.called;
      expect(announce).to.not.have.been.called;
    });

    it('when shift + tab is pressed but not in selection mode, should not prevent defualt nor call focusConfirmButton', () => {
      evt.key = 'Tab';
      evt.shiftKey = true;

      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).to.not.have.been.calledOnce;
      expect(evt.stopPropagation).to.not.have.been.calledOnce;
      expect(handleAccessibility.focusConfirmButton).to.not.have.been.called;
      expect(announce).to.not.have.been.called;
    });

    it('when other keys are pressed, should not do anything', () => {
      evt.key = 'Control';
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionState,
        cell,
        selDispatch,
        setFocusedCellCoord,
        announce,
      });
      expect(evt.preventDefault).not.have.been.called;
      expect(evt.stopPropagation).not.have.been.called;
      expect(evt.target.blur).not.have.been.called;
      expect(evt.target.setAttribute).not.have.been.called;
      expect(selectionState.api.cancel).not.have.been.called;
      expect(setFocusedCellCoord).to.not.have.been.called;
      expect(announce).to.not.have.been.called;
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
    let setFocusedCellCoord;

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
      setFocusedCellCoord = sinon.spy();
    });

    it('when press arrow down key on head cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell', () => {
      headHandleKeyPress(evt, rootElement, [rowIndex, colIndex], null, null, null, false, setFocusedCellCoord);
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(evt.target.setAttribute).to.have.been.calledOnce;
      expect(setFocusedCellCoord).to.have.been.calledOnce;
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
        setFocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(changeSortOrder).to.have.been.calledOnce;
      expect(setFocusedCellCoord).to.not.have.been.called;
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
        setFocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(changeSortOrder).not.have.been.called;
      expect(setFocusedCellCoord).to.not.have.been.called;
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
        setFocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(changeSortOrder).to.have.been.calledOnce;
      expect(setFocusedCellCoord).to.not.have.been.called;
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
        setFocusedCellCoord
      );
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(changeSortOrder).not.have.been.called;
      expect(setFocusedCellCoord).to.not.have.been.called;
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
        setFocusedCellCoord
      );
      expect(evt.preventDefault).not.have.been.called;
      expect(evt.stopPropagation).not.have.been.called;
      expect(changeSortOrder).not.have.been.called;
      expect(setFocusedCellCoord).to.not.have.been.called;
    });
  });

  describe('handleTableWrapperKeyDown', () => {
    let evt = {};
    let totalRowSize;
    let page;
    let rowsPerPage;
    let handleChangePage;
    let setShouldRefocus;
    let keyboard;
    let isSelectionActive;

    beforeEach(() => {
      evt = {
        shiftKey: true,
        ctrlKey: true,
        metaKey: true,
        key: 'ArrowRight',
        stopPropagation: () => {},
        preventDefault: () => {},
      };
      handleChangePage = sinon.spy();
      setShouldRefocus = sinon.spy();
    });

    afterEach(() => {
      sinon.verifyAndRestore();
    });

    it('when shift key is not pressed, handleChangePage should not run', () => {
      evt.shiftKey = false;
      handleTableWrapperKeyDown({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.have.been.called;
      expect(setShouldRefocus).not.have.been.called;
    });

    it('when ctrl key or meta key is not pressed, handleChangePage should not run', () => {
      evt.ctrlKey = false;
      evt.metaKey = false;
      handleTableWrapperKeyDown({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.have.been.called;
      expect(setShouldRefocus).not.have.been.called;
    });

    it('when presss arrow right key on the first page which contains all rows, handleChangePage should not run', () => {
      page = 0;
      totalRowSize = 40;
      rowsPerPage = 40;
      handleTableWrapperKeyDown({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.have.been.called;
      expect(setShouldRefocus).not.have.been.called;
    });

    it('when presss arrow left key on the first page, handleChangePage should not run', () => {
      evt.key = 'ArrowLeft';
      page = 0;
      totalRowSize = 40;
      rowsPerPage = 10;
      handleTableWrapperKeyDown({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.have.been.called;
      expect(setShouldRefocus).not.have.been.called;
    });

    it('when presss arrow right key on the page whose next page contains rows, should change page', () => {
      totalRowSize = 40;
      page = 0;
      rowsPerPage = 10;
      handleTableWrapperKeyDown({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).to.have.been.calledOnce;
      expect(setShouldRefocus).to.have.been.calledOnce;
    });

    it('when presss arrow left key not on the first page, should change page', () => {
      evt.key = 'ArrowLeft';
      totalRowSize = 40;
      page = 1;
      rowsPerPage = 40;
      handleTableWrapperKeyDown({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).to.have.been.calledOnce;
      expect(setShouldRefocus).to.have.been.calledOnce;
    });

    it('when presss escape is pressed and keyboard.enabled is true, should call keyboard.blur', () => {
      evt = {
        key: 'Escape',
        stopPropagation: sinon.spy(),
        preventDefault: sinon.spy(),
      };
      keyboard = { enabled: true, blur: sinon.spy() };
      handleTableWrapperKeyDown({ evt, totalRowSize, page, rowsPerPage, handleChangePage, setShouldRefocus, keyboard });
      expect(evt.preventDefault).to.have.been.calledOnce;
      expect(evt.stopPropagation).to.have.been.calledOnce;
      expect(keyboard.blur).to.have.been.calledOnceWith(true);
    });

    it('should ignore keyboard.blur while we are focusing on the pagination and pressing Esc key', () => {
      evt = {
        key: 'Escape',
        stopPropagation: sinon.spy(),
        preventDefault: sinon.spy(),
      };
      keyboard = { enabled: true, blur: sinon.spy() };
      isSelectionActive = true;
      handleTableWrapperKeyDown({
        evt,
        totalRowSize,
        page,
        rowsPerPage,
        handleChangePage,
        setShouldRefocus,
        keyboard,
        isSelectionActive,
      });
      expect(evt.preventDefault).to.not.have.been.calledOnce;
      expect(evt.stopPropagation).to.not.have.been.calledOnce;
      expect(keyboard.blur).to.not.have.been.calledOnce;
    });
  });
});
