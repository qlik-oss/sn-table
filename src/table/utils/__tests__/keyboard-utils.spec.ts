import * as accessibilityUtils from '../accessibility-utils';
import * as handleScroll from '../handle-scroll';
import { KeyCodes } from '../../constants';
import { shouldBubble, bodyArrowHelper } from '../keyboard-utils';
import { Announce, Cell, TotalsPosition } from '../../../types';
import { SelectionDispatch } from '../../types';

describe('keyboard-utils', () => {
  describe('shouldBubble', () => {
    let evt: React.KeyboardEvent;
    let isSelectionMode: boolean;
    let keyboardEnabled: boolean;
    let paginationNeeded: boolean;

    const callShouldBubble = () => shouldBubble(evt, isSelectionMode, keyboardEnabled, paginationNeeded);

    beforeEach(() => {
      evt = {
        key: KeyCodes.ESC,
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
      evt.key = KeyCodes.TAB;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return true when tab is pressed, paginationNeeded is false and keyboardEnabled is false but isSelectionMode is true', () => {
      evt.key = KeyCodes.TAB;
      paginationNeeded = false;
      isSelectionMode = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return true when tab is pressed, paginationNeeded is false and isSelectionMode is false but keyboardEnabled is true', () => {
      evt.key = KeyCodes.TAB;
      paginationNeeded = false;
      keyboardEnabled = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return false when tab is pressed, paginationNeeded is false and keyboardEnabled && isSelectionMode is true', () => {
      evt.key = KeyCodes.TAB;
      paginationNeeded = false;
      keyboardEnabled = true;
      isSelectionMode = true;
      expect(callShouldBubble()).toBe(false);
    });

    it('should return true when shift + tab is pressed and keyboardEnabled is false but isSelectionMode is true', () => {
      evt.key = KeyCodes.TAB;
      evt.shiftKey = true;
      isSelectionMode = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return true when shift + tab is pressed and isSelectionMode is false but keyboardEnabled is true', () => {
      evt.key = KeyCodes.TAB;
      evt.shiftKey = true;
      keyboardEnabled = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return false when shift + tab is pressed and keyboardEnabled && isSelectionMode is true', () => {
      evt.key = KeyCodes.TAB;
      evt.shiftKey = true;
      keyboardEnabled = true;
      isSelectionMode = true;
      expect(callShouldBubble()).toBe(false);
    });

    it('should return true when ctrl + shift + arrowRight is pressed', () => {
      evt.key = KeyCodes.RIGHT;
      evt.shiftKey = true;
      evt.ctrlKey = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return true when ctrl + shift + arrowLeft is pressed', () => {
      evt.key = KeyCodes.LEFT;
      evt.shiftKey = true;
      evt.ctrlKey = true;
      expect(callShouldBubble()).toBe(true);
    });

    it('should return false when ctrl + shift + some other key is pressed', () => {
      evt.key = KeyCodes.UP;
      evt.shiftKey = true;
      evt.ctrlKey = true;
      expect(callShouldBubble()).toBe(false);
    });

    it('should return false when ctrl + arrowLeft but not shift', () => {
      evt.key = KeyCodes.LEFT;
      evt.ctrlKey = true;
      expect(callShouldBubble()).toBe(false);
    });

    it('should return false when shift + arrowLeft but not ctrl', () => {
      evt.key = KeyCodes.LEFT;
      evt.shiftKey = true;
      expect(callShouldBubble()).toBe(false);
    });
  });

  describe('BodyArrowHelper', () => {
    let evt: React.KeyboardEvent;
    let rootElement: HTMLElement;
    let cell: Cell;
    let selectionDispatch: SelectionDispatch;
    let isSelectionsEnabled: boolean;
    let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
    let announce: Announce;
    let totalsPosition: TotalsPosition;
    let isSelectionMode: boolean;
    let areBasicFeaturesEnabled: boolean;

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
        areBasicFeaturesEnabled,
      });

    beforeEach(() => {
      evt = {
        key: KeyCodes.DOWN,
      } as unknown as React.KeyboardEvent;
      rootElement = {
        getElementsByClassName: () => [
          { getElementsByClassName: () => [{ focus: () => undefined, setAttribute: () => undefined }] },
        ],
      } as unknown as HTMLElement;
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1, isSelectable: true, isLastRow: false, pageRowIdx: 1 } as Cell;
      selectionDispatch = jest.fn();
      isSelectionsEnabled = true;
      setFocusedCellCoord = jest.fn();
      announce = jest.fn();
      totalsPosition = { atTop: false, atBottom: true };
      isSelectionMode = false;
      areBasicFeaturesEnabled = true;
      jest.spyOn(accessibilityUtils, 'focusSelectionToolbar').mockImplementation(() => {});
      jest.spyOn(accessibilityUtils, 'announceSelectionState').mockImplementation(() => {});
      jest.spyOn(accessibilityUtils, 'moveFocus').mockImplementation(() => ({} as HTMLTableCellElement));
      jest.spyOn(accessibilityUtils, 'updateFocus').mockImplementation(() => {});
      jest.spyOn(handleScroll, 'handleNavigateTop').mockImplementation(() => {});
    });

    afterEach(() => jest.clearAllMocks());

    it('should call updateFocus, moveFocus and announceSelectionState on arrow down', () => {
      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(0);
    });

    it('should call updateFocus, moveFocus, handleNavigateTop and announceSelectionState on arrow up', () => {
      evt.key = KeyCodes.UP;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(1);
    });

    it('should call updateFocus and moveFocus on arrow left', () => {
      evt.key = KeyCodes.LEFT;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(0);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(0);
    });

    it('should call updateFocus and moveFocus on arrow right', () => {
      evt.key = KeyCodes.RIGHT;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(0);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(0);
    });

    it('should call updateFocus, moveFocus and selectionDispatch when press shift + arrow down key on body cell', () => {
      evt.shiftKey = true;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocus).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(0);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(0);
    });

    it('should call updateFocus, moveFocus and announceSelectionState but not selectionDispatch when press shift + arrow down key on last body cell', () => {
      evt.shiftKey = true;
      cell.isLastRow = true;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocus).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(0);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(0);
    });

    it('should call updateFocus, moveFocus and selectionDispatch when press shift + arrow up on body cell', () => {
      evt.key = KeyCodes.UP;
      evt.shiftKey = true;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.moveFocus).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(0);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(1);
    });

    it('should call moveFocus and announceSelectionState but not selectionDispatch when press shift + arrow up key on first body cell', () => {
      evt.key = KeyCodes.UP;
      evt.shiftKey = true;
      cell.pageRowIdx = 0;

      runBodyArrowHelper();
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(0);
      expect(accessibilityUtils.moveFocus).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).toHaveBeenCalledTimes(0);
      expect(accessibilityUtils.announceSelectionState).toHaveBeenCalledTimes(1);
      expect(handleScroll.handleNavigateTop).toHaveBeenCalledTimes(1);
    });
  });
});
