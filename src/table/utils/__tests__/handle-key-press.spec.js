import {
  handleTableWrapperKeyDown,
  arrowKeysNavigation,
  headHandleKeyPress,
  bodyHandleKeyPress,
  handleLastTab,
  totalHandleKeyPress,
} from '../handle-key-press';

import * as handleAccessibility from '../handle-accessibility';

describe('handle-key-press', () => {
  describe('handleTableWrapperKeyDown', () => {
    let evt = {};
    let totalRowCount;
    let page;
    let rowsPerPage;
    let handleChangePage;
    let setShouldRefocus;
    let keyboard;
    let isSelectionMode;

    beforeEach(() => {
      evt = {
        shiftKey: true,
        ctrlKey: true,
        metaKey: true,
        key: 'ArrowRight',
        stopPropagation: () => {},
        preventDefault: () => {},
      };
      handleChangePage = jest.fn();
      setShouldRefocus = jest.fn();
    });

    it('when shift key is not pressed, handleChangePage should not run', () => {
      evt.shiftKey = false;
      handleTableWrapperKeyDown({ evt, totalRowCount, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it('when ctrl key or meta key is not pressed, handleChangePage should not run', () => {
      evt.ctrlKey = false;
      evt.metaKey = false;
      handleTableWrapperKeyDown({ evt, totalRowCount, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it('when press arrow right key on the first page which contains all rows, handleChangePage should not run', () => {
      page = 0;
      totalRowCount = 40;
      rowsPerPage = 40;
      handleTableWrapperKeyDown({ evt, totalRowCount, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it('when press arrow left key on the first page, handleChangePage should not run', () => {
      evt.key = 'ArrowLeft';
      page = 0;
      totalRowCount = 40;
      rowsPerPage = 10;
      handleTableWrapperKeyDown({ evt, totalRowCount, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it('when press arrow right key on the page whose next page contains rows, should change page', () => {
      totalRowCount = 40;
      page = 0;
      rowsPerPage = 10;
      handleTableWrapperKeyDown({ evt, totalRowCount, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).toHaveBeenCalledTimes(1);
      expect(setShouldRefocus).toHaveBeenCalledTimes(1);
    });

    it('when press arrow left key not on the first page, should change page', () => {
      evt.key = 'ArrowLeft';
      totalRowCount = 40;
      page = 1;
      rowsPerPage = 40;
      handleTableWrapperKeyDown({ evt, totalRowCount, page, rowsPerPage, handleChangePage, setShouldRefocus });
      expect(handleChangePage).toHaveBeenCalledTimes(1);
      expect(setShouldRefocus).toHaveBeenCalledTimes(1);
    });

    it('when press escape is pressed and keyboard.enabled is true, should call keyboard.blur', () => {
      evt = {
        key: 'Escape',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      };
      keyboard = { enabled: true, blur: jest.fn() };
      handleTableWrapperKeyDown({
        evt,
        totalRowCount,
        page,
        rowsPerPage,
        handleChangePage,
        setShouldRefocus,
        keyboard,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(keyboard.blur).toHaveBeenCalledWith(true);
    });

    it('should ignore keyboard.blur while you are focusing on the pagination and pressing Esc key', () => {
      evt = {
        key: 'Escape',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      };
      keyboard = { enabled: true, blur: jest.fn() };
      isSelectionMode = true;
      handleTableWrapperKeyDown({
        evt,
        totalRowCount,
        page,
        rowsPerPage,
        handleChangePage,
        setShouldRefocus,
        keyboard,
        isSelectionMode,
      });
      expect(evt.preventDefault).not.toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).not.toHaveBeenCalledTimes(1);
      expect(keyboard.blur).not.toHaveBeenCalledTimes(1);
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
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should stay the current cell when move up', () => {
      evt.key = 'ArrowUp';
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should go to one row down cell', () => {
      evt.key = 'ArrowDown';
      rowAndColumnCount.rowCount = 2;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(0);
    });

    it('should go to one row up cell', () => {
      evt.key = 'ArrowUp';
      rowAndColumnCount.rowCount = 2;
      rowIndex = 1;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should go to one column left cell', () => {
      evt.key = 'ArrowLeft';
      rowAndColumnCount.columnCount = 2;
      colIndex = 1;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should go to one column right cell', () => {
      evt.key = 'ArrowRight';
      rowAndColumnCount.columnCount = 2;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(1);
    });

    it('should stay the current cell when other keys are pressed', () => {
      evt.key = 'Control';
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should move to the next row when you reach to the end of the current row', () => {
      evt.key = 'ArrowRight';
      rowAndColumnCount.rowCount = 3;
      rowAndColumnCount.columnCount = 3;
      rowIndex = 1;
      colIndex = 3;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).toBe(2);
      expect(nextCol).toBe(0);
    });

    it('should move to the prev row when we reach to the beginning of the current row', () => {
      evt.key = 'ArrowLeft';
      rowAndColumnCount.rowCount = 3;
      rowAndColumnCount.columnCount = 3;
      rowIndex = 2;
      colIndex = 0;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(2);
    });

    it('should stay at the first row and first col of table when we reached to the beginning of the table', () => {
      evt.key = 'ArrowLeft';
      rowAndColumnCount.rowCount = 2;
      rowAndColumnCount.columnCount = 2;
      rowIndex = 0;
      colIndex = 0;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should stay at the end row and end col of table when you reached to the end of the table', () => {
      evt.key = 'ArrowRight';
      rowAndColumnCount.rowCount = 2;
      rowAndColumnCount.columnCount = 2;
      rowIndex = 1;
      colIndex = 1;
      const [nextRow, nextCol] = arrowKeysNavigation(evt, rowAndColumnCount, [rowIndex, colIndex]);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(1);
    });
  });

  describe('headHandleKeyPress', () => {
    let rowIndex;
    let colIndex;
    let column;
    let evt = {};
    let rootElement = {};
    let changeSortOrder;
    let layout;
    let isAnalysisMode;
    let setFocusedCellCoord;

    beforeEach(() => {
      rowIndex = 0;
      colIndex = 0;
      column = {};
      evt = {
        key: 'ArrowDown',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          blur: jest.fn(),
          setAttribute: jest.fn(),
        },
      };
      rootElement = {
        getElementsByClassName: () => [{ getElementsByClassName: () => [{ focus: () => {}, setAttribute: () => {} }] }],
      };
      changeSortOrder = jest.fn();
      isAnalysisMode = true;
      setFocusedCellCoord = jest.fn();
    });

    it('when press arrow down key on head cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell', () => {
      headHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        column,
        changeSortOrder: null,
        layout: null,
        isAnalysisMode: null,
        setFocusedCellCoord,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.target.setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
    });

    it('when press space bar key, should update the sorting', () => {
      evt.key = ' ';
      headHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        column,
        changeSortOrder,
        layout,
        isAnalysisMode,
        setFocusedCellCoord,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when press space bar key not in analysis mode, should not update the sorting', () => {
      evt.key = ' ';
      isAnalysisMode = false;
      headHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        column,
        changeSortOrder,
        layout,
        isAnalysisMode,
        setFocusedCellCoord,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when press enter key, should update the sorting', () => {
      evt.key = 'Enter';
      headHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        column,
        changeSortOrder,
        layout,
        isAnalysisMode,
        setFocusedCellCoord,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when press enter key not in analysis mode, should not update the sorting', () => {
      evt.key = 'Enter';
      isAnalysisMode = false;
      headHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        column,
        changeSortOrder,
        layout,
        isAnalysisMode,
        setFocusedCellCoord,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when press ArrowRight and shift and ctrl key, should not update the sorting', () => {
      evt.key = 'ArrowRight';
      evt.shiftKey = true;
      evt.ctrlKey = true;
      headHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        column,
        changeSortOrder,
        layout,
        isAnalysisMode,
        setFocusedCellCoord,
      });
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(changeSortOrder).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });
  });

  describe('totalHandleKeyPress', () => {
    let evt = {};
    let rootElement = {};
    let setFocusedCellCoord;
    let cellCoord;

    beforeEach(() => {
      evt = {
        key: 'ArrowDown',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          blur: jest.fn(),
          setAttribute: jest.fn(),
        },
      };
      cellCoord = [1, 1];
      rootElement = {
        getElementsByClassName: () => [{ getElementsByClassName: () => [{ focus: () => {}, setAttribute: () => {} }] }],
      };
      setFocusedCellCoord = jest.fn();
    });

    it('should move the focus from the current cell to the next when arrow key down is pressed on a total cell', () => {
      totalHandleKeyPress(evt, rootElement, cellCoord, setFocusedCellCoord);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.target.setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
    });

    it('should not move the focus to the next cell when press ArrowRight and shift and ctrl key', () => {
      evt.key = 'ArrowRight';
      evt.shiftKey = true;
      evt.ctrlKey = true;
      totalHandleKeyPress(evt, rootElement, cellCoord, setFocusedCellCoord);
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('should take the default case when the pressed key is not an arrow key', () => {
      evt.key = 'Enter';
      totalHandleKeyPress(evt, rootElement, cellCoord, setFocusedCellCoord);
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });
  });

  describe('bodyHandleKeyPress', () => {
    let rowIndex;
    let colIndex;
    let evt = {};
    let rootElement = {};
    let selectionsAPI;
    let cell = [];
    let selectionDispatch;
    let isAnalysisMode;
    let setFocusedCellCoord;
    let isModal;
    let keyboard;
    let announce;

    beforeEach(() => {
      rowIndex = 0;
      colIndex = 0;
      isModal = false;
      evt = {
        key: 'ArrowDown',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          blur: jest.fn(),
          setAttribute: jest.fn(),
        },
      };
      rootElement = {
        getElementsByClassName: () => [{ getElementsByClassName: () => [{ focus: () => {}, setAttribute: () => {} }] }],
      };
      selectionsAPI = {
        confirm: jest.fn(),
        cancel: jest.fn(),
        isModal: () => isModal,
      };
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1, isSelectable: true };
      keyboard = { enabled: true };
      selectionDispatch = jest.fn();
      isAnalysisMode = true;
      setFocusedCellCoord = jest.fn();
      announce = jest.fn();
      jest.spyOn(handleAccessibility, 'focusSelectionToolbar').mockImplementation(() => jest.fn());
    });

    afterEach(() => jest.clearAllMocks());

    it('when press arrow down key on body cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell', () => {
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        isAnalysisMode: false,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.target.setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
    });

    it('when press space bar key and dimension, should select value for dimension', () => {
      evt.key = ' ';
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when moving to a cell on a dimension column which is selected, also have some selections already, should announce the value is selected', () => {
      isModal = true;
      cell = global.document.createElement('td');
      cell.classList.add('selected');
      rootElement = { getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }] };
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        setFocusedCellCoord,
        announce,
      });
      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.SelectedValue'],
      });
    });

    it('when moving to a cell on a dimension column which is not selected, also have some selections already, should announce the value is not selected', () => {
      isModal = true;
      cell = global.document.createElement('td');
      rootElement = { getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }] };
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        setFocusedCellCoord,
        announce,
      });
      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.NotSelectedValue'],
      });
    });

    it('when press space bar key not on a dimension which is selectable, should not select value for measure', () => {
      evt.key = ' ';
      cell = {
        isSelectable: false,
      };
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode: false,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when press space bar key not in analysis mode, should not select value for measure', () => {
      evt.key = ' ';
      isAnalysisMode = false;
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode: false,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when press enter key, should confirms selections', () => {
      evt.key = 'Enter';
      isModal = true;
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionsAPI.confirm).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).toHaveBeenCalledWith({ keys: ['SNTable.SelectionLabel.SelectionsConfirmed'] });
    });

    it('when press enter key not in analysis mode, should not confirms selections', () => {
      evt.key = 'Enter';
      isAnalysisMode = false;
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionsAPI.confirm).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when press esc key, should cancel selection', () => {
      isModal = true;
      evt.key = 'Escape';
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionsAPI.cancel).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).toHaveBeenCalledWith({ keys: ['SNTable.SelectionLabel.ExitedSelectionMode'] });
    });

    it('when press cancel key not in analysis mode, should not cancel selection', () => {
      isModal = true;
      evt.key = 'Escape';
      isAnalysisMode = false;
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(selectionsAPI.cancel).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when press ArrowRight and shift and ctrl key, should not update the sorting', () => {
      evt.key = 'ArrowRight';
      evt.shiftKey = true;
      evt.ctrlKey = true;
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(selectionsAPI.cancel).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when shift + tab is pressed should prevent default and call focusSelectionToolbar', () => {
      evt.key = 'Tab';
      evt.shiftKey = true;
      isModal = true;

      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
      expect(announce).not.toHaveBeenCalled();
    });

    it('when only tab is pressed should not prevent default nor call focusSelectionToolbar', () => {
      evt.key = 'Tab';
      isModal = true;

      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when shift + tab is pressed but not in selection mode, should not prevent default nor call focusSelectionToolbar', () => {
      evt.key = 'Tab';
      evt.shiftKey = true;

      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });

    it('when shift + tab is pressed but keyboard.enabled is false, should not prevent default nor call focusSelectionToolbar', () => {
      evt.key = 'Tab';
      evt.shiftKey = true;
      keyboard.enabled = false;

      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when other keys are pressed, should not do anything', () => {
      evt.key = 'Control';
      bodyHandleKeyPress({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        selectionsAPI,
        cell,
        selectionDispatch,
        isAnalysisMode,
        setFocusedCellCoord,
        announce,
        keyboard,
      });
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(evt.target.blur).not.toHaveBeenCalled();
      expect(evt.target.setAttribute).not.toHaveBeenCalled();
      expect(selectionsAPI.cancel).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });
  });

  describe('handleLastTab', () => {
    let evt;
    let isSelectionMode;

    beforeEach(() => {
      evt = {
        key: 'Tab',
        shiftKey: false,
        target: {},
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      };
      isSelectionMode = true;
      jest.spyOn(handleAccessibility, 'focusSelectionToolbar').mockImplementation(() => jest.fn());
    });

    afterEach(() => jest.clearAllMocks());

    it('should call focusSelectionToolbar when isSelectionMode is true and tab is pressed', () => {
      handleLastTab(evt, isSelectionMode);

      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
    });

    it('should not call focusSelectionToolbar when isSelectionMode is false', () => {
      isSelectionMode = false;
      handleLastTab(evt, isSelectionMode);

      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });

    it('should not call focusSelectionToolbar when key is not tab', () => {
      evt.key = 'someKey';
      handleLastTab(evt, isSelectionMode);

      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });

    it('should not call focusSelectionToolbar when shift+tab is pressed', () => {
      evt.shiftKey = true;
      handleLastTab(evt, isSelectionMode);

      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });
  });
});
