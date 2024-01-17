import { stardust } from "@nebula.js/stardust";
import { focusSelectionToolbar } from "@qlik/nebula-table-utils/lib/utils";
import { Announce, Cell, TotalsPosition } from "../../../types";
import { FocusTypes, KeyCodes } from "../../constants";
import { SelectionDispatch } from "../../types";
import * as accessibilityUtils from "../accessibility-utils";
import * as handleScroll from "../handle-scroll";
import { bodyArrowHelper, bodyTabHelper, getFocusType, headTabHelper, shouldBubbleEarly } from "../keyboard-utils";

jest.mock("@qlik/nebula-table-utils/lib/utils", () => ({
  focusSelectionToolbar: jest.fn(),
  preventDefaultBehavior: jest.fn(),
}));

describe("keyboard-utils", () => {
  let evt: React.KeyboardEvent;
  let rootElement: HTMLElement;
  let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;

  beforeEach(() => {
    evt = {
      key: KeyCodes.ESC,
      shiftKey: false,
      ctrlKey: false,
      metaKey: false, // cases when meta key is pressed instead of ctrl is not tested here, the test are granular enough anyway
      target: {} as HTMLElement,
      stopPropagation: () => {},
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;
    rootElement = {
      querySelectorAll: () => [{}, {}],
      getElementsByClassName: () => [
        { getElementsByClassName: () => [{ focus: () => undefined, setAttribute: () => undefined }] },
      ],
    } as unknown as HTMLElement;
    setFocusedCellCoord = jest.fn();
  });

  afterEach(() => jest.clearAllMocks());

  describe("getFocusType", () => {
    let cellCoord: [number, number];
    let isNewHeadCellMenuEnabled: boolean;

    beforeEach(() => {
      cellCoord = [0, 0];
      isNewHeadCellMenuEnabled = false;
    });

    it("should return FOCUS_BUTTON because keycode on event is up and there is more cell above", () => {
      cellCoord = [1, 0];
      evt.key = KeyCodes.UP;
      expect(getFocusType(cellCoord, evt, isNewHeadCellMenuEnabled)).toBe(FocusTypes.FOCUS_BUTTON);
    });

    it("should return FOCUS_BUTTON because keycode on event is left and there is more row above", () => {
      cellCoord = [1, 0];
      evt.key = KeyCodes.LEFT;
      expect(getFocusType(cellCoord, evt, isNewHeadCellMenuEnabled)).toBe(FocusTypes.FOCUS_BUTTON);
    });

    it("should return FOCUS because keycode on event is not up or left", () => {
      cellCoord = [1, 0];
      evt.key = KeyCodes.RIGHT;
      expect(getFocusType(cellCoord, evt, isNewHeadCellMenuEnabled)).toBe(FocusTypes.FOCUS);
    });

    describe("when isNewHeadCellMenuEnabled flag is true:", () => {
      beforeEach(() => {
        isNewHeadCellMenuEnabled = true;
      });

      it("should return FOCUS", () => {
        expect(getFocusType(cellCoord, evt, isNewHeadCellMenuEnabled)).toBe(FocusTypes.FOCUS);
      });
    });
  });

  describe("shouldBubbleEarly", () => {
    let isSelectionMode: boolean;

    const callShouldBubbleEarly = () => shouldBubbleEarly(evt, isSelectionMode);

    beforeEach(() => {
      isSelectionMode = false;
    });

    it("should return true when esc is pressed and isSelectionMode is false", () => {
      expect(callShouldBubbleEarly()).toBe(true);
    });

    it("should return false when esc is pressed and isSelectionMode is true", () => {
      isSelectionMode = true;
      expect(callShouldBubbleEarly()).toBe(false);
    });

    it("should return true when ctrl + shift + arrowRight is pressed", () => {
      evt.key = KeyCodes.RIGHT;
      evt.shiftKey = true;
      evt.ctrlKey = true;
      expect(callShouldBubbleEarly()).toBe(true);
    });

    it("should return true when ctrl + shift + arrowLeft is pressed", () => {
      evt.key = KeyCodes.LEFT;
      evt.shiftKey = true;
      evt.ctrlKey = true;
      expect(callShouldBubbleEarly()).toBe(true);
    });

    it("should return false when ctrl + shift + some other key is pressed", () => {
      evt.key = KeyCodes.UP;
      evt.shiftKey = true;
      evt.ctrlKey = true;
      expect(callShouldBubbleEarly()).toBe(false);
    });

    it("should return false when ctrl + arrowLeft but not shift", () => {
      evt.key = KeyCodes.LEFT;
      evt.ctrlKey = true;
      expect(callShouldBubbleEarly()).toBe(false);
    });

    it("should return false when shift + arrowLeft but not ctrl", () => {
      evt.key = KeyCodes.LEFT;
      evt.shiftKey = true;
      expect(callShouldBubbleEarly()).toBe(false);
    });
  });

  describe("BodyArrowHelper", () => {
    let cell: Cell;
    let selectionDispatch: SelectionDispatch;
    let isSelectionsEnabled: boolean;
    let announce: Announce;
    let totalsPosition: TotalsPosition;
    let isSelectionMode: boolean;
    let isNewHeadCellMenuEnabled: boolean;

    const runBodyArrowHelper = () =>
      bodyArrowHelper({
        evt,
        rootElement,
        cell,
        selectionDispatch,
        isSelectionsEnabled,
        setFocusedCellCoord,
        announce,
        totalsPosition,
        isSelectionMode,
        isNewHeadCellMenuEnabled,
      });

    beforeEach(() => {
      evt.key = KeyCodes.DOWN;
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1, isSelectable: true, isLastRow: false, pageRowIdx: 1 } as Cell;
      selectionDispatch = jest.fn();
      isSelectionsEnabled = true;
      announce = jest.fn();
      totalsPosition = { atTop: false, atBottom: true };
      isSelectionMode = false;
      jest.spyOn(accessibilityUtils, "announceSelectionState").mockImplementation(() => {});
      jest.spyOn(accessibilityUtils, "moveFocusWithArrow").mockImplementation(() => ({}) as HTMLElement);
      jest.spyOn(accessibilityUtils, "updateFocus").mockImplementation(() => {});
      jest.spyOn(handleScroll, "handleNavigateTop").mockImplementation(() => {});
    });

    it("should call updateFocus, moveFocusWithArrow and announceSelectionState on arrow down", () => {
      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(0);
    });

    it("should call updateFocus, moveFocusWithArrow, handleNavigateTop and announceSelectionState on arrow up", () => {
      evt.key = KeyCodes.UP;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(1);
    });

    it("should call updateFocus and moveFocusWithArrow on arrow left", () => {
      evt.key = KeyCodes.LEFT;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(0);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(0);
    });

    it("should call updateFocus and moveFocusWithArrow on arrow right", () => {
      evt.key = KeyCodes.RIGHT;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(0);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(0);
    });

    it("should call updateFocus, moveFocusWithArrow and selectionDispatch when press shift + arrow down key on body cell", () => {
      evt.shiftKey = true;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(0);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(0);
    });

    it("should call updateFocus, moveFocusWithArrow and announceSelectionState but not selectionDispatch when press shift + arrow down key on last body cell", () => {
      evt.shiftKey = true;
      cell.isLastRow = true;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(0);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(0);
    });

    it("should call updateFocus, moveFocusWithArrow and selectionDispatch when press shift + arrow up on body cell", () => {
      evt.key = KeyCodes.UP;
      evt.shiftKey = true;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(0);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(1);
    });

    it("should call moveFocusWithArrow and announceSelectionState but not selectionDispatch when press shift + arrow up key on first body cell", () => {
      evt.key = KeyCodes.UP;
      evt.shiftKey = true;
      cell.pageRowIdx = 0;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(0);
      expect(accessibilityUtils.moveFocusWithArrow).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(0);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(1);
    });
  });

  describe("bodyTabHelper", () => {
    let keyboard: stardust.Keyboard;
    let isSelectionMode: boolean;
    let paginationNeeded: boolean;

    const callBodyTabHelper = () =>
      bodyTabHelper({ evt, rootElement, setFocusedCellCoord, keyboard, isSelectionMode, paginationNeeded });

    beforeEach(() => {
      isSelectionMode = false;
      paginationNeeded = true;
    });

    it("should do nothing when no shift key and keyboard is undefined", () => {
      callBodyTabHelper();
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(0);
      expect(focusSelectionToolbar).toHaveBeenCalledTimes(0);
    });

    it("should do nothing when keyboard.enabled is true, shift key is not pressed and isSelectionMode is false", () => {
      keyboard = { enabled: true } as stardust.Keyboard;

      callBodyTabHelper();
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(0);
      expect(focusSelectionToolbar).toHaveBeenCalledTimes(0);
    });

    it("should call focusSelectionToolbar when shift key is pressed, keyboard.enabled is true and is in selection mode", () => {
      evt.shiftKey = true;
      keyboard = { enabled: true } as stardust.Keyboard;
      isSelectionMode = true;

      callBodyTabHelper();
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(0);
      expect(focusSelectionToolbar).toHaveBeenCalledTimes(1);
    });

    it("should call focusSelectionToolbar when shift key is not pressed, keyboard.enabled is true, is in selection mode and there is no pagination", () => {
      paginationNeeded = false;
      keyboard = { enabled: true } as stardust.Keyboard;
      isSelectionMode = true;

      callBodyTabHelper();
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(0);
      expect(focusSelectionToolbar).toHaveBeenCalledTimes(1);
    });

    it("should call setFocusedCellCoord when shift key is pressed and keyboard is undefined", () => {
      evt.shiftKey = true;

      callBodyTabHelper();
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(focusSelectionToolbar).toHaveBeenCalledTimes(0);
    });
  });

  describe("headTabHelper", () => {
    let containsLabelClass: boolean;
    let cellCoord: [number, number];
    let isLastHeadCell: boolean;

    const callHeadTabHelper = () => headTabHelper(evt, rootElement, cellCoord, setFocusedCellCoord, isLastHeadCell);

    beforeEach(() => {
      containsLabelClass = true;
      evt = {
        ...evt,
        target: {
          classList: { contains: () => containsLabelClass },
        },
      } as unknown as React.KeyboardEvent;
      cellCoord = [0, 2];
      jest.spyOn(accessibilityUtils, "focusBodyFromHead").mockImplementation(() => {});
    });

    it("should set focusedCellCoord to the prev column when pressing shift, isLabel is true and you are not on the first column", () => {
      evt.shiftKey = true;

      callHeadTabHelper();
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([0, 1]);
      expect(accessibilityUtils.focusBodyFromHead).toHaveBeenCalledTimes(0);
    });

    it("should not set focusedCellCoord when pressing shift, isLabel is true but you are on the first column", () => {
      evt.shiftKey = true;
      cellCoord = [0, 0];

      callHeadTabHelper();
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(0);
      expect(accessibilityUtils.focusBodyFromHead).toHaveBeenCalledTimes(0);
    });

    it("should set focusedCellCoord to the next column when not pressing shift, isLabel is false and you are not on the last column", () => {
      containsLabelClass = false;

      callHeadTabHelper();
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([0, 3]);
      expect(accessibilityUtils.focusBodyFromHead).toHaveBeenCalledTimes(0);
    });

    it("should call focusBodyFromHead when not pressing shift, isLabel is false and you are not on the last column", () => {
      containsLabelClass = false;
      isLastHeadCell = true;

      callHeadTabHelper();
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(0);
      expect(accessibilityUtils.focusBodyFromHead).toHaveBeenCalledTimes(1);
    });
  });
});
