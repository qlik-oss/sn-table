import React, { BaseSyntheticEvent } from 'react';
import { stardust } from '@nebula.js/stardust';
import { AnnounceFn, TotalsPosition, TableCell } from '../../../types';
import * as handleAccessibility from '../handle-accessibility';

describe('handle-accessibility', () => {
  let cell: HTMLTableCellElement | undefined;
  let keyboard: stardust.Keyboard;
  let rootElement: HTMLElement;
  let focusedCellCoord: [number, number];
  let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  let evt: BaseSyntheticEvent;

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
    let focusType: string;
    beforeEach(() => {
      focusType = 'focus';
    });

    it('should focus cell and call setAttribute when focusType is focus', () => {
      handleAccessibility.updateFocus({ focusType, cell });
      expect(cell?.focus).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '0');
    });

    it('should blur cell and call setAttribute when focusType is blur', () => {
      focusType = 'blur';

      handleAccessibility.updateFocus({ focusType, cell });
      expect(cell?.blur).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
    });

    it('should call setAttribute when focusType is addTab', () => {
      focusType = 'addTab';

      handleAccessibility.updateFocus({ focusType, cell });
      expect(cell?.focus).not.toHaveBeenCalled();
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '0');
    });

    it('should call setAttribute when focusType is removeTab', () => {
      focusType = 'removeTab';

      handleAccessibility.updateFocus({ focusType, cell });
      expect(cell?.blur).not.toHaveBeenCalled();
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
    });

    it('should early return and not throw error when cell is undefined', () => {
      cell = undefined;
      expect(() => handleAccessibility.updateFocus({ focusType, cell })).not.toThrow();
    });
  });

  describe('findCellWithTabStop', () => {
    const elementCreator = (type: string, tabIdx: string) => {
      const targetElement = global.document.createElement(type);
      targetElement.setAttribute('tabIndex', tabIdx);
      return targetElement;
    };

    beforeEach(() => {
      rootElement = {
        querySelector: () => {
          if ((cell?.tagName === 'TD' || cell?.tagName === 'TH') && cell?.getAttribute('tabIndex') === '0') return cell;
          return null;
        },
      } as unknown as HTMLDivElement;
    });

    it('should return active td element', () => {
      cell = elementCreator('td', '0') as HTMLTableCellElement;

      const cellElement = handleAccessibility.findCellWithTabStop(rootElement);

      expect(cellElement).not.toBeNull();
      expect(cellElement.tagName).toBe('TD');
      expect(cellElement.getAttribute('tabIndex')).toBe('0');
    });

    it('should return active th element', () => {
      cell = elementCreator('th', '0') as HTMLTableCellElement;
      const cellElement = handleAccessibility.findCellWithTabStop(rootElement);

      expect(cellElement).not.toBeNull();
      expect(cellElement.tagName).toBe('TH');
      expect(cellElement.getAttribute('tabIndex')).toBe('0');
    });

    it('should return null', () => {
      const tmpCell = elementCreator('div', '-1') as HTMLDivElement;
      const cellElement = handleAccessibility.findCellWithTabStop(rootElement);
      expect(cellElement).toBeNull();
    });
  });

  describe('handleClickToFocusBody', () => {
    let totalsPosition: TotalsPosition;
    const cellData = {
      rawRowIdx: 0,
      rawColIdx: 0,
    } as TableCell;

    beforeEach(() => {
      totalsPosition = 'noTotals';
    });

    it('should indirectly call setFocusedCellCoord with adjusted index, and keyboard.focus', () => {
      handleAccessibility.handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard, totalsPosition);
      expect(cell?.setAttribute).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([1, 0]);
      expect(keyboard.focus).toHaveBeenCalledTimes(1);
    });

    it('should indirectly call setFocusedCellCoord with adjusted index, but not keyboard.focus when keyboard.enabled is falsey', () => {
      keyboard.enabled = false;

      handleAccessibility.handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard, totalsPosition);
      expect(cell?.setAttribute).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([1, 0]);
      expect(keyboard.focus).not.toHaveBeenCalled();
    });

    it('should indirectly call setFocusedCellCoord with index adjusted for totals on top, and keyboard.focus', () => {
      totalsPosition = 'top';

      handleAccessibility.handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard, totalsPosition);
      expect(cell?.setAttribute).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([2, 0]);
      expect(keyboard.focus).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleClickToFocusHead', () => {
    const columnIndex = 2;

    it('should indirectly call updateFocus, setFocusedCellCoord and keyboard.focus', () => {
      handleAccessibility.handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard);
      expect(cell?.setAttribute).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([0, 2]);
      expect(keyboard.focus).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleMouseDownLabelToFocusHeadCell', () => {
    evt = { preventDefault: jest.fn() } as unknown as BaseSyntheticEvent;
    const columnIndex = 0;

    it('should indirectly call updateFocus, setFocusedCellCoord and keyboard.focus', () => {
      handleAccessibility.handleMouseDownLabelToFocusHeadCell(evt, rootElement, columnIndex);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
      expect(cell?.focus).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledWith('tabIndex', '0');
    });
  });

  describe('handleResetFocus', () => {
    let shouldRefocus: React.MutableRefObject<boolean>;
    let isSelectionMode: boolean;
    let announce: AnnounceFn;

    const resetFocus = () =>
      handleAccessibility.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        isSelectionMode,
        setFocusedCellCoord,
        keyboard,
        announce,
      });

    beforeEach(() => {
      focusedCellCoord = [2, 1];
      shouldRefocus = { current: false };
      isSelectionMode = false;
      keyboard.enabled = true;
      keyboard.active = true;
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
      } as unknown as HTMLDivElement;

      resetFocus();
      expect(cell?.setAttribute).toHaveBeenCalledTimes(2);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([1, 1]);
      expect(cell?.focus).not.toHaveBeenCalled();
    });

    it('should announce cell content and selection status for non selected first cell after focusing on it', () => {
      cell = { ...cell, textContent: '#something' } as HTMLTableCellElement;
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      } as unknown as HTMLDivElement;
      isSelectionMode = true;

      resetFocus();
      expect(announce).toHaveBeenCalledWith({
        keys: ['#something,', 'SNTable.SelectionLabel.NotSelectedValue'],
      });
    });

    it('should announce cell content and selection status for selected first cell after focusing on it', () => {
      const tmpCell = global.document.createElement('td') as HTMLDivElement;
      tmpCell?.classList.add('selected');

      cell = { ...cell, classList: tmpCell?.classList, textContent: '#something' } as HTMLTableCellElement;
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      } as unknown as HTMLDivElement;
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
      handleAccessibility.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).toHaveBeenCalledWith(false);
      expect(announcement1.innerHTML).toBe('');
      expect(announcement2.innerHTML).toBe('');
    });

    it('should not call blur when currentTarget contains relatedTarget', () => {
      containsRelatedTarget = true;

      handleAccessibility.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });

    it('should not call blur when shouldRefocus is true', () => {
      shouldRefocus.current = true;

      handleAccessibility.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });

    it('should not call blur when keyboard.enabled is falsy', () => {
      keyboard.enabled = false;

      handleAccessibility.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
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
      handleAccessibility.focusSelectionToolbar(element, keyboard, last);
      expect(parentElement?.focus).toHaveBeenCalledTimes(1);
      expect(keyboard.focusSelection).not.toHaveBeenCalled();
    });

    it("should call keyboard.focusSelection when clientConfirmButton doesn't exist", () => {
      parentElement = null;
      handleAccessibility.focusSelectionToolbar(element, keyboard, last);
      expect(keyboard.focusSelection).toHaveBeenCalledWith(false);
    });
  });

  describe('announceSelectionState', () => {
    let isSelected: boolean;
    let announce: AnnounceFn;
    let nextCell: HTMLTableCellElement;
    let isSelectionMode: boolean;

    beforeEach(() => {
      isSelected = false;
      announce = jest.fn() as AnnounceFn;
      nextCell = {
        classList: {
          contains: () => isSelected,
        },
      } as unknown as HTMLTableCellElement;
      isSelectionMode = false;
    });

    it('should do nothing when not in selection mode', () => {
      handleAccessibility.announceSelectionState(announce, nextCell, isSelectionMode);
      expect(announce).not.toHaveBeenCalled();
    });

    it('should call announce with SelectedValue key when in selection mode and value is selected', () => {
      isSelectionMode = true;
      isSelected = true;
      handleAccessibility.announceSelectionState(announce, nextCell, isSelectionMode);
      expect(announce).toHaveBeenCalledWith({ keys: ['SNTable.SelectionLabel.SelectedValue'] });
    });

    it('should Call announce with NotSelectedValue key when in selection mode and value is not selected', () => {
      isSelectionMode = true;
      handleAccessibility.announceSelectionState(announce, nextCell, isSelectionMode);
      expect(announce).toHaveBeenCalledWith({ keys: ['SNTable.SelectionLabel.NotSelectedValue'] });
    });
  });
});
