import { MouseEvent } from 'react';
import { stardust } from '@nebula.js/stardust';
import { TotalsPosition, Cell, Announce } from '../../../types';
import { handleMouseDownToFocusBody, handleMouseDownToFocusHead, getSelectionMouseHandlers } from '../handle-mouse';
import * as accessibilityUtils from '../accessibility-utils';
import * as getElementUtils from '../get-element-utils';
import { SelectionDispatch } from '../../types';
import { SelectionActions } from '../../constants';

describe('handle-mouse', () => {
  const rootElement = {} as unknown as HTMLDivElement;
  const cellElement = { focus: () => undefined, setAttribute: () => undefined } as unknown as HTMLTableCellElement;
  let keyboard = {} as unknown as stardust.Keyboard;
  let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  let evt: MouseEvent;

  beforeEach(() => {
    evt = { preventDefault: jest.fn() } as unknown as MouseEvent;
    setFocusedCellCoord = jest.fn();
    jest.spyOn(accessibilityUtils, 'removeTabAndFocusCell').mockImplementation(() => undefined);
    jest.spyOn(accessibilityUtils, 'updateFocus').mockImplementation(() => {});
    jest.spyOn(getElementUtils, 'getCellElement').mockImplementation(() => cellElement);
  });

  afterEach(() => jest.clearAllMocks());

  describe('handleMouseDownToFocusBody', () => {
    let totalsPosition: TotalsPosition;
    const cell = {
      pageRowIdx: 0,
      pageColIdx: 0,
    } as Cell;

    beforeEach(() => {
      totalsPosition = { atTop: false, atBottom: false };
    });

    it('should call removeTabAndFocusCell with cellCoord [1,0]', () => {
      handleMouseDownToFocusBody(cell, rootElement, setFocusedCellCoord, keyboard, totalsPosition);
      expect(accessibilityUtils.removeTabAndFocusCell).toHaveBeenCalledWith(
        [1, 0],
        rootElement,
        setFocusedCellCoord,
        keyboard
      );
    });

    it('should call removeTabAndFocusCell with cellCoord [2,0] when totals is on top', () => {
      totalsPosition.atTop = true;
      handleMouseDownToFocusBody(cell, rootElement, setFocusedCellCoord, keyboard, totalsPosition);
      expect(accessibilityUtils.removeTabAndFocusCell).toHaveBeenCalledWith(
        [2, 0],
        rootElement,
        setFocusedCellCoord,
        keyboard
      );
    });
  });

  describe('handleMouseDownToFocusHead', () => {
    const cellCoord = [0, 2] as [number, number];
    let isInteractionEnabled: boolean;

    const callHandleMouseDown = () =>
      handleMouseDownToFocusHead({ evt, cellCoord, rootElement, setFocusedCellCoord, keyboard, isInteractionEnabled });

    beforeEach(() => {
      keyboard = {
        enabled: true,
        active: false,
        focus: jest.fn(),
      };
      isInteractionEnabled = true;
    });

    it('should call keyboard.focus when enabled is true and active is false', () => {
      callHandleMouseDown();
      expect(keyboard.focus).toHaveBeenCalledTimes(1);
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(0);
    });

    it('should call updateFocus when enabled is true but active is also true', () => {
      keyboard.active = true;

      callHandleMouseDown();
      expect(keyboard.focus).toHaveBeenCalledTimes(0);
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
    });

    it('should call updateFocus when enabled is false', () => {
      keyboard.enabled = false;

      callHandleMouseDown();
      expect(keyboard.focus).toHaveBeenCalledTimes(0);
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(1);
    });

    it('should early return when isInteraction', () => {
      isInteractionEnabled = false;

      callHandleMouseDown();
      expect(keyboard.focus).toHaveBeenCalledTimes(0);
      expect(accessibilityUtils.updateFocus).toHaveBeenCalledTimes(0);
    });
  });

  describe('getSelectionMouseHandlers', () => {
    let cell: Cell;
    let announce: Announce;
    let onMouseDown: React.MouseEventHandler<HTMLTableCellElement> | undefined;
    let selectionDispatch: SelectionDispatch;

    const getHandlers = () => getSelectionMouseHandlers(cell, announce, selectionDispatch, onMouseDown);

    beforeEach(() => {
      cell = {
        isSelectable: true,
      } as unknown as Cell;
      announce = jest.fn();
      onMouseDown = jest.fn();
      selectionDispatch = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

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
      it('should call selectionDispatch with type SELECT_MOUSE_UP when evt.button is 0', () => {
        evt.button = 0;
        const { handleMouseUp } = getHandlers();
        handleMouseUp(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(1);
        expect(selectionDispatch).toHaveBeenCalledWith({
          type: SelectionActions.SELECT_MOUSE_UP,
          payload: { cell, evt, announce },
        });
      });

      it('should not call selectionDispatch when evt.button is not 0', () => {
        evt.buttons = 1;
        const { handleMouseUp } = getHandlers();
        handleMouseUp(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(0);
      });
    });
  });
});
