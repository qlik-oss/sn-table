import React from 'react';
import { renderHook } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';
import TestWithProviders from '../../../__test__/test-with-providers';
import { ExtendedSelectionAPI } from '../../../types';
import * as accessibilityUtils from '../../utils/accessibility-utils';
import * as getElementUtils from '../../utils/get-element-utils';
import useKeyboardActiveListener from '../use-keyboard-active-listener';
import { FIRST_BODY_CELL_COORD, FIRST_HEADER_CELL_COORD, FocusTypes } from '../../constants';

describe('use-keyboard-active-listener', () => {
  let isModal: boolean;
  let selectionsAPI: ExtendedSelectionAPI;
  let keyboard: stardust.Keyboard;

  const wrapper = ({ children }: any) => (
    <TestWithProviders selectionsAPI={selectionsAPI} keyboard={keyboard}>
      {children}
    </TestWithProviders>
  );
  const renderUseKEyboardActiveListener = () => renderHook(useKeyboardActiveListener, { wrapper });

  beforeEach(() => {
    isModal = false;
    keyboard = {
      active: false,
    } as stardust.Keyboard;
    selectionsAPI = {
      isModal: () => isModal,
    } as ExtendedSelectionAPI;

    jest.spyOn(accessibilityUtils, 'updateFocus').mockImplementation(() => {});
    jest.spyOn(getElementUtils, 'getCellElement').mockImplementation(() => ({} as HTMLTableCellElement));
    jest.spyOn(getElementUtils, 'findCellWithTabStop').mockImplementation(() => ({} as HTMLTableCellElement));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call findCellWithTabStop and updateFocus with focusType blur when keyboard.active is false', () => {
    renderUseKEyboardActiveListener();
    expect(getElementUtils.findCellWithTabStop).toHaveBeenCalledTimes(1);
    expect(accessibilityUtils.updateFocus).toHaveBeenCalledWith({
      focusType: FocusTypes.BLUR,
      cell: expect.anything(),
    });
  });

  it('should call getCellElement with [0, 0] and updateFocus with focusType focusButton when keyboard.active is true', () => {
    keyboard.active = true;

    renderUseKEyboardActiveListener();
    expect(getElementUtils.getCellElement).toHaveBeenCalledWith(expect.anything(), FIRST_HEADER_CELL_COORD);
    expect(accessibilityUtils.updateFocus).toHaveBeenCalledWith({
      focusType: FocusTypes.FOCUS_BUTTON,
      cell: expect.anything(),
    });
  });

  it('should call getCellElement and updateFocus with focusType focus when keyboard.active is true and isSelectionMode is true', () => {
    keyboard.active = true;
    isModal = true;

    renderUseKEyboardActiveListener();
    expect(getElementUtils.getCellElement).toHaveBeenCalledWith(expect.anything(), FIRST_BODY_CELL_COORD);
    expect(accessibilityUtils.updateFocus).toHaveBeenCalledWith({
      focusType: FocusTypes.FOCUS,
      cell: expect.anything(),
    });
  });
});
