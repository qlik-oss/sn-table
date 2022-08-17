import { stardust } from '@nebula.js/stardust';
import React from 'react';

import {
  handleWrapperKeyDown,
  getNextCellCoord,
  handleBodyKeyDown,
  handleHeadKeyDown,
  handleTotalKeyDown,
  handleLastTab,
  handleBodyKeyUp,
} from '../handle-key-press';
import * as handleAccessibility from '../handle-accessibility';
import * as handleScroll from '../handle-scroll';
import { AnnounceFn, Column, ExtendedSelectionAPI, TableCell, TableLayout, TotalsPosition } from '../../../types';
import { TSelectionActions } from '../selections-utils';

describe('handle-key-press', () => {
  describe('handleWrapperKeyDown', () => {
    let evt: React.KeyboardEvent;
    let totalRowCount: number;
    let page: number;
    let rowsPerPage: number;
    let handleChangePage: (pageIdx: number) => void;
    let setShouldRefocus: () => void;
    let keyboard: stardust.Keyboard;
    let isSelectionMode: boolean;

    const callHandleWrapperKeyDown = () =>
      handleWrapperKeyDown({
        evt,
        totalRowCount,
        page,
        rowsPerPage,
        handleChangePage,
        setShouldRefocus,
        keyboard,
        isSelectionMode,
      });

    beforeEach(() => {
      evt = {
        shiftKey: true,
        ctrlKey: true,
        metaKey: true,
        key: 'ArrowRight',
        stopPropagation: () => undefined,
        preventDefault: () => undefined,
      } as unknown as React.KeyboardEvent;
      handleChangePage = jest.fn();
      setShouldRefocus = jest.fn();
      keyboard = { enabled: false, active: false, blur: jest.fn(), focus: jest.fn() };
      isSelectionMode = false;
    });

    it('when shift key is not pressed, handleChangePage should not run', () => {
      evt.shiftKey = false;
      callHandleWrapperKeyDown();
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it('when ctrl key or meta key is not pressed, handleChangePage should not run', () => {
      evt.ctrlKey = false;
      evt.metaKey = false;
      callHandleWrapperKeyDown();
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it('when press arrow right key on the first page which contains all rows, handleChangePage should not run', () => {
      page = 0;
      totalRowCount = 40;
      rowsPerPage = 40;
      callHandleWrapperKeyDown();
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it('when press arrow left key on the first page, handleChangePage should not run', () => {
      evt.key = 'ArrowLeft';
      page = 0;
      totalRowCount = 40;
      rowsPerPage = 10;
      callHandleWrapperKeyDown();
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it('when press arrow right key on the page whose next page contains rows, should change page', () => {
      totalRowCount = 40;
      page = 0;
      rowsPerPage = 10;
      callHandleWrapperKeyDown();
      expect(handleChangePage).toHaveBeenCalledTimes(1);
      expect(setShouldRefocus).toHaveBeenCalledTimes(1);
    });

    it('when press arrow left key not on the first page, should change page', () => {
      evt.key = 'ArrowLeft';
      totalRowCount = 40;
      page = 1;
      rowsPerPage = 40;
      callHandleWrapperKeyDown();
      expect(handleChangePage).toHaveBeenCalledTimes(1);
      expect(setShouldRefocus).toHaveBeenCalledTimes(1);
    });

    it('when press escape is pressed and keyboard.enabled is true, should call keyboard.blur', () => {
      evt = {
        key: 'Escape',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent;
      keyboard.enabled = true;
      callHandleWrapperKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(keyboard.blur).toHaveBeenCalledWith(true);
    });

    it('should ignore keyboard.blur while you are focusing on the pagination and pressing Esc key', () => {
      evt = {
        key: 'Escape',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent;
      keyboard.enabled = true;
      isSelectionMode = true;
      callHandleWrapperKeyDown();
      expect(evt.preventDefault).not.toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).not.toHaveBeenCalledTimes(1);
      expect(keyboard.blur).not.toHaveBeenCalledTimes(1);
    });
  });

  describe('getNextCellCoord', () => {
    let evt: React.KeyboardEvent;
    let rowCount: number;
    let columnCount: number;
    let rowIndex: number;
    let colIndex: number;
    let rootElement: HTMLElement;

    beforeEach(() => {
      evt = {} as unknown as React.KeyboardEvent;
      rowCount = 1;
      columnCount = 1;
      rootElement = {
        getElementsByClassName: (className: string) =>
          className === 'sn-table-row' ? Array(rowCount) : Array(columnCount),
      } as unknown as HTMLElement;
      rowIndex = 0;
      colIndex = 0;
    });

    it('should stay the current cell when move down', () => {
      evt.key = 'ArrowDown';
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should stay the current cell when move up', () => {
      evt.key = 'ArrowUp';
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should go to one row down cell', () => {
      evt.key = 'ArrowDown';
      rowCount = 2;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(0);
    });

    it('should go to one row up cell', () => {
      evt.key = 'ArrowUp';
      rowCount = 2;
      rowIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should go to one column left cell', () => {
      evt.key = 'ArrowLeft';
      columnCount = 2;
      colIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should go to one column right cell', () => {
      evt.key = 'ArrowRight';
      columnCount = 2;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(1);
    });

    it('should stay the current cell when other keys are pressed', () => {
      evt.key = 'Control';
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should move to the next row when you reach to the end of the current row', () => {
      evt.key = 'ArrowRight';
      rowCount = 3;
      columnCount = 3;
      rowIndex = 1;
      colIndex = 3;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(2);
      expect(nextCol).toBe(0);
    });

    it('should move to the prev row when we reach to the beginning of the current row', () => {
      evt.key = 'ArrowLeft';
      rowCount = 3;
      columnCount = 3;
      rowIndex = 2;
      colIndex = 0;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(2);
    });

    it('should stay at the first row and first col of table when we reached to the beginning of the table', () => {
      evt.key = 'ArrowLeft';
      rowCount = 2;
      columnCount = 2;
      rowIndex = 0;
      colIndex = 0;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(0);
      expect(nextCol).toBe(0);
    });

    it('should stay at the end row and end col of table when you reached to the end of the table', () => {
      evt.key = 'ArrowRight';
      rowCount = 2;
      columnCount = 2;
      rowIndex = 1;
      colIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex]);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(1);
    });

    it('should stay at the current cell when topAllowed cell is 1 and trying to move up from rowIdx 1', () => {
      evt.key = 'ArrowUp';
      const topAllowedRow = 1;
      rowCount = 3;
      rowIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex], topAllowedRow);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(0);
    });

    it('should stay at the current cell when trying to move left and topAllowedRow is > 0 (i.e in selection mode', () => {
      evt.key = 'ArrowLeft';
      const topAllowedRow = 1;
      rowCount = 3;
      columnCount = 3;
      rowIndex = 1;
      colIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex], topAllowedRow);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(1);
    });

    it('should stay at the current cell when trying to move right and topAllowedRow is > 0 (i.e in selection mode', () => {
      evt.key = 'ArrowRight';
      const topAllowedRow = 1;
      rowCount = 3;
      columnCount = 3;
      rowIndex = 1;
      colIndex = 1;
      const [nextRow, nextCol] = getNextCellCoord(evt, rootElement, [rowIndex, colIndex], topAllowedRow);
      expect(nextRow).toBe(1);
      expect(nextCol).toBe(1);
    });
  });

  describe('handleHeadKeyDown', () => {
    let rowIndex: number;
    let colIndex: number;
    let column: Column;
    let evt: React.KeyboardEvent;
    let rootElement: HTMLElement;
    let changeSortOrder: (layout: TableLayout, column: Column) => Promise<void>;
    let layout: TableLayout;
    let isSortingEnabled: boolean;
    let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;

    const callHandleHeadKeyDown = () =>
      handleHeadKeyDown({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        column,
        changeSortOrder,
        layout,
        isSortingEnabled,
        setFocusedCellCoord,
      });

    beforeEach(() => {
      rowIndex = 0;
      colIndex = 0;
      column = {} as unknown as Column;
      evt = {
        key: 'ArrowDown',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          blur: jest.fn(),
          setAttribute: jest.fn(),
        } as unknown as HTMLElement,
      } as unknown as React.KeyboardEvent;
      rootElement = {
        getElementsByClassName: () => [
          {
            getElementsByClassName: () => [{ focus: () => undefined, setAttribute: () => undefined }],
          },
        ],
      } as unknown as HTMLElement;
      changeSortOrder = jest.fn();
      isSortingEnabled = true;
      setFocusedCellCoord = jest.fn();
    });

    it('when press arrow down key on head cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell', () => {
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
    });

    it('when press space bar key, should update the sorting', () => {
      evt.key = ' ';
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when press space bar key and sorting is not enabled, should not update the sorting', () => {
      evt.key = ' ';
      isSortingEnabled = false;
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when press enter key, should update the sorting', () => {
      evt.key = 'Enter';
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when press enter key and sorting is not enabled, should not update the sorting', () => {
      evt.key = 'Enter';
      isSortingEnabled = false;
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when press ArrowRight and shift and ctrl key, should not update the sorting', () => {
      evt.key = 'ArrowRight';
      evt.shiftKey = true;
      evt.ctrlKey = true;
      callHandleHeadKeyDown();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(changeSortOrder).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });
  });

  describe('handleTotalKeyDown', () => {
    let evt: React.KeyboardEvent;
    let rootElement: HTMLElement;
    let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
    let cellCoord: [number, number];

    beforeEach(() => {
      evt = {
        key: 'ArrowDown',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          blur: jest.fn(),
          setAttribute: jest.fn(),
        } as unknown as HTMLElement,
      } as unknown as React.KeyboardEvent;
      cellCoord = [1, 1];
      rootElement = {
        getElementsByClassName: () => [
          { getElementsByClassName: () => [{ focus: () => undefined, setAttribute: () => undefined }] },
        ],
      } as unknown as HTMLElement;
      setFocusedCellCoord = jest.fn();
    });

    it('should move the focus from the current cell to the next when arrow key down is pressed on a total cell', () => {
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
    });

    it('should not move the focus to the next cell when press ArrowRight and shift and ctrl key', () => {
      evt.key = 'ArrowRight';
      evt.shiftKey = true;
      evt.ctrlKey = true;
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord);
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('should take the default case when the pressed key is not an arrow key', () => {
      evt.key = 'Enter';
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord);
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });
  });

  describe('handleBodyKeyDown', () => {
    let isModal: boolean;
    let evt: React.KeyboardEvent;
    let rootElement: HTMLElement;
    let selectionsAPI: ExtendedSelectionAPI;
    let cell: TableCell;
    let selectionDispatch: React.Dispatch<TSelectionActions>;
    let isSelectionsEnabled: boolean;
    let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
    let keyboard: stardust.Keyboard;
    let announce: AnnounceFn;
    let paginationNeeded: boolean;
    let totalsPosition: TotalsPosition;

    const runHandleBodyKeyDown = () =>
      handleBodyKeyDown({
        evt,
        rootElement,
        selectionsAPI,
        cell,
        selectionDispatch,
        isSelectionsEnabled,
        setFocusedCellCoord,
        announce,
        keyboard,
        paginationNeeded,
        totalsPosition,
      });

    beforeEach(() => {
      isModal = false;
      evt = {
        key: 'ArrowDown',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          blur: jest.fn(),
          setAttribute: jest.fn(),
        } as unknown as HTMLElement,
      } as unknown as React.KeyboardEvent;
      rootElement = {
        getElementsByClassName: () => [
          { getElementsByClassName: () => [{ focus: () => undefined, setAttribute: () => undefined }] },
        ],
      } as unknown as HTMLElement;
      selectionsAPI = {
        confirm: jest.fn(),
        cancel: jest.fn(),
        isModal: () => isModal,
      } as unknown as ExtendedSelectionAPI;
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1, isSelectable: true } as unknown as TableCell;
      keyboard = { enabled: true } as unknown as stardust.Keyboard;
      selectionDispatch = jest.fn();
      isSelectionsEnabled = true;
      setFocusedCellCoord = jest.fn();
      announce = jest.fn();
      paginationNeeded = true;
      totalsPosition = 'noTotals';
      jest.spyOn(handleAccessibility, 'focusSelectionToolbar').mockImplementation(() => jest.fn());
      jest.spyOn(handleAccessibility, 'announceSelectionState').mockImplementation(() => jest.fn());
      jest.spyOn(handleScroll, 'handleNavigateTop').mockImplementation(() => jest.fn());
    });

    afterEach(() => jest.clearAllMocks());

    it('when press arrow down key on body cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell', () => {
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).not.toHaveBeenCalled();
    });

    it('when press arrow up key on body cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell and call handleNavigateTop', () => {
      evt.key = 'ArrowUp';

      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(1);
    });

    it('when press shift + arrow down key on body cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell, and select values for dimension', () => {
      cell.nextQElemNumber = 1;
      evt.shiftKey = true;

      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.announceSelectionState).not.toHaveBeenCalled();
      expect(handleScroll.handleNavigateTop).not.toHaveBeenCalled();
    });

    it('when press shift + arrow down key on the last row cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell, but not select values for dimension', () => {
      evt.shiftKey = true;

      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).not.toHaveBeenCalled();
      expect(handleAccessibility.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).not.toHaveBeenCalled();
    });

    it('when press shift + arrow up key on body cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell, and select values for dimension', () => {
      cell.prevQElemNumber = 1;
      evt.shiftKey = true;
      evt.key = 'ArrowUp';

      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.announceSelectionState).not.toHaveBeenCalled();
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(1);
    });

    it('when press shift + arrow up key on the second row cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell, but not select values for dimension', () => {
      evt.shiftKey = true;
      evt.key = 'ArrowUp';

      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).not.toHaveBeenCalled();
      expect(handleAccessibility.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(1);
    });

    it('when press space bar key and dimension, should select value for dimension', () => {
      evt.key = ' ';
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when press space bar key on a cell that is not selectable, should not select value', () => {
      evt.key = ' ';
      cell = {
        isSelectable: false,
      } as TableCell;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when press space bar key and selections are not enabled, should not select value', () => {
      evt.key = ' ';
      isSelectionsEnabled = false;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when press enter key, should confirms selections', () => {
      evt.key = 'Enter';
      isModal = true;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionsAPI.confirm).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).toHaveBeenCalledWith({ keys: ['SNTable.SelectionLabel.SelectionsConfirmed'] });
    });

    it('when press enter key and not in selections mode, should not confirms selections', () => {
      evt.key = 'Enter';
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionsAPI.confirm).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when press esc key and in selections mode, should cancel selection', () => {
      evt.key = 'Escape';
      isModal = true;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionsAPI.cancel).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).toHaveBeenCalledWith({ keys: ['SNTable.SelectionLabel.ExitedSelectionMode'] });
    });

    it('when press esc key not in selection mode, should not cancel selection', () => {
      evt.key = 'Escape';
      runHandleBodyKeyDown();
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
      runHandleBodyKeyDown();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(selectionsAPI.cancel).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when shift + tab is pressed and in selections mode, should prevent default and call focusSelectionToolbar', () => {
      evt.key = 'Tab';
      evt.shiftKey = true;
      isModal = true;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
      expect(announce).not.toHaveBeenCalled();
    });

    it('when only tab is pressed should not prevent default nor call focusSelectionToolbar', () => {
      evt.key = 'Tab';
      isModal = true;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when tab is pressed and paginationNeeded is false, should prevent default and call focusSelectionToolbar', () => {
      evt.key = 'Tab';
      isModal = true;
      paginationNeeded = false;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
      expect(announce).not.toHaveBeenCalled();
    });

    it('when shift + tab is pressed but not in selection mode, should not prevent default nor call focusSelectionToolbar', () => {
      evt.key = 'Tab';
      evt.shiftKey = true;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });

    it('when shift + tab is pressed but keyboard.enabled is false, should not prevent default nor call focusSelectionToolbar', () => {
      evt.key = 'Tab';
      evt.shiftKey = true;
      keyboard.enabled = false;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('when other keys are pressed, should not do anything', () => {
      evt.key = 'Control';
      runHandleBodyKeyDown();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect((evt.target as HTMLElement).blur).not.toHaveBeenCalled();
      expect((evt.target as HTMLElement).setAttribute).not.toHaveBeenCalled();
      expect(selectionsAPI.cancel).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });
  });

  describe('handleBodyKeyUp', () => {
    let evt: React.KeyboardEvent;
    let selectionDispatch: React.Dispatch<TSelectionActions>;

    beforeEach(() => {
      evt = {
        key: 'Shift',
      } as unknown as React.KeyboardEvent;
      selectionDispatch = jest.fn();
    });

    it('when the shift key is pressed, should run selectionDispatch', () => {
      handleBodyKeyUp(evt, selectionDispatch);

      expect(selectionDispatch).toHaveBeenCalledTimes(1);
    });

    it('when other keys are pressed, should not do anything', () => {
      evt.key = 'Control';

      handleBodyKeyUp(evt, selectionDispatch);

      expect(selectionDispatch).not.toHaveBeenCalled();
    });
  });

  describe('handleLastTab', () => {
    let evt: React.KeyboardEvent;
    let isSelectionMode: boolean;
    const keyboard = {} as unknown as stardust.Keyboard;

    beforeEach(() => {
      evt = {
        key: 'Tab',
        shiftKey: false,
        target: {} as HTMLElement,
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent;
      isSelectionMode = true;
      jest.spyOn(handleAccessibility, 'focusSelectionToolbar').mockImplementation(() => jest.fn());
    });

    afterEach(() => jest.clearAllMocks());

    it('should call focusSelectionToolbar when isSelectionMode is true and tab is pressed', () => {
      handleLastTab(evt, isSelectionMode, keyboard);

      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
    });

    it('should not call focusSelectionToolbar when isSelectionMode is false', () => {
      isSelectionMode = false;
      handleLastTab(evt, isSelectionMode, keyboard);

      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });

    it('should not call focusSelectionToolbar when key is not tab', () => {
      evt.key = 'someKey';
      handleLastTab(evt, isSelectionMode, keyboard);

      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });

    it('should not call focusSelectionToolbar when shift+tab is pressed', () => {
      evt.shiftKey = true;
      handleLastTab(evt, isSelectionMode, keyboard);

      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });
  });
});
