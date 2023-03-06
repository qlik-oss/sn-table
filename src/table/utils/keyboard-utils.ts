import { Cell } from '../../types';
import { KeyCodes } from '../constants';

export const preventDefaultBehavior = (evt: React.KeyboardEvent) => {
  evt.stopPropagation();
  evt.preventDefault();
};

export const isCtrlCmd = (evt: React.KeyboardEvent) => evt.ctrlKey || evt.metaKey;

export const isCtrlShift = (evt: React.KeyboardEvent) => evt.shiftKey && isCtrlCmd(evt);

export const isArrowKey = (key: string) =>
  [KeyCodes.LEFT, KeyCodes.RIGHT, KeyCodes.UP, KeyCodes.DOWN].includes(key as KeyCodes);

export const isShiftArrow = (evt: React.KeyboardEvent) => evt.shiftKey && isArrowKey(evt.key);

/**
 * Checks if events caught by head, totals and body handles should bubble to the wrapper handler or default behavior
 */
export const shouldBubble = (
  evt: React.KeyboardEvent,
  isSelectionMode = false,
  keyboardEnabled = false,
  paginationNeeded = true
) => {
  const shouldGoToSelToolbar = keyboardEnabled && isSelectionMode;
  const bubbleWithoutShift = !evt.shiftKey && (paginationNeeded || !shouldGoToSelToolbar);
  const bubbleWithShift = evt.shiftKey && !shouldGoToSelToolbar;
  return (
    // esc to blur object
    (evt.key === KeyCodes.ESC && !isSelectionMode) ||
    // default tab to pagination or tab to blur
    (evt.key === KeyCodes.TAB && (bubbleWithoutShift || bubbleWithShift)) ||
    // ctrl + shift + arrow to change page
    ((evt.key === KeyCodes.LEFT || evt.key === KeyCodes.RIGHT) && isCtrlShift(evt))
  );
};

/**
 * Checks if should select with shift + arrow.
 * When at the first/last row of the cell, shift + arrow up/down should not select anything
 */
export const shouldSelectMultiValues = (
  areBasicFeaturesEnabled: boolean,
  isSelectionsEnabled: boolean,
  evt: React.KeyboardEvent,
  cell: Cell
) =>
  evt.shiftKey &&
  ((evt.key === KeyCodes.UP && cell.pageRowIdx !== 0) || (evt.key === KeyCodes.DOWN && !cell.isLastRow)) &&
  areBasicFeaturesEnabled &&
  isSelectionsEnabled &&
  cell.isSelectable;

/**
 * Gets the focus type for navigating the body.
 * When you move to the header, it returns focusButton type
 */
export const getFocusType = (
  cellCoord: [number, number],
  evt: React.KeyboardEvent<Element>,
  firstBodyRowIdx: number
) => {
  const upToHeader = evt.key === KeyCodes.UP && cellCoord[0] === firstBodyRowIdx;
  const leftToHeader = evt.key === KeyCodes.LEFT && cellCoord[0] === firstBodyRowIdx && cellCoord[1] === 0;

  return upToHeader || leftToHeader ? 'focusButton' : 'focus';
};
