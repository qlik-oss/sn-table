import { stardust } from '@nebula.js/stardust';
import React from 'react';
import { Announce, TotalsPosition } from '../../../types';
import { FocusTypes } from '../../constants';
import * as accessibilityUtils from '../accessibility-utils';

describe('handle-accessibility', () => {
  let cell: HTMLTableCellElement | undefined;
  let keyboard: stardust.Keyboard;
  let rootElement: HTMLElement;
  let focusedCellCoord: [number, number];
  let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;

  beforeEach(() => {
    cell = { focus: jest.fn(), blur: jest.fn(), setAttribute: jest.fn() } as unknown as HTMLTableCellElement;
    rootElement = {
      getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }],
      querySelector: () => cell,
    } as unknown as HTMLDivElement;
    focusedCellCoord = [0, 0];
    setFocusedCellCoord = jest.fn();
    keyboard = {
      blur: jest.fn(),
      focus: jest.fn(),
      focusSelection: jest.fn(),
      enabled: true,
      active: false,
    } as unknown as stardust.Keyboard;
  });

  afterEach(() => jest.clearAllMocks());

  describe('updateFocus', () => {
    let focusType: FocusTypes;
    beforeEach(() => {
      focusType = FocusTypes.FOCUS;
    });

    it('should focus cell and call setAttribute when focusType is focus', () => {
      accessibilityUtils.updateFocus({ focusType, cell });
      expect(cell?.focus).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '0');
    });

    it('should blur cell and call setAttribute when focusType is blur', () => {
      focusType = FocusTypes.BLUR;

      accessibilityUtils.updateFocus({ focusType, cell });
      expect(cell?.blur).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
    });

    it('should call setAttribute when focusType is addTab', () => {
      focusType = FocusTypes.ADD_TAB;

      accessibilityUtils.updateFocus({ focusType, cell });
      expect(cell?.focus).not.toHaveBeenCalled();
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '0');
    });

    it('should call setAttribute when focusType is removeTab', () => {
      focusType = FocusTypes.REMOVE_TAB;

      accessibilityUtils.updateFocus({ focusType, cell });
      expect(cell?.blur).not.toHaveBeenCalled();
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
    });

    it('should early return and not throw error when cell is undefined', () => {
      cell = undefined;
      expect(() => accessibilityUtils.updateFocus({ focusType, cell })).not.toThrow();
    });
  });

  describe('resetFocus', () => {
    let shouldRefocus: React.MutableRefObject<boolean>;
    let isSelectionMode: boolean;
    let announce: Announce;
    let totalsPosition: TotalsPosition;

    const resetFocus = () =>
      accessibilityUtils.resetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        isSelectionMode,
        setFocusedCellCoord,
        keyboard,
        announce,
        totalsPosition,
      });

    beforeEach(() => {
      focusedCellCoord = [2, 1];
      shouldRefocus = { current: false };
      isSelectionMode = false;
      keyboard.enabled = true;
      keyboard.active = true;
      totalsPosition = { atTop: false, atBottom: true };
      announce = jest.fn();
    });

    it('should only remove tabIndex when keyboard.enabled is true and keyboard.active is false', () => {
      keyboard.enabled = true;
      keyboard.active = false;

      resetFocus();
      expect(cell?.setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([0, 0]);
      expect(cell?.focus).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('should set tabindex on the first cell and not focus', () => {
      resetFocus();
      expect(cell?.setAttribute).toHaveBeenCalledTimes(2);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([0, 0]);
      expect(cell?.focus).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('should set tabindex on the first cell and focus when shouldRefocus is true', () => {
      shouldRefocus.current = true;

      resetFocus();
      expect(cell?.setAttribute).toHaveBeenCalledTimes(2);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([0, 0]);
      expect(cell?.focus).toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('should set tabindex on the second cell in currently focused column when isSelectionMode is true', () => {
      isSelectionMode = true;
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      } as unknown as HTMLElement;

      resetFocus();
      expect(cell?.setAttribute).toHaveBeenCalledTimes(2);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([1, 1]);
      expect(cell?.focus).not.toHaveBeenCalled();
    });

    it('should set focus on the first body cell when isSelectionMode is true and totals is on top', () => {
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row, row],
        querySelector: () => cell,
      } as unknown as HTMLElement;
      isSelectionMode = true;
      focusedCellCoord = [5, 0];
      totalsPosition = { atTop: true, atBottom: false };

      resetFocus();
      expect(setFocusedCellCoord).toHaveBeenCalledWith([2, 0]);
    });

    it('should announce cell content and selection status for non selected first cell after focusing on it', () => {
      cell = { ...cell, textContent: '#something' } as HTMLTableCellElement;
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      } as unknown as HTMLElement;
      isSelectionMode = true;

      resetFocus();
      expect(announce).toHaveBeenCalledWith({
        keys: ['#something,', 'SNTable.SelectionLabel.NotSelectedValue'],
      });
    });

    it('should announce cell content and selection status for selected first cell after focusing on it', () => {
      const tmpCell = global.document.createElement('td');
      tmpCell?.classList.add('selected');

      cell = { ...cell, classList: tmpCell?.classList, textContent: '#something' } as HTMLTableCellElement;
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      } as unknown as HTMLElement;
      isSelectionMode = true;

      resetFocus();
      expect(announce).toHaveBeenCalledWith({
        keys: ['#something,', 'SNTable.SelectionLabel.SelectedValue'],
      });
    });
  });

  describe('handleFocusoutEvent', () => {
    let containsRelatedTarget: boolean;
    let focusoutEvent: FocusEvent;
    let shouldRefocus: React.MutableRefObject<boolean>;
    let announcement1: {
      innerHTML: string;
    };
    let announcement2: {
      innerHTML: string;
    };

    beforeEach(() => {
      containsRelatedTarget = false;
      announcement1 = { innerHTML: 'firstAnnouncement' };
      announcement2 = { innerHTML: 'secondAnnouncement' };
      focusoutEvent = {
        currentTarget: {
          contains: () => containsRelatedTarget,
          querySelector: (identifier: string) => (identifier.slice(-1) === '1' ? announcement1 : announcement2),
        },
      } as unknown as FocusEvent;
      shouldRefocus = { current: false };
      keyboard = { blur: jest.fn(), focus: jest.fn(), focusSelection: jest.fn(), enabled: true, active: false };
    });

    it('should call blur and remove announcements when currentTarget does not contain relatedTarget, shouldRefocus is false and keyboard.enabled is true', () => {
      accessibilityUtils.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).toHaveBeenCalledWith(false);
      expect(announcement1.innerHTML).toBe('');
      expect(announcement2.innerHTML).toBe('');
    });

    it('should not call blur when currentTarget contains relatedTarget', () => {
      containsRelatedTarget = true;

      accessibilityUtils.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });

    it('should not call blur when shouldRefocus is true', () => {
      shouldRefocus.current = true;

      accessibilityUtils.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });

    it('should not call blur when keyboard.enabled is false', () => {
      keyboard.enabled = false;

      accessibilityUtils.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });
  });

  describe('focusSelectionToolbar', () => {
    let element: HTMLElement;
    let parentElement: HTMLElement | null;
    let last: boolean;

    beforeEach(() => {
      parentElement = { focus: jest.fn() } as unknown as HTMLElement;
      element = {
        closest: () => ({ querySelector: () => ({ parentElement }) }),
      } as unknown as HTMLElement;
      last = false;
    });

    it('should call parentElement.focus when clientConfirmButton exists', () => {
      accessibilityUtils.focusSelectionToolbar(element, keyboard, last);
      expect(parentElement?.focus).toHaveBeenCalledTimes(1);
      expect(keyboard.focusSelection).not.toHaveBeenCalled();
    });

    it("should call keyboard.focusSelection when clientConfirmButton doesn't exist", () => {
      parentElement = null;
      accessibilityUtils.focusSelectionToolbar(element, keyboard, last);
      expect(keyboard.focusSelection).toHaveBeenCalledWith(false);
    });
  });

  describe('announceSelectionState', () => {
    let isSelected: boolean;
    let announce: Announce;
    let nextCell: HTMLTableCellElement;
    let isSelectionMode: boolean;

    beforeEach(() => {
      isSelected = false;
      announce = jest.fn() as Announce;
      nextCell = {
        classList: {
          contains: () => isSelected,
        },
      } as unknown as HTMLTableCellElement;
      isSelectionMode = false;
    });

    it('should do nothing when not in selection mode', () => {
      accessibilityUtils.announceSelectionState(announce, nextCell, isSelectionMode);
      expect(announce).not.toHaveBeenCalled();
    });

    it('should call announce with SelectedValue key when in selection mode and value is selected', () => {
      isSelectionMode = true;
      isSelected = true;
      accessibilityUtils.announceSelectionState(announce, nextCell, isSelectionMode);
      expect(announce).toHaveBeenCalledWith({ keys: ['SNTable.SelectionLabel.SelectedValue'] });
    });

    it('should Call announce with NotSelectedValue key when in selection mode and value is not selected', () => {
      isSelectionMode = true;
      accessibilityUtils.announceSelectionState(announce, nextCell, isSelectionMode);
      expect(announce).toHaveBeenCalledWith({ keys: ['SNTable.SelectionLabel.NotSelectedValue'] });
    });
  });

  describe('removeTabAndFocusCell', () => {
    const newCoord: [number, number] = [1, 1];

    it('should call setFocusedCellCoord but not keyboard.focus when keyboard.enabled is false', () => {
      keyboard.enabled = false;
      accessibilityUtils.removeTabAndFocusCell(newCoord, rootElement, setFocusedCellCoord, keyboard);
      expect(setFocusedCellCoord).toHaveBeenCalledWith(newCoord);
      expect(keyboard.focus).not.toHaveBeenCalled();
    });

    it('should call update setFocusedCellCoord but not keyboard.focus when keyboard.enabled is true and active is true', () => {
      keyboard.active = true;
      accessibilityUtils.removeTabAndFocusCell(newCoord, rootElement, setFocusedCellCoord, keyboard);
      expect(setFocusedCellCoord).toHaveBeenCalledWith(newCoord);
      expect(keyboard.focus).not.toHaveBeenCalled();
    });

    it('should call update setFocusedCellCoord and keyboard.focus when keyboard.enabled is true and active is false', () => {
      accessibilityUtils.removeTabAndFocusCell(newCoord, rootElement, setFocusedCellCoord, keyboard);
      expect(setFocusedCellCoord).toHaveBeenCalledWith(newCoord);
      expect(keyboard.focus).toHaveBeenCalledTimes(1);
    });
  });
});
