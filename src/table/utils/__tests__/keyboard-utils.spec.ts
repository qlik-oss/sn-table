import { shouldBubble } from '../keyboard-utils';

import { KeyCodes } from '../../constants';

describe('shouldBubble', () => {
  let evt: React.KeyboardEvent;
  let isSelectionMode: boolean;
  let keyboardEnabled: boolean;
  let paginationNeeded: boolean;

  const callShouldBubble = () => shouldBubble(evt, isSelectionMode, keyboardEnabled, paginationNeeded);

  beforeEach(() => {
    evt = {
      key: KeyCodes.ESC,
      shiftKey: false,
      ctrlKey: false,
      metaKey: false, // cases when meta key is pressed instead of ctrl is not tested here, the test are granular enough anyway
    } as unknown as React.KeyboardEvent;
    isSelectionMode = false;
    keyboardEnabled = false;
    paginationNeeded = true;
  });

  it('should return true when esc is pressed and isSelectionMode is false', () => {
    expect(callShouldBubble()).toBe(true);
  });

  it('should return false when esc is pressed and isSelectionMode is true', () => {
    isSelectionMode = true;
    expect(callShouldBubble()).toBe(false);
  });

  it('should return true when tab is pressed and paginationNeeded is true', () => {
    evt.key = KeyCodes.TAB;
    expect(callShouldBubble()).toBe(true);
  });

  it('should return true when tab is pressed, paginationNeeded is false and keyboardEnabled is false but isSelectionMode is true', () => {
    evt.key = KeyCodes.TAB;
    paginationNeeded = false;
    isSelectionMode = true;
    expect(callShouldBubble()).toBe(true);
  });

  it('should return true when tab is pressed, paginationNeeded is false and isSelectionMode is false but keyboardEnabled is true', () => {
    evt.key = KeyCodes.TAB;
    paginationNeeded = false;
    keyboardEnabled = true;
    expect(callShouldBubble()).toBe(true);
  });

  it('should return false when tab is pressed, paginationNeeded is false and keyboardEnabled && isSelectionMode is true', () => {
    evt.key = KeyCodes.TAB;
    paginationNeeded = false;
    keyboardEnabled = true;
    isSelectionMode = true;
    expect(callShouldBubble()).toBe(false);
  });

  it('should return true when shift + tab is pressed and keyboardEnabled is false but isSelectionMode is true', () => {
    evt.key = KeyCodes.TAB;
    evt.shiftKey = true;
    isSelectionMode = true;
    expect(callShouldBubble()).toBe(true);
  });

  it('should return true when shift + tab is pressed and isSelectionMode is false but keyboardEnabled is true', () => {
    evt.key = KeyCodes.TAB;
    evt.shiftKey = true;
    keyboardEnabled = true;
    expect(callShouldBubble()).toBe(true);
  });

  it('should return false when shift + tab is pressed and keyboardEnabled && isSelectionMode is true', () => {
    evt.key = KeyCodes.TAB;
    evt.shiftKey = true;
    keyboardEnabled = true;
    isSelectionMode = true;
    expect(callShouldBubble()).toBe(false);
  });

  it('should return true when ctrl + shift + arrowRight is pressed', () => {
    evt.key = KeyCodes.RIGHT;
    evt.shiftKey = true;
    evt.ctrlKey = true;
    expect(callShouldBubble()).toBe(true);
  });

  it('should return true when ctrl + shift + arrowLeft is pressed', () => {
    evt.key = KeyCodes.LEFT;
    evt.shiftKey = true;
    evt.ctrlKey = true;
    expect(callShouldBubble()).toBe(true);
  });

  it('should return false when ctrl + shift + some other key is pressed', () => {
    evt.key = KeyCodes.UP;
    evt.shiftKey = true;
    evt.ctrlKey = true;
    expect(callShouldBubble()).toBe(false);
  });

  it('should return false when ctrl + arrowLeft but not shift', () => {
    evt.key = KeyCodes.LEFT;
    evt.ctrlKey = true;
    expect(callShouldBubble()).toBe(false);
  });

  it('should return false when shift + arrowLeft but not ctrl', () => {
    evt.key = KeyCodes.LEFT;
    evt.shiftKey = true;
    expect(callShouldBubble()).toBe(false);
  });
});
