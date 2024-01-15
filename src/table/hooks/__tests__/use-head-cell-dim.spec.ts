import { COLUMN_ADJUSTER_CLASS } from "@qlik/nebula-table-utils/lib/constants";
import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Column } from "../../../types";
import { useHeadCellDim } from "../use-head-cell-dim";

describe("UseHeadCellDim", () => {
  let isInteractionEnabled: boolean;
  let evt: React.KeyboardEvent;
  let columnsData: Column[];

  beforeEach(() => {
    isInteractionEnabled = true;
    evt = {} as React.KeyboardEvent;
    columnsData = {} as Column[];
  });

  const renderer = () => renderHook(() => useHeadCellDim({ isInteractionEnabled, columnsData })).result;

  test("should return initial open state as false", () => {
    const result = renderer();
    expect(result.current.open).toBe(false);
  });

  test("handleOpenMenu should set open state to true", () => {
    const result = renderer();

    act(() => {
      result.current.handleOpenMenu(evt);
    });

    expect(result.current.open).toBe(true);
  });

  test("handleOpenMenu should not set open state to true when interaction is disabled", () => {
    isInteractionEnabled = false;
    const result = renderer();

    act(() => {
      result.current.handleOpenMenu(evt);
    });

    expect(result.current.open).toBe(false);
  });

  test("handleOpenMenu should not set open state to true when event is coming from column adjuster", () => {
    evt.target = { getAttribute: () => COLUMN_ADJUSTER_CLASS } as unknown as EventTarget;
    const result = renderer();

    act(() => {
      result.current.handleOpenMenu(evt);
    });

    expect(result.current.open).toBe(false);
  });

  test("handleOpenMenu should not set open state to true when isAdjustingWidth is true", async () => {
    const result = renderer();

    await act(async () => {
      result.current.setIsAdjustingWidth(true);
    });

    act(() => {
      result.current.handleOpenMenu(evt);
    });

    expect(result.current.open).toBe(false);
  });
});
