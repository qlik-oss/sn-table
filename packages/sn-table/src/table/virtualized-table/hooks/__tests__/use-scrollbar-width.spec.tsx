import { renderHook } from "@testing-library/react";
import React from "react";
import { wrapper } from "../../../../__test__/test-with-providers";
import useScrollbarWidth from "../use-scrollbar-width";

describe("useScrollbarWidth", () => {
  test("should handle null as ref value", async () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    const { result } = renderHook(() => useScrollbarWidth(ref), { wrapper });

    expect(result.current.xScrollbarWidth).toBe(0);
    expect(result.current.yScrollbarWidth).toBe(0);
  });

  test("should update values on re-render", async () => {
    let element = { offsetWidth: 10, offsetHeight: 20, clientWidth: 5, clientHeight: 10 };
    let ref = { current: element } as React.RefObject<HTMLDivElement>;
    const { result, rerender } = renderHook(() => useScrollbarWidth(ref), { wrapper });

    expect(result.current.xScrollbarWidth).toBe(10);
    expect(result.current.yScrollbarWidth).toBe(5);

    element = { offsetWidth: 0, offsetHeight: 0, clientWidth: 0, clientHeight: 0 };
    ref = Object.assign(ref, { current: element });
    rerender(ref);

    expect(result.current.xScrollbarWidth).toBe(0);
    expect(result.current.yScrollbarWidth).toBe(0);
  });
});
