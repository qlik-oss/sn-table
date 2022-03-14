import * as handleAccessibility from '../handle-accessibility';

describe('handle-accessibility', () => {
  let cell;
  let rootElement;
  let focusedCellCoord;
  let setFocusedCellCoord;
  let keyboard;

  beforeEach(() => {
    cell = { focus: jest.fn(), blur: jest.fn(), setAttribute: jest.fn() };
    rootElement = {
      getElementsByClassName: () => [{ getElementsByClassName: () => [cell] }],
      querySelector: () => cell,
    };
    focusedCellCoord = [0, 0];
    setFocusedCellCoord = jest.fn();
    keyboard = { focus: jest.fn(), focusSelection: jest.fn(), enabled: true };
  });

  afterEach(() => jest.clearAllMocks());

  describe('updateFocus', () => {
    let focusType;
    let rowElements;
    let cellCoord;
    let providedCell;

    beforeEach(() => {
      focusType = 'focus';
      rowElements = [{ getElementsByClassName: () => [cell] }];
      cellCoord = [0, 0];
    });

    it('should focus cell and call setAttribute when focusType is focus', () => {
      handleAccessibility.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.focus).toHaveBeenCalledTimes(1);
      expect(cell.setAttribute).toHaveBeenCalledWith('tabIndex', '0');
    });

    it('should blur cell and call setAttribute when focusType is blur', () => {
      focusType = 'blur';

      handleAccessibility.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.blur).toHaveBeenCalledTimes(1);
      expect(cell.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
    });

    it('should call setAttribute when focusType is addTab', () => {
      focusType = 'addTab';

      handleAccessibility.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.focus).not.toHaveBeenCalled();
      expect(cell.setAttribute).toHaveBeenCalledWith('tabIndex', '0');
    });

    it('should call setAttribute when focusType is removeTab', () => {
      focusType = 'removeTab';

      handleAccessibility.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.blur).not.toHaveBeenCalled();
      expect(cell.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
    });

    it('should not focus cell nor cell setAttribute when cell is not found', () => {
      cellCoord = [1, 0];

      handleAccessibility.updateFocus({ focusType, rowElements, cellCoord });
      expect(cell.focus).not.toHaveBeenCalled();
      expect(cell.blur).not.toHaveBeenCalled();
      expect(cell.setAttribute).not.toHaveBeenCalled();
    });

    it('should pick up providedCell element if there was no rowElements provided', () => {
      providedCell = cell;

      handleAccessibility.updateFocus({ focusType, providedCell });
      expect(cell.focus).toHaveBeenCalledTimes(1);
      expect(cell.setAttribute).toHaveBeenCalledWith('tabIndex', '0');
    });
  });

  describe('findCellWithTabStop', () => {
    const elementCreator = (type, tabIdx) => {
      const targetElement = global.document.createElement(type);
      targetElement.setAttribute('tabIndex', tabIdx);
      return targetElement;
    };

    beforeEach(() => {
      rootElement = {
        querySelector: () => {
          if ((cell.tagName === 'TD' || cell.tagName === 'TH') && cell.getAttribute('tabIndex') === '0') return cell;
          return null;
        },
      };
    });

    it('should return active td element', () => {
      cell = elementCreator('td', '0');

      const cellElement = handleAccessibility.findCellWithTabStop(rootElement);

      expect(cellElement).not.toBeNull();
      expect(cellElement.tagName).toBe('TD');
      expect(cellElement.getAttribute('tabIndex')).toBe('0');
    });

    it('should return active th element', () => {
      cell = elementCreator('th', '0');
      const cellElement = handleAccessibility.findCellWithTabStop(rootElement);

      expect(cellElement).not.toBeNull();
      expect(cellElement.tagName).toBe('TH');
      expect(cellElement.getAttribute('tabIndex')).toBe('0');
    });

    it('should return null', () => {
      cell = elementCreator('div', '-1');

      const cellElement = handleAccessibility.findCellWithTabStop(rootElement);

      expect(cellElement).toBeNull();
    });
  });

  describe('handleClickToFocusBody', () => {
    const cellData = {
      rawRowIdx: 0,
      rawColIdx: 0,
    };

    it('should indirectly call setFocusedCellCoord with adjusted index, and keyboard.focus', () => {
      handleAccessibility.handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard);
      expect(cell.setAttribute).toHaveBeenCalledTimes(1);
      expect(cell.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([1, 0]);
      expect(keyboard.focus).toHaveBeenCalledTimes(1);
    });
    it('should indirectly call setFocusedCellCoord with adjusted index, but not keyboard.focus when keyboard.enabled is falsey', () => {
      keyboard.enabled = false;
      handleAccessibility.handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard);
      expect(cell.setAttribute).toHaveBeenCalledTimes(1);
      expect(cell.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
      expect(setFocusedCellCoord).toHaveBeenCalledWith([1, 0]);
      expect(keyboard.focus).not.toHaveBeenCalled();
    });
  });

  describe('handleClickToFocusHead', () => {
    const columnIndex = 2;

    it('should indirectly call updateFocus, setFocusedCellCoord and keyboard.focus', () => {
      handleAccessibility.handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard);
      expect(cell.setAttribute).toHaveBeenCalledTimes(1);
      expect(cell.setAttribute).toHaveBeenCalledWith('tabIndex', '-1');
      expect(setFocusedCellCoord).toHaveBeenCalledWith([0, 2]);
      expect(keyboard.focus).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleResetFocus', () => {
    let shouldRefocus;
    let hasSelections;
    let shouldAddTabstop;
    let announce;

    beforeEach(() => {
      focusedCellCoord = [2, 1];
      shouldRefocus = { current: false };
      hasSelections = false;
      shouldAddTabstop = true;
      announce = jest.fn();
    });

    it('should set tabindex on the first cell and not focus', () => {
      handleAccessibility.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        hasSelections,
        setFocusedCellCoord,
        shouldAddTabstop,
        announce,
      });
      expect(cell.setAttribute).toHaveBeenCalledTimes(2);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([0, 0]);
      expect(cell.focus).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('should set tabindex on the first cell and focus when shouldRefocus is true', () => {
      shouldRefocus.current = true;

      handleAccessibility.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        hasSelections,
        setFocusedCellCoord,
        shouldAddTabstop,
        announce,
      });
      expect(cell.setAttribute).toHaveBeenCalledTimes(2);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([0, 0]);
      expect(cell.focus).toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it('should set tabindex on the second cell in currently focused column when hasSelections is true', () => {
      hasSelections = true;
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      };

      handleAccessibility.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        hasSelections,
        setFocusedCellCoord,
        shouldAddTabstop,
        announce,
      });
      expect(cell.setAttribute).toHaveBeenCalledTimes(2);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([1, 1]);
      expect(cell.focus).not.toHaveBeenCalled();
    });

    it('should announce cell content and selection status for non selected first cell after focusing on it', () => {
      cell = { ...cell, textContent: '#something' };
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      };
      hasSelections = true;

      handleAccessibility.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        hasSelections,
        setFocusedCellCoord,
        shouldAddTabstop,
        announce,
      });

      expect(announce).toHaveBeenCalledWith({
        keys: ['#something,', 'SNTable.SelectionLabel.NotSelectedValue'],
      });
    });

    it('should announce cell content and selection status for selected first cell after focusing on it', () => {
      const tmpCell = global.document.createElement('td');
      tmpCell.classList.add('selected');

      cell = { ...cell, classList: tmpCell.classList, textContent: '#something' };
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      };
      hasSelections = true;

      handleAccessibility.handleResetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        hasSelections,
        setFocusedCellCoord,
        shouldAddTabstop,
        announce,
      });

      expect(announce).toHaveBeenCalledWith({
        keys: ['#something,', 'SNTable.SelectionLabel.SelectedValue'],
      });
    });
  });

  describe('handleFocusoutEvent', () => {
    let containsRelatedTarget;
    let evt;
    let shouldRefocus;
    let announcement1;
    let announcement2;

    beforeEach(() => {
      containsRelatedTarget = false;
      announcement1 = { innerHTML: 'firstAnnouncement' };
      announcement2 = { innerHTML: 'secondAnnouncement' };
      evt = {
        currentTarget: {
          contains: () => containsRelatedTarget,
          querySelector: (identifier) => (identifier.slice(-1) === '1' ? announcement1 : announcement2),
        },
      };
      shouldRefocus = { current: false };
      keyboard = { enabled: true, blur: jest.fn() };
    });

    it('should call blur and remove announcements when currentTarget does not contain relatedTarget, shouldRefocus is false and keyboard.enabled is true', () => {
      handleAccessibility.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).toHaveBeenCalledWith(false);
      expect(announcement1.innerHTML).toBe('');
      expect(announcement2.innerHTML).toBe('');
    });

    it('should not call blur when currentTarget contains relatedTarget', () => {
      containsRelatedTarget = true;

      handleAccessibility.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });

    it('should not call blur when shouldRefocus is true', () => {
      shouldRefocus.current = true;

      handleAccessibility.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });

    it('should not call blur when keyboard.enabled is falsey', () => {
      keyboard.enabled = false;

      handleAccessibility.handleFocusoutEvent(evt, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });
  });

  describe('focusSelectionToolbar', () => {
    let element;
    let parentElement;
    let last;

    beforeEach(() => {
      parentElement = { focus: jest.fn() };
      element = {
        closest: () => ({ querySelector: () => ({ parentElement }) }),
      };
      last = false;
    });

    it('should call parentElement.focus when clientConfirmButton exists', () => {
      handleAccessibility.focusSelectionToolbar(element, keyboard, last);
      expect(parentElement.focus).toHaveBeenCalledTimes(1);
      expect(keyboard.focusSelection).not.toHaveBeenCalled();
    });

    it("should call keyboard.focusSelection when clientConfirmButton doesn't exist", () => {
      parentElement = null;
      handleAccessibility.focusSelectionToolbar(element, keyboard, last);
      expect(keyboard.focusSelection).toHaveBeenCalledWith(false);
    });
  });
});
