import { stardust } from "@nebula.js/stardust";
import { renderHook, waitFor } from "@testing-library/react";
import { ExtendedSelectionAPI } from "../../../types";
import { SelectionActions } from "../../constants";
import useSelectionListener from "../use-selection-listener";

describe("useSelectionListener", () => {
  const listenerNames = ["deactivated", "canceled", "confirmed", "cleared"];
  let selectionsAPI: ExtendedSelectionAPI;
  let selectionDispatch: jest.Mock<any, any>;
  let setShouldRefocus: jest.Mock<any, any>;
  let keyboard: stardust.Keyboard;
  let containsActiveElement: boolean;
  let tableWrapperRef: React.MutableRefObject<HTMLDivElement>;

  beforeEach(() => {
    selectionDispatch = jest.fn();
    setShouldRefocus = jest.fn();
    selectionsAPI = {
      on: jest.fn(),
      removeListener: jest.fn(),
    } as unknown as ExtendedSelectionAPI;
    keyboard = { enabled: true, active: false, blur: jest.fn(), focus: jest.fn(), focusSelection: jest.fn() };

    containsActiveElement = true;
    tableWrapperRef = {
      current: {
        contains: () => containsActiveElement,
      },
    } as unknown as React.MutableRefObject<HTMLDivElement>;
  });

  afterEach(() => jest.clearAllMocks());

  it("should call api.on and api removeListener for all listeners", async () => {
    renderHook(() =>
      useSelectionListener({ selectionsAPI, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef }),
    );

    const expects: Promise<void>[] = [];
    listenerNames.forEach((name, index) => {
      expects.push(waitFor(() => expect(selectionsAPI.on).toHaveBeenNthCalledWith(index + 1, name, expect.anything())));
    });

    await Promise.all(expects);
  });

  it("should call api.on with the same callback for all listener names, that calls selectionDispatch", async () => {
    const callbacks: Array<() => void> = [];
    selectionsAPI = {
      on: (_: string, cb: () => void) => {
        callbacks.push(cb);
      },
      removeListener: () => null,
    } as unknown as ExtendedSelectionAPI;

    renderHook(() =>
      useSelectionListener({ selectionsAPI, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef }),
    );

    const expects: Promise<void>[] = [];
    callbacks.forEach((cb) => {
      cb();
      expects.push(waitFor(() => expect(selectionDispatch).toHaveBeenCalledWith({ type: SelectionActions.RESET })));
    });

    // only for confirm events
    await waitFor(() => expect(setShouldRefocus).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(keyboard.blur).not.toHaveBeenCalled());
    await Promise.all(expects);
  });

  it("should call keyboard blur when confirmed callback is called, keyboard.enabled is true and tableWrapperRef does not contain activeElement", async () => {
    containsActiveElement = false;
    let confirmCallback: () => void = () => undefined;
    selectionsAPI = {
      on: (name: string, cb: () => void) => {
        if (name === "confirmed") confirmCallback = cb;
      },
      removeListener: () => null,
    } as unknown as ExtendedSelectionAPI;

    renderHook(() =>
      useSelectionListener({ selectionsAPI, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef }),
    );

    confirmCallback();
    await waitFor(() => expect(setShouldRefocus).not.toHaveBeenCalled());
    await waitFor(() => expect(keyboard.blur).toHaveBeenCalledTimes(1));
  });

  it("should not call keyboard blur when confirmed callback is called, keyboard.enabled is undefined and tableWrapperRef does not contain activeElement", async () => {
    containsActiveElement = false;
    keyboard.enabled = false;
    let confirmCallback: () => void = () => undefined;
    selectionsAPI = {
      on: (name: string, cb: () => void) => {
        name === "confirmed" && (confirmCallback = cb);
      },
      removeListener: () => null,
    } as unknown as ExtendedSelectionAPI;

    renderHook(() =>
      useSelectionListener({ selectionsAPI, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef }),
    );

    confirmCallback();
    await waitFor(() => expect(setShouldRefocus).not.toHaveBeenCalled());
    await waitFor(() => expect(keyboard.blur).not.toHaveBeenCalled());
  });
});
