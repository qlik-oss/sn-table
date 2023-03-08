import { Cell } from '../../types';
import { KeyCodes } from '../constants';

export const preventDefaultBehavior = (evt: React.KeyboardEvent | MouseEvent | React.MouseEvent<HTMLLIElement>) => {
  evt.stopPropagation();
  evt.preventDefault();
};

export const isCtrlShift = (evt: React.KeyboardEvent) => evt.shiftKey && (evt.ctrlKey || evt.metaKey);

export const isArrowKey = (key: string) =>
  [KeyCodes.LEFT, KeyCodes.RIGHT, KeyCodes.UP, KeyCodes.DOWN].includes(key as KeyCodes);

export const isShiftArrow = (evt: React.KeyboardEvent) => evt.shiftKey && isArrowKey(evt.key);

export const isCtrlCmd = (evt: React.KeyboardEvent) => evt.ctrlKey || evt.metaKey;

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
