import { stardust } from "@nebula.js/stardust";
import React from "react";
import { Announce, Cell, TotalsPosition } from "../../types";
import { FocusTypes, SelectionActions } from "../constants";
import { HandleHeadMouseDownProps, SelectionDispatch } from "../types";
import { removeTabAndFocusCell, updateFocus } from "./accessibility-utils";
import { getCellElement } from "./get-element-utils";

export const handleMouseDownToFocusBody = (
  cell: Cell,
  rootElement: HTMLElement,
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  keyboard: stardust.Keyboard,
  totalsPosition: TotalsPosition
) => {
  const { pageRowIdx, pageColIdx } = cell;
  const adjustedRowIdx = totalsPosition.atTop ? pageRowIdx + 2 : pageRowIdx + 1;
  removeTabAndFocusCell([adjustedRowIdx, pageColIdx], rootElement, setFocusedCellCoord, keyboard);
};

export const handleMouseDownToFocusHead = ({
  evt,
  rootElement,
  cellCoord,
  setFocusedCellCoord,
  keyboard,
  isInteractionEnabled,
}: HandleHeadMouseDownProps) => {
  evt.preventDefault();
  if (!isInteractionEnabled) return;

  setFocusedCellCoord(cellCoord);
  if (keyboard.enabled && !keyboard.active) {
    keyboard.focus?.();
  } else {
    updateFocus({ focusType: FocusTypes.FOCUS_BUTTON, cell: getCellElement(rootElement, cellCoord) });
  }
};

/**
 * gets all relevant mouse handlers for making selections, including dragging to select multiple rows
 */
export const getSelectionMouseHandlers = (
  onMouseDown: React.MouseEventHandler<HTMLTableCellElement> | undefined,
  cell: Cell,
  selectionDispatch: SelectionDispatch,
  announce: Announce
) => {
  const handleMouseDown = (evt: React.MouseEvent) => {
    // run handleMouseDownToFocusBody
    onMouseDown?.(evt as React.MouseEvent<HTMLTableCellElement>);
    // only need to check isSelectable here. once you are holding you want to be able to drag outside the current column
    if (cell.isSelectable) {
      const mouseupOutsideCallback = () => selectionDispatch({ type: SelectionActions.SELECT_MULTI_END });
      selectionDispatch({ type: SelectionActions.SELECT_MOUSE_DOWN, payload: { cell, mouseupOutsideCallback } });
    }
  };

  const handleMouseOver = (evt: React.MouseEvent) => {
    if (evt.buttons === 1)
      selectionDispatch({ type: SelectionActions.SELECT_MULTI_ADD, payload: { cell, evt, announce } });
  };

  const handleMouseUp = (evt: React.MouseEvent) => {
    if (evt.button === 0) {
      selectionDispatch({ type: SelectionActions.SELECT_MOUSE_UP, payload: { cell, evt, announce } });
    }
  };

  return { handleMouseDown, handleMouseOver, handleMouseUp };
};
