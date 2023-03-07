import { MouseEvent } from 'react';
import { stardust } from '@nebula.js/stardust';
import { TotalsPosition, Cell, Announce } from '../../../types';
import {
  handleClickToFocusBody,
  // handleClickToFocusHead,
  // handleMouseDownLabelToFocusHeadCell,
  getSelectionMouseHandlers,
} from '../handle-click';
import * as accessibilityUtils from '../accessibility-utils';
import * as getElementUtils from '../get-element-utils';
import { SelectionDispatch } from '../../types';
import { SelectionActions } from '../../constants';

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
    jest.spyOn(getElementUtils, 'getCellElement').mockImplementation(() => cellElement);
  });

  afterEach(() => jest.clearAllMocks());

  describe('handleClickToFocusBody', () => {
    let totalsPosition: TotalsPosition;
    const cell = {
      pageRowIdx: 0,
      pageColIdx: 0,
    } as Cell;

    beforeEach(() => {
      totalsPosition = { atTop: false, atBottom: false };
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
      totalsPosition.atTop = true;
      handleClickToFocusBody(cell, rootElement, setFocusedCellCoord, keyboard, totalsPosition);
      expect(accessibilityUtils.removeTabAndFocusCell).toHaveBeenCalledWith(
        [2, 0],
        rootElement,
        setFocusedCellCoord,
        keyboard
      );
    });
  });

  // describe('handleClickToFocusHead', () => {
  //   const columnIndex = 2;

  //   it('should call removeTabAndFocusCell with cellCoord [0,2]', () => {
  //     handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard);
  //     expect(accessibilityUtils.removeTabAndFocusCell).toHaveBeenCalledWith(
  //       [0, 2],
  //       rootElement,
  //       setFocusedCellCoord,
  //       keyboard
  //     );
  //   });
  // });

  // describe('handleMouseDownLabelToFocusHeadCell', () => {
  //   const columnIndex = 1;

  //   it('should call updateFocus and getCellElement with head cell at given column', () => {
  //     handleMouseDownLabelToFocusHeadCell(evt, rootElement, columnIndex);
  //     expect(evt.preventDefault).toHaveBeenCalled();
  //     expect(accessibilityUtils.getCellElement).toHaveBeenCalledWith(rootElement, [0, 1]);
  //     expect(accessibilityUtils.updateFocus).toHaveBeenCalledWith({ focusType: 'focus', cell: cellElement });
  //   });
  // });

  describe('getSelectionMouseHandlers', () => {
    let cell: Cell;
    let announce: Announce;
    let onMouseDown: React.MouseEventHandler<HTMLTableCellElement> | undefined;
    let selectionDispatch: SelectionDispatch;
    let areBasicFeaturesEnabled: boolean;

    const getHandlers = () =>
      getSelectionMouseHandlers(cell, announce, onMouseDown, selectionDispatch, areBasicFeaturesEnabled);

    beforeEach(() => {
      cell = {
        isSelectable: true,
      } as unknown as Cell;
      announce = jest.fn();
      onMouseDown = jest.fn();
      selectionDispatch = jest.fn();
      areBasicFeaturesEnabled = true;
    });

    afterEach(() => jest.clearAllMocks());

    it('should not call selectionDispatch for down nor over when basic features flag is disabled', () => {
      areBasicFeaturesEnabled = false;
      const { handleMouseDown, handleMouseOver } = getHandlers();
      handleMouseDown(evt);
      handleMouseOver(evt);

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
      it('should call selectionDispatch with type SELECT_MOUSE_UP when evt.button is 0 and flag is true', () => {
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

      it('should call selectionDispatch with type SELECT when cell.isSelectable is true and flag is false', () => {
        evt.button = 0;
        areBasicFeaturesEnabled = false;
        const { handleMouseUp } = getHandlers();
        handleMouseUp(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(1);
        expect(selectionDispatch).toHaveBeenCalledWith({
          type: SelectionActions.SELECT,
          payload: { cell, evt, announce },
        });
      });

      it('should not call selectionDispatch when cell.isSelectable is false and flag is false', () => {
        evt.button = 0;
        areBasicFeaturesEnabled = false;
        cell.isSelectable = false;
        const { handleMouseUp } = getHandlers();
        handleMouseUp(evt);

        expect(selectionDispatch).toHaveBeenCalledTimes(0);
      });
    });
  });
});
