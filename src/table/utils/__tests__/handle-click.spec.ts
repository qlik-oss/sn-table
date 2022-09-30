import { MouseEvent } from 'react';
import { stardust } from '@nebula.js/stardust';
import { TotalsPosition, Cell, Announce } from '../../../types';
import {
  handleClickToFocusBody,
  handleClickToFocusHead,
  handleMouseDownLabelToFocusHeadCell,
  getSelectionMouseHandlers,
} from '../handle-click';
import * as accessibilityUtils from '../accessibility-utils';
import { SelectionDispatch } from '../../types';

describe('handle-click', () => {
  const keyboard = {} as unknown as stardust.Keyboard;
  const rootElement = {} as unknown as HTMLDivElement;
  const cellElement = { focus: () => undefined, setAttribute: () => undefined } as unknown as HTMLTableCellElement;
  let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  let evt: MouseEvent;

  beforeEach(() => {
    evt = { preventDefault: jest.fn() } as unknown as MouseEvent;
    setFocusedCellCoord = jest.fn();
    jest.spyOn(accessibilityUtils, 'removeTabAndFocusCell').mockImplementation(() => undefined);
    jest.spyOn(accessibilityUtils, 'updateFocus');
    jest.spyOn(accessibilityUtils, 'getCellElement').mockImplementation(() => cellElement);
  });

  afterEach(() => jest.clearAllMocks());

  describe('handleClickToFocusBody', () => {
    let totalsPosition: TotalsPosition;
    const cell = {
      rawRowIdx: 0,
      rawColIdx: 0,
    } as Cell;

    beforeEach(() => {
      totalsPosition = 'noTotals';
    });

    it('should call removeTabAndFocusCell with cellCoord [1,0]', () => {
      handleClickToFocusBody(cell, rootElement, setFocusedCellCoord, keyboard, totalsPosition);
      expect(accessibilityUtils.removeTabAndFocusCell).toHaveBeenCalledWith(
        [1, 0],
        rootElement,
        setFocusedCellCoord,
        keyboard
      );
    });

    it('should call removeTabAndFocusCell with cellCoord [2,0] when totals is on top', () => {
      totalsPosition = 'top';
      handleClickToFocusBody(cell, rootElement, setFocusedCellCoord, keyboard, totalsPosition);
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
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledWith({ focusType: 'focus', cell: cellElement });
    });
  });

  describe('getSelectionMouseHandlers', () => {
    let cell: Cell;
    let announce: Announce;
    let onMouseDown: React.MouseEventHandler<HTMLTableCellElement> | undefined;
    let selectionDispatch: SelectionDispatch;
    let isFlagEnabled: (flag: string) => boolean;

    const getHandlers = () => getSelectionMouseHandlers(cell, announce, onMouseDown, selectionDispatch, isFlagEnabled);

    beforeEach(() => {
      cell = {
        isSelectable: true,
      } as unknown as Cell;
      announce = jest.fn();
      onMouseDown = jest.fn();
      selectionDispatch = jest.fn();
      isFlagEnabled = (flag) => !!flag;
    });

    afterEach(() => jest.clearAllMocks());

    it('should not call selectionDispatch for down, over nor up when basic features flag is disabled', () => {
      isFlagEnabled = (flag) => !flag;
      const { handleMouseDown, handleMouseOver, handleMouseUp } = getHandlers();
      handleMouseDown(evt);
      handleMouseOver(evt);
      handleMouseUp(evt);

      expect(selectionDispatch).toHaveBeenCalledTimes(0);
      // Still should call onMouseDown attached at the body level
      expect(onMouseDown).toHaveBeenCalledTimes(1);
    });

    describe('handleMouseDown', () => {
      it('should call selectionDispatch when isSelectable is true', () => {
        const { handleMouseDown } = getHandlers();
        handleMouseDown(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(1);
      });

      it('should not call selectionDispatch when isSelectable is false', () => {
        cell.isSelectable = false;
        const { handleMouseDown } = getHandlers();
        handleMouseDown(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(0);
      });
    });

    describe('handleMouseOver', () => {
      it('should call selectionDispatch when evt.buttons is 1', () => {
        evt.buttons = 1;
        const { handleMouseOver } = getHandlers();
        handleMouseOver(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(1);
      });

      it('should not call selectionDispatch when evt.buttons is not 1', () => {
        evt.buttons = 2;
        const { handleMouseOver } = getHandlers();
        handleMouseOver(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(0);
      });
    });

    describe('handleMouseUp', () => {
      it('should call selectionDispatch when evt.button is 0', () => {
        evt.button = 0;
        const { handleMouseUp } = getHandlers();
        handleMouseUp(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(1);
      });

      it('should not call selectionDispatch when evt.button is not 0', () => {
        evt.buttons = 1;
        const { handleMouseUp } = getHandlers();
        handleMouseUp(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(0);
      });
    });

    describe('handleMouseClick', () => {
      it('should call selectionDispatch when evt.button is 0', () => {
        evt.button = 0;
        const { handleMouseClick } = getHandlers();
        handleMouseClick(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(1);
      });

      it('should not call selectionDispatch when evt.button is not 0', () => {
        evt.buttons = 1;
        const { handleMouseClick } = getHandlers();
        handleMouseClick(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(0);
      });

      it('should not call selectionDispatch when when isSelectable is false', () => {
        evt.button = 0;
        cell.isSelectable = false;
        const { handleMouseClick } = getHandlers();
        handleMouseClick(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(0);
      });
    });
  });
});
