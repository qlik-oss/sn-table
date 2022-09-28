import { stardust } from '@nebula.js/stardust';
import React from 'react';

import {
  shouldBubble,
  handleWrapperKeyDown,
  handleBodyKeyDown,
  handleHeadKeyDown,
  handleTotalKeyDown,
  handleLastTab,
  handleBodyKeyUp,
} from '../handle-key-press';
import * as handleAccessibility from '../accessibility-utils';
import * as handleScroll from '../handle-scroll';
import { Announce, Column, ExtendedSelectionAPI, Cell, TableLayout, TotalsPosition } from '../../../types';
import { SelectionActionTypes } from '../../types';

describe('handle-key-press', () => {
  let isFlagEnabled: (flag: string) => boolean;

  beforeEach(() => {
    isFlagEnabled = (flag: string) => !!flag;
  });

  describe('shouldBubble', () => {
    let evt: React.KeyboardEvent;
    let isSelectionMode: boolean;
    let keyboardEnabled: boolean;
    let paginationNeeded: boolean;

    const callShouldBubble = () => shouldBubble(evt, isSelectionMode, keyboardEnabled, paginationNeeded);

    beforeEach(() => {
      evt = {
        key: 'Escape',
        shiftKey: false,
        ctrlKey: false,
        metaKey: false, // cases when meta key is pressed instead of ctrl is not tested here, the test are granular enough anyway
      } as unknown as React.KeyboardEvent;
      isSelectionMode = false;
      keyboardEnabled = false;
      paginationNeeded = true;
    });

    it('should return true when esc is pressed and isSelectionMode is false', () => {
      expect(callShouldBubble()).toBe(true);
    });

    it('should return false when esc is pressed and isSelectionMode is true', () => {
      isSelectionMode = true;
      expect(callShouldBubble()).toBe(false);
    });

    it('should return true when tab is pressed and paginationNeeded is true', () => {
      evt.key = 'Tab';
      expect(callShouldBubble()).toBe(true);
    });

    it('should return true when tab is pressed, paginationNeeded is false and keyboardEnabled is false but isSelectionMode is true', () => {
      evt.key = 'Tab';
      paginationNeeded = false;
      isSelectionMode = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return true when tab is pressed, paginationNeeded is false and isSelectionMode is false but keyboardEnabled is true', () => {
      evt.key = 'Tab';
      paginationNeeded = false;
      keyboardEnabled = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return false when tab is pressed, paginationNeeded is false and keyboardEnabled && isSelectionMode is true', () => {
      evt.key = 'Tab';
      paginationNeeded = false;
      keyboardEnabled = true;
      isSelectionMode = true;
      expect(callShouldBubble()).toBe(false);
    });

    it('should return true when shift + tab is pressed and keyboardEnabled is false but isSelectionMode is true', () => {
      evt.key = 'Tab';
      evt.shiftKey = true;
      isSelectionMode = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return true when shift + tab is pressed and isSelectionMode is false but keyboardEnabled is true', () => {
      evt.key = 'Tab';
      evt.shiftKey = true;
      keyboardEnabled = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return false when shift + tab is pressed and keyboardEnabled && isSelectionMode is true', () => {
      evt.key = 'Tab';
      evt.shiftKey = true;
      keyboardEnabled = true;
      isSelectionMode = true;
      expect(callShouldBubble()).toBe(false);
    });

    it('should return true when ctrl + shift + arrowRight is pressed', () => {
      evt.key = 'ArrowRight';
      evt.shiftKey = true;
      evt.ctrlKey = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return true when ctrl + shift + arrowLeft is pressed', () => {
      evt.key = 'ArrowLeft';
      evt.shiftKey = true;
      evt.ctrlKey = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return false when ctrl + shift + some other key is pressed', () => {
      evt.key = 'ArrowUp';
      evt.shiftKey = true;
      evt.ctrlKey = true;
      expect(callShouldBubble()).toBe(false);
    });

    it('should return false when ctrl + arrowLeft but not shift', () => {
      evt.key = 'ArrowLeft';
      evt.ctrlKey = true;
      expect(callShouldBubble()).toBe(false);
    });

    it('should return false when shift + arrowLeft but not ctrl', () => {
      evt.key = 'ArrowLeft';
      evt.shiftKey = true;
      expect(callShouldBubble()).toBe(false);
    });
  });

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

  describe('handleHeadKeyDown', () => {
    let rowIndex: number;
    let colIndex: number;
    let column: Column;
    let evt: React.KeyboardEvent;
    let rootElement: HTMLElement;
    let changeSortOrder: (layout: TableLayout, column: Column) => Promise<void>;
    let layout: TableLayout;
    let isInteractionEnabled: boolean;
    let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;

    const callHandleHeadKeyDown = () =>
      handleHeadKeyDown({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        column,
        changeSortOrder,
        layout,
        isInteractionEnabled,
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
      isInteractionEnabled = true;
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

    it('when press enter key, should update the sorting', () => {
      evt.key = 'Enter';
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when pressing a valid key and isInteractionEnabled is false, should only call preventDefaultBehavior', () => {
      evt.key = ' ';
      isInteractionEnabled = false;
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when pressing an invalid key, should only call preventDefaultBehavior', () => {
      evt.key = 'ArrowUp';
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });
  });

  describe('handleTotalKeyDown', () => {
    let evt: React.KeyboardEvent;
    let rootElement: HTMLElement;
    let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
    let cellCoord: [number, number];
    let isSelectionMode: boolean;

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
      isSelectionMode = false;
    });

    it('should move the focus from the current cell to the next when arrow key down is pressed on a total cell', () => {
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord, isSelectionMode);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
    });

    it('should only call preventDefaultBehavior when isSelectionMode is true', () => {
      isSelectionMode = true;
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord, isSelectionMode);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('should take the default case when the pressed key is not an arrow key', () => {
      evt.key = 'Enter';
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord, isSelectionMode);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });
  });

  describe('handleBodyKeyDown', () => {
    let isModal: boolean;
    let isExcluded: boolean;
    let evt: React.KeyboardEvent;
    let rootElement: HTMLElement;
    let selectionsAPI: ExtendedSelectionAPI;
    let cell: Cell;
    let selectionDispatch: React.Dispatch<SelectionActionTypes>;
    let isSelectionsEnabled: boolean;
    let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
    let keyboard: stardust.Keyboard;
    let announce: Announce;
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
        isFlagEnabled,
      });

    beforeEach(() => {
      isModal = false;
      isExcluded = false;
      evt = {
        key: 'ArrowDown',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          blur: jest.fn(),
          setAttribute: jest.fn(),
          classList: {
            contains: () => isExcluded,
          },
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
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1, isSelectable: true } as unknown as Cell;
      keyboard = { enabled: true } as unknown as stardust.Keyboard;
      selectionDispatch = jest.fn();
      isSelectionsEnabled = true;
      setFocusedCellCoord = jest.fn();
      announce = jest.fn();
      paginationNeeded = true;
      totalsPosition = 'noTotals';
      jest.spyOn(handleAccessibility, 'focusSelectionToolbar').mockImplementation(() => jest.fn());
      jest.spyOn(handleAccessibility, 'announceSelectionState').mockImplementation(() => jest.fn());
      jest.spyOn(handleAccessibility, 'copyCellValue');
      jest.spyOn(handleScroll, 'handleNavigateTop').mockImplementation(() => jest.fn());
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('when press arrow down key on body cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell', () => {
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).not.toHaveBeenCalled();
    });

    it('when press arrow left key on body cell, should prevent default behavior, remove current focus and set focus and attribute to the next cell', () => {
      evt.key = 'ArrowLeft';

      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.announceSelectionState).not.toHaveBeenCalled();
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
      } as Cell;
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

    it('when tab is pressed, paginationNeeded is false and in selection mode, should prevent default and call focusSelectionToolbar', () => {
      evt.key = 'Tab';
      isModal = true;
      paginationNeeded = false;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
      expect(announce).not.toHaveBeenCalled();
    });

    it('should call copyCellValue when the pressed keys are Ctrl and C keys', () => {
      evt.key = 'c';
      evt.ctrlKey = true;
      runHandleBodyKeyDown();
      expect(handleAccessibility.copyCellValue).toHaveBeenCalled();
    });

    it('should call copyCellValue when the pressed keys are Meta and C keys', () => {
      evt.key = 'c';
      evt.metaKey = true;
      runHandleBodyKeyDown();
      expect(handleAccessibility.copyCellValue).toHaveBeenCalled();
    });

    it('should not call copyCellValue when the flag is disabled', () => {
      evt.key = 'c';
      evt.metaKey = true;
      isFlagEnabled = (flag: string) => !flag;
      runHandleBodyKeyDown();
      expect(handleAccessibility.copyCellValue).not.toHaveBeenCalled();
    });

    it('when other keys are pressed, should only prevent default behavior', () => {
      evt.key = 'A';
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).blur).not.toHaveBeenCalled();
      expect((evt.target as HTMLElement).setAttribute).not.toHaveBeenCalled();
      expect(selectionsAPI.cancel).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it('when event is coming from excluded cell, should only prevent default behavior', () => {
      isExcluded = true;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect((evt.target as HTMLElement).blur).not.toHaveBeenCalled();
      expect((evt.target as HTMLElement).setAttribute).not.toHaveBeenCalled();
      expect(selectionsAPI.cancel).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });
  });

  describe('handleBodyKeyUp', () => {
    let evt: React.KeyboardEvent;
    let selectionDispatch: React.Dispatch<SelectionActionTypes>;

    beforeEach(() => {
      evt = {
        key: 'Shift',
      } as unknown as React.KeyboardEvent;
      selectionDispatch = jest.fn();
    });

    it('when the shift key is pressed, should run selectionDispatch', () => {
      handleBodyKeyUp(evt, selectionDispatch, isFlagEnabled);

      expect(selectionDispatch).toHaveBeenCalledTimes(1);
    });

    it('when other keys are pressed, should not do anything', () => {
      evt.key = 'Control';

      handleBodyKeyUp(evt, selectionDispatch, isFlagEnabled);

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
