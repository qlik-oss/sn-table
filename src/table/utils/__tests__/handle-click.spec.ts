import { MouseEvent } from 'react';
import { stardust } from '@nebula.js/stardust';
import { TotalsPosition, Cell } from '../../../types';
import { handleClickToFocusBody, handleClickToFocusHead, handleMouseDownLabelToFocusHeadCell } from '../handle-click';
import * as accessibilityUtils from '../accessibility-utils';

describe('handle-click', () => {
  const keyboard = {} as unknown as stardust.Keyboard;
  const rootElement = {} as unknown as HTMLDivElement;
  const cell = { focus: () => undefined, setAttribute: () => undefined } as unknown as HTMLTableCellElement;
  let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  let evt: MouseEvent;

  beforeEach(() => {
    evt = { preventDefault: jest.fn() } as unknown as MouseEvent;
    setFocusedCellCoord = jest.fn();
    jest.spyOn(accessibilityUtils, 'removeTabAndFocusCell').mockImplementation(() => undefined);
    jest.spyOn(accessibilityUtils, 'updateFocus');
    jest.spyOn(accessibilityUtils, 'getCellElement').mockImplementation(() => cell);
  });

  afterEach(() => jest.clearAllMocks());

  describe('handleClickToFocusBody', () => {
    let totalsPosition: TotalsPosition;
    const cellData = {
      rawRowIdx: 0,
      rawColIdx: 0,
    } as Cell;

    beforeEach(() => {
      totalsPosition = 'noTotals';
    });

    it('should call removeTabAndFocusCell with cellCoord [1,0]', () => {
      handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard, totalsPosition);
      expect(accessibilityUtils.removeTabAndFocusCell).toHaveBeenCalledWith(
        [1, 0],
        rootElement,
        setFocusedCellCoord,
        keyboard
      );
    });

    it('should call removeTabAndFocusCell with cellCoord [2,0] when totals is on top', () => {
      totalsPosition = 'top';
      handleClickToFocusBody(cellData, rootElement, setFocusedCellCoord, keyboard, totalsPosition);
      expect(accessibilityUtils.removeTabAndFocusCell).toHaveBeenCalledWith(
        [2, 0],
        rootElement,
        setFocusedCellCoord,
        keyboard
      );
    });
  });

  describe('handleClickToFocusHead', () => {
    const columnIndex = 2;

    it('should call removeTabAndFocusCell with cellCoord [0,2]', () => {
      handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard);
      expect(accessibilityUtils.removeTabAndFocusCell).toHaveBeenCalledWith(
        [0, 2],
        rootElement,
        setFocusedCellCoord,
        keyboard
      );
    });
  });

  describe('handleMouseDownLabelToFocusHeadCell', () => {
    const columnIndex = 1;

    it('should call updateFocus and getCellElement with head cell at given column', () => {
      handleMouseDownLabelToFocusHeadCell(evt, rootElement, columnIndex);
      expect(evt.preventDefault).toHaveBeenCalled();
      expect(accessibilityUtils.getCellElement).toHaveBeenCalledWith(rootElement, [0, 1]);
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledWith({ focusType: 'focus', cell });
    });
  });
});
