import { MouseEvent } from 'react';
import { stardust } from '@nebula.js/stardust';
import { Announce, Cell, TotalsPosition } from '../../types';
import { SelectionDispatch } from '../types';
import { SelectionActions } from '../constants';
import { removeTabAndFocusCell, updateFocus, getCellElement } from './accessibility-utils';

export const handleClickToFocusBody = (
  cell: Cell,
  rootElement: HTMLElement,
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  keyboard: stardust.Keyboard,
  totalsPosition: TotalsPosition
) => {
  const { rawRowIdx, rawColIdx } = cell;
  const adjustedRowIdx = totalsPosition === 'top' ? rawRowIdx + 2 : rawRowIdx + 1;
  removeTabAndFocusCell([adjustedRowIdx, rawColIdx], rootElement, setFocusedCellCoord, keyboard);
};

export const handleClickToFocusHead = (
  columnIndex: number,
  rootElement: HTMLElement,
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  keyboard: stardust.Keyboard
) => {
  removeTabAndFocusCell([0, columnIndex], rootElement, setFocusedCellCoord, keyboard);
};

export const handleMouseDownLabelToFocusHeadCell = (evt: MouseEvent, rootElement: HTMLElement, columnIndex: number) => {
  evt.preventDefault();
  updateFocus({ focusType: 'focus', cell: getCellElement(rootElement, [0, columnIndex]) });
};

export const getMouseHandlers = (
  cell: Cell,
  announce: Announce,
  onMouseDown: React.MouseEventHandler<HTMLTableCellElement> | undefined,
  selectionDispatch: SelectionDispatch,
  isFlagEnabled: (flag: string) => boolean
) => {
  const selectMultiEnabled = isFlagEnabled('PS_15585_SN_TABLE_BASIC_FEATURES');

  const handleMouseDown = (evt: React.MouseEvent) => {
    // run handleClickToFocusBody
    onMouseDown?.(evt as React.MouseEvent<HTMLTableCellElement>);
    if (selectMultiEnabled && cell.isSelectable)
      selectionDispatch({ type: SelectionActions.SELECT_MULTI_START, payload: { cell } });
  };

  const handleMouseOver = (evt: React.MouseEvent) => {
    if (selectMultiEnabled && evt.buttons === 1)
      selectionDispatch({ type: SelectionActions.SELECT_MULTI_ADD, payload: { cell, evt, announce } });
  };

  const handleMouseUp = (evt: React.MouseEvent) => {
    if (selectMultiEnabled && evt.button === 0) selectionDispatch({ type: SelectionActions.SELECT_MULTI_END });
  };

  const handleMouseClick = (evt: React.MouseEvent) => {
    if (cell.isSelectable && evt.button === 0)
      selectionDispatch({ type: SelectionActions.SELECT, payload: { cell, evt, announce } });
  };

  return { handleMouseDown, handleMouseOver, handleMouseUp, handleMouseClick };
};
