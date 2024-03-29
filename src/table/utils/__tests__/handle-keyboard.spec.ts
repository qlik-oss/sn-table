import { stardust } from "@nebula.js/stardust";
import React from "react";

import { Announce, Cell, Column, ExtendedSelectionAPI, TotalsPosition } from "../../../types";
import { FocusTypes, KeyCodes } from "../../constants";
import { SelectionDispatch } from "../../types";
import * as accessibilityUtils from "../accessibility-utils";
import * as handleCopy from "../copy-utils";
import * as getElementUtils from "../get-element-utils";
import {
  handleBodyKeyDown,
  handleBodyKeyUp,
  handleHeadKeyDown,
  handleTotalKeyDown,
  handleWrapperKeyDown,
} from "../handle-keyboard";
import * as handleScroll from "../handle-scroll";
import * as keyboardUtils from "../keyboard-utils";

describe("handle-keyboard", () => {
  beforeEach(() => {
    jest.spyOn(handleCopy, "default").mockImplementation(() => new Promise(() => {}));
  });

  afterEach(() => jest.clearAllMocks());

  describe("handleWrapperKeyDown", () => {
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
        key: KeyCodes.RIGHT,
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent;
      handleChangePage = jest.fn();
      setShouldRefocus = jest.fn();
      keyboard = { enabled: false, active: false, blur: jest.fn(), focus: jest.fn() };
      isSelectionMode = false;
    });

    it("when shift key is not pressed, handleChangePage should not run", () => {
      evt.shiftKey = false;
      callHandleWrapperKeyDown();
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it("when ctrl key or meta key is not pressed, handleChangePage should not run", () => {
      evt.ctrlKey = false;
      evt.metaKey = false;
      callHandleWrapperKeyDown();
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it("when press arrow right key on the first page which contains all rows, handleChangePage should not run", () => {
      page = 0;
      totalRowCount = 40;
      rowsPerPage = 40;
      callHandleWrapperKeyDown();
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it("when press arrow left key on the first page, handleChangePage should not run", () => {
      evt.key = KeyCodes.LEFT;
      page = 0;
      totalRowCount = 40;
      rowsPerPage = 10;
      callHandleWrapperKeyDown();
      expect(handleChangePage).not.toHaveBeenCalled();
      expect(setShouldRefocus).not.toHaveBeenCalled();
    });

    it("when press arrow right key on the page whose next page contains rows, should change page", () => {
      totalRowCount = 40;
      page = 0;
      rowsPerPage = 10;
      callHandleWrapperKeyDown();
      expect(handleChangePage).toHaveBeenCalledTimes(1);
      expect(setShouldRefocus).toHaveBeenCalledTimes(1);
    });

    it("when press arrow left key not on the first page, should change page", () => {
      evt.key = KeyCodes.LEFT;
      totalRowCount = 40;
      page = 1;
      rowsPerPage = 40;
      callHandleWrapperKeyDown();
      expect(handleChangePage).toHaveBeenCalledTimes(1);
      expect(setShouldRefocus).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it("when press escape is pressed and keyboard.enabled is true, should call keyboard.blur", () => {
      evt = {
        key: KeyCodes.ESC,
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent;
      keyboard.enabled = true;
      callHandleWrapperKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(keyboard.blur).toHaveBeenCalledWith(true);
    });

    it("should run keyboard.blur when you are in selection mode, keyboard.enabled is true and pressing Esc key", () => {
      evt = {
        key: KeyCodes.ESC,
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent;
      keyboard.enabled = true;
      isSelectionMode = true;
      callHandleWrapperKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(0);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(0);
      expect(keyboard.blur).toHaveBeenCalledTimes(0);
    });

    it("should run preventDefaultBehavior when pressing arrow key but not shift + ctrl/cmd", () => {
      evt.key = KeyCodes.DOWN;
      callHandleWrapperKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(handleChangePage).toHaveBeenCalledTimes(0);
      expect(setShouldRefocus).toHaveBeenCalledTimes(0);
    });
  });

  describe("handleHeadKeyDown", () => {
    let rowIndex: number;
    let colIndex: number;
    let evt: React.KeyboardEvent;
    let rootElement: HTMLElement;
    let changeSortOrder: (column: Column) => Promise<void>;
    let isInteractionEnabled: boolean;
    let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
    let nextSibling: ChildNode | null | undefined;
    let isNewHeadCellMenuEnabled: boolean;
    let handleOpenMenu: () => void;

    const callHandleHeadKeyDown = () =>
      handleHeadKeyDown({
        evt,
        rootElement,
        cellCoord: [rowIndex, colIndex],
        isInteractionEnabled,
        setFocusedCellCoord,
        isNewHeadCellMenuEnabled,
        handleOpenMenu,
      });

    beforeEach(() => {
      rowIndex = 0;
      colIndex = 0;
      nextSibling = {} as ChildNode;
      evt = {
        key: KeyCodes.RIGHT,
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          blur: jest.fn(),
          setAttribute: jest.fn(),
          closest: () => ({
            nextSibling,
          }),
        } as unknown as HTMLElement,
      } as unknown as React.KeyboardEvent;
      rootElement = {} as unknown as HTMLElement;
      changeSortOrder = jest.fn();
      isInteractionEnabled = true;
      setFocusedCellCoord = jest.fn();
      isNewHeadCellMenuEnabled = false;
      handleOpenMenu = jest.fn();
      jest.spyOn(accessibilityUtils, "focusBodyFromHead").mockImplementation(() => {});
      jest.spyOn(accessibilityUtils, "moveFocusWithArrow").mockImplementation(() => ({}) as HTMLElement);
      jest.spyOn(accessibilityUtils, "updateFocus").mockImplementation(() => {});
      jest.spyOn(getElementUtils, "findCellWithTabStop").mockImplementation(() => ({}) as HTMLElement);
      jest.spyOn(keyboardUtils, "headTabHelper").mockImplementation(() => {});
    });

    it("should call moveFocusWithArrow and prevent default behavior on left arrow", () => {
      evt.key = KeyCodes.LEFT;
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
    });

    it("should call moveFocusWithArrow and prevent default behavior on right arrow", () => {
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
    });

    it("should call focusBodyFromHead and prevent default behavior on right arrow on last head cell", () => {
      nextSibling = null;
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.focusBodyFromHead).toHaveBeenCalledTimes(1);
    });

    it("should call updateFocus + moveFocusWithArrow and prevent default behavior on down arrow", () => {
      evt.key = KeyCodes.DOWN;
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
    });

    it("when pressing an invalid key, should call nothing", () => {
      evt.key = KeyCodes.UP;
      callHandleHeadKeyDown();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(changeSortOrder).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it("should only call preventDefaultBehavior when pressing a valid key and isInteractionEnabled is false", () => {
      evt.key = KeyCodes.SPACE;
      isInteractionEnabled = false;
      callHandleHeadKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(changeSortOrder).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it("should call copyCellValue on Head cell when the pressed keys are Ctrl and C keys", () => {
      evt.key = KeyCodes.C;
      evt.ctrlKey = true;
      callHandleHeadKeyDown();
      expect(handleCopy.default).toHaveBeenCalled();
    });

    it("should call copyCellValue on Head cell when the pressed keys are Meta and C keys", () => {
      evt.key = KeyCodes.C;
      evt.metaKey = true;
      callHandleHeadKeyDown();
      expect(handleCopy.default).toHaveBeenCalled();
    });

    it("should call headTabHelper when the pressed key is tab", () => {
      evt.key = KeyCodes.TAB;
      callHandleHeadKeyDown();
      expect(keyboardUtils.headTabHelper).toHaveBeenCalledTimes(1);
    });

    describe("when isNewHeadCellMenuEnabled flag is true:", () => {
      beforeEach(() => {
        isNewHeadCellMenuEnabled = true;
      });

      it("should call handleOpenMenu when the pressed key is enter", () => {
        evt.key = KeyCodes.ENTER;
        callHandleHeadKeyDown();
        expect(handleOpenMenu).toHaveBeenCalledTimes(1);
      });

      it("should not call handleTabHelper when the pressed key is tab", () => {
        evt.key = KeyCodes.TAB;
        callHandleHeadKeyDown();
        expect(keyboardUtils.headTabHelper).toHaveBeenCalledTimes(0);
      });

      it("should call handleOpenMenu when the pressed key is space", () => {
        evt.key = KeyCodes.SPACE;
        callHandleHeadKeyDown();
        expect(handleOpenMenu).toHaveBeenCalledTimes(1);
      });

      it("should reset focus on event target cell and call moveFocusWithArrow and passing focus type as FOCUS when key code is RIGHT or LEFT", () => {
        evt.key = KeyCodes.LEFT;
        callHandleHeadKeyDown();
        expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
        expect(accessibilityUtils.updateFocus).toHaveBeenCalledWith({
          focusType: FocusTypes.REMOVE_TAB,
          cell: evt.target,
        });
        expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledWith({
          evt,
          rootElement,
          cellCoord: [0, 0],
          setFocusedCellCoord,
          focusType: FocusTypes.FOCUS,
        });
      });
    });
  });

  describe("handleTotalKeyDown", () => {
    let evt: React.KeyboardEvent;
    let rootElement: HTMLElement;
    let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
    let cellCoord: [number, number];
    let isSelectionMode: boolean;

    beforeEach(() => {
      evt = {
        key: KeyCodes.DOWN,
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          blur: jest.fn(),
          setAttribute: jest.fn(),
        },
      } as unknown as React.KeyboardEvent;
      cellCoord = [1, 1];
      rootElement = {
        getElementsByClassName: () => [
          { getElementsByClassName: () => [{ focus: () => undefined, setAttribute: () => undefined }] },
        ],
      } as unknown as HTMLElement;
      setFocusedCellCoord = jest.fn();
      isSelectionMode = false;
      jest.spyOn(accessibilityUtils, "moveFocusWithArrow").mockImplementation(() => ({}) as HTMLElement);
      jest.spyOn(accessibilityUtils, "updateFocus").mockImplementation(() => {});
      jest.spyOn(keyboardUtils, "bodyTabHelper").mockImplementation(() => {});
    });

    it("should call moveFocusWithArrow and updateFocus when pressing arrow key", () => {
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord, isSelectionMode);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledWith({
        evt,
        rootElement,
        cellCoord,
        setFocusedCellCoord,
        focusType: FocusTypes.FOCUS,
      });
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
    });

    it("should call moveFocusWithArrow  when pressing left arrow key on first totals cell", () => {
      evt.key = KeyCodes.LEFT;
      cellCoord = [1, 0];

      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord, isSelectionMode);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledWith({
        evt,
        rootElement,
        cellCoord,
        setFocusedCellCoord,
        focusType: FocusTypes.FOCUS_BUTTON,
      });
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(0);
    });

    it("should only call preventDefaultBehavior when isSelectionMode is true", () => {
      isSelectionMode = true;
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord, false, isSelectionMode);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).not.toHaveBeenCalled();
    });

    it("should take the default case when the pressed key is not an arrow key", () => {
      evt.key = KeyCodes.ENTER;
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord, false, isSelectionMode);
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(accessibilityUtils.moveFocusWithArrow).not.toHaveBeenCalled();
    });

    it("should call copyCellValue on Total cell when the pressed keys are Ctrl and C keys", () => {
      evt.key = KeyCodes.C;
      evt.ctrlKey = true;
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord, false, isSelectionMode);
      expect(handleCopy.default).toHaveBeenCalled();
    });

    it("should call copyCellValue on Total cell when the pressed keys are Meta and C keys", async () => {
      evt.key = KeyCodes.C;
      evt.metaKey = true;
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord, false, isSelectionMode);
      expect(handleCopy.default).toHaveBeenCalled();
    });

    it("should call headTabHelper when the pressed key is tab", () => {
      evt.key = KeyCodes.TAB;
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord, false, isSelectionMode);
      expect(keyboardUtils.bodyTabHelper).toHaveBeenCalledTimes(1);
    });

    it("should call preventDefault when the pressed key is Space", () => {
      evt.key = KeyCodes.SPACE;
      handleTotalKeyDown(evt, rootElement, cellCoord, setFocusedCellCoord, false, isSelectionMode);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleBodyKeyDown", () => {
    let isModal: boolean;
    let isExcluded: boolean;
    let evt: React.KeyboardEvent;
    let rootElement: HTMLElement;
    let selectionsAPI: ExtendedSelectionAPI;
    let cell: Cell;
    let selectionDispatch: SelectionDispatch;
    let isSelectionsEnabled: boolean;
    let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
    let keyboard: stardust.Keyboard;
    let announce: Announce;
    let paginationNeeded: boolean;
    let totalsPosition: TotalsPosition;
    let isNewHeadCellMenuEnabled: boolean;

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
        isNewHeadCellMenuEnabled,
      });

    beforeEach(() => {
      isModal = false;
      isExcluded = false;
      evt = {
        key: KeyCodes.DOWN,
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          blur: jest.fn(),
          setAttribute: jest.fn(),
          classList: {
            contains: () => isExcluded,
          },
        },
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
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1, isSelectable: true, isLastRow: false, pageRowIdx: 1 } as Cell;
      keyboard = { enabled: true } as unknown as stardust.Keyboard;
      selectionDispatch = jest.fn();
      isSelectionsEnabled = true;
      setFocusedCellCoord = jest.fn();
      announce = jest.fn();
      paginationNeeded = true;
      totalsPosition = { atTop: false, atBottom: true };
      jest.spyOn(accessibilityUtils, "announceSelectionState").mockImplementation(() => {});
      jest.spyOn(handleScroll, "handleNavigateTop").mockImplementation(() => {});
      jest.spyOn(keyboardUtils, "bodyArrowHelper").mockImplementation(() => {});
      jest.spyOn(keyboardUtils, "bodyTabHelper").mockImplementation(() => {});
    });

    it("should call bodyArrowHelper when arrow key is pressed", () => {
      evt.key = KeyCodes.DOWN;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(keyboardUtils.bodyArrowHelper).toHaveBeenCalledTimes(1);
    });

    it("when press space bar key and dimension, should select value for dimension", () => {
      evt.key = KeyCodes.SPACE;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it("when press space bar key on a cell that is not selectable, should not select value", () => {
      evt.key = KeyCodes.SPACE;
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

    it("when press space bar key and selections are not enabled, should not select value", () => {
      evt.key = KeyCodes.SPACE;
      isSelectionsEnabled = false;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it("when press enter key, should confirms selections", () => {
      evt.key = KeyCodes.ENTER;
      isModal = true;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionsAPI.confirm).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).toHaveBeenCalledWith({ keys: ["SNTable.SelectionLabel.SelectionsConfirmed"] });
    });

    it("when press enter key and not in selections mode, should not confirms selections", () => {
      evt.key = KeyCodes.ENTER;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionsAPI.confirm).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it("when press esc key and in selections mode, should cancel selection", () => {
      evt.key = KeyCodes.ESC;
      isModal = true;
      runHandleBodyKeyDown();
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(selectionsAPI.cancel).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
      expect(announce).toHaveBeenCalledWith({ keys: ["SNTable.SelectionLabel.ExitedSelectionMode"] });
    });

    it("when tab is pressed, call bodyTabHelper", () => {
      evt.key = KeyCodes.TAB;
      runHandleBodyKeyDown();
      expect(keyboardUtils.bodyTabHelper).toHaveBeenCalledTimes(1);
    });

    it("should call copyCellValue when the pressed keys are Ctrl and C keys", () => {
      evt.key = KeyCodes.C;
      evt.ctrlKey = true;
      runHandleBodyKeyDown();
      expect(handleCopy.default).toHaveBeenCalled();
    });

    it("should call copyCellValue when the pressed keys are Meta and C keys", () => {
      evt.key = KeyCodes.C;
      evt.metaKey = true;
      runHandleBodyKeyDown();
      expect(handleCopy.default).toHaveBeenCalled();
    });

    it("when other keys are pressed, should call nothing", () => {
      evt.key = "A";
      runHandleBodyKeyDown();
      expect(evt.preventDefault).not.toHaveBeenCalled();
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect((evt.target as HTMLElement).blur).not.toHaveBeenCalled();
      expect((evt.target as HTMLElement).setAttribute).not.toHaveBeenCalled();
      expect(selectionsAPI.cancel).not.toHaveBeenCalled();
      expect(setFocusedCellCoord).not.toHaveBeenCalled();
    });

    it("when event is coming from excluded cell, should only prevent default behavior", () => {
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

  describe("handleBodyKeyUp", () => {
    let evt: React.KeyboardEvent;
    let selectionDispatch: SelectionDispatch;

    beforeEach(() => {
      evt = {
        key: KeyCodes.SHIFT,
      } as unknown as React.KeyboardEvent;
      selectionDispatch = jest.fn();
    });

    it("when the shift key is pressed, should run selectionDispatch", () => {
      handleBodyKeyUp(evt, selectionDispatch);

      expect(selectionDispatch).toHaveBeenCalledTimes(1);
    });

    it("when other keys are pressed, should not do anything", () => {
      evt.key = "Control";

      handleBodyKeyUp(evt, selectionDispatch);

      expect(selectionDispatch).not.toHaveBeenCalled();
    });
  });
});
