import { stardust } from "@nebula.js/stardust";
import { renderHook } from "@testing-library/react";
import React from "react";
import TestWithProviders from "../../../__test__/test-with-providers";
import { FIRST_HEADER_CELL_COORD, FocusTypes } from "../../constants";
import * as accessibilityUtils from "../../utils/accessibility-utils";
import * as getElementUtils from "../../utils/get-element-utils";
import useKeyboardActiveListener from "../use-keyboard-active-listener";

describe("use-keyboard-active-listener", () => {
  let keyboard: stardust.Keyboard;
  let focusedCellCoord: [number, number];

  const Wrapper = ({ children, isNewHeadCellMenuEnabled = false }: any) => (
    <TestWithProviders
      cellCoordMock={focusedCellCoord}
      keyboard={keyboard}
      isNewHeadCellMenuEnabled={isNewHeadCellMenuEnabled}
    >
      {children}
    </TestWithProviders>
  );

  const renderUseKeyboardActiveListener = (isNewHeadCellMenuEnabled = false) => {
    const { rerender } = renderHook(useKeyboardActiveListener, {
      wrapper: ({ children }: any) => <Wrapper isNewHeadCellMenuEnabled={isNewHeadCellMenuEnabled}>{children}</Wrapper>,
    });

    /**
     * since we are using useOnPropsChange
     * the functions we expect to be called
     * will not be triggered at first render
     * that is why we use rerender() in below tests
     */
    rerender();
  };

  beforeEach(() => {
    keyboard = {
      active: false,
    } as stardust.Keyboard;
    focusedCellCoord = FIRST_HEADER_CELL_COORD;

    jest.spyOn(accessibilityUtils, "updateFocus").mockImplementation(() => {});
    jest.spyOn(getElementUtils, "getCellElement").mockImplementation(() => ({}) as HTMLElement);
    jest.spyOn(getElementUtils, "findCellWithTabStop").mockImplementation(() => ({}) as HTMLElement);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call findCellWithTabStop and updateFocus with focusType blur when keyboard.active is false", () => {
    renderUseKeyboardActiveListener();

    expect(getElementUtils.findCellWithTabStop).toHaveBeenCalledTimes(1);
    expect(accessibilityUtils.updateFocus).toHaveBeenCalledWith({
      focusType: FocusTypes.BLUR,
      cell: expect.anything(),
    });
  });

  it("should call getCellElement with [0, 0] and updateFocus with focusType focusButton when keyboard.active is true", () => {
    keyboard.active = true;
    renderUseKeyboardActiveListener();

    expect(getElementUtils.getCellElement).toHaveBeenCalledWith(expect.anything(), FIRST_HEADER_CELL_COORD);
    expect(accessibilityUtils.updateFocus).toHaveBeenCalledWith({
      focusType: FocusTypes.FOCUS_BUTTON,
      cell: expect.anything(),
    });
  });

  it("should call getCellElement and updateFocus with focusType focus when keyboard.active is true and focusCellCoord is not in the header", () => {
    keyboard.active = true;
    focusedCellCoord = [2, 0];

    renderUseKeyboardActiveListener();

    expect(getElementUtils.getCellElement).toHaveBeenCalledWith(expect.anything(), focusedCellCoord);
    expect(accessibilityUtils.updateFocus).toHaveBeenCalledWith({
      focusType: FocusTypes.FOCUS,
      cell: expect.anything(),
    });
  });

  describe("when isNewHeadCellMenuEnabled flag is true:", () => {
    it("should call updateFocus with focus type even if focusedCellCoord[0] is 0", () => {
      keyboard.active = true;
      focusedCellCoord = [0, 0];
      renderUseKeyboardActiveListener(true);

      expect(accessibilityUtils.updateFocus).toHaveBeenCalledWith({
        focusType: FocusTypes.FOCUS,
        cell: expect.anything(),
      });
    });
  });
});
