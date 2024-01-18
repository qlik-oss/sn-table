import { stardust } from "@nebula.js/stardust";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { VariableSizeGrid, VariableSizeList } from "react-window";
import { generateLayout } from "../../../../__test__/generate-test-data";
import TestWithProviders from "../../../../__test__/test-with-providers";
import { Column, PageInfo, Row, TableLayout, ViewService } from "../../../../types";
import { GeneratedStyling } from "../../../types";
import { BodyStyle, GridState } from "../../types";
import useDynamicRowHeight, { UseDynamicRowHeightProps } from "../use-dynamic-row-height";

type HookWrapperProps = { children: JSX.Element };

describe("useDynamicRowHeight", () => {
  let columns: Column[] | undefined;
  let style: BodyStyle | GeneratedStyling;
  let columnWidths: number[];
  let rowHeight: number;
  let layout: TableLayout;
  let pageInfo: PageInfo;
  let rowCount: number;
  let gridRef: React.RefObject<VariableSizeGrid<any>> | undefined;
  let lineRef: React.RefObject<VariableSizeList<any>> | undefined;
  let gridState: React.MutableRefObject<GridState> | undefined;
  let props: UseDynamicRowHeightProps;
  let isSnapshot: boolean;
  let viewService: ViewService;
  let wrapper: ({ children }: HookWrapperProps) => JSX.Element;
  let rect: stardust.Rect;

  beforeEach(() => {
    rowCount = 5;
    layout = generateLayout(1, 1, rowCount);
    columnWidths = [120, 200];
    rowHeight = 20;
    pageInfo = { page: 0, rowsPerPage: 10, rowsPerPageOptions: [] };
    style = { fontFamily: "Arial", fontSize: "12px" } as GeneratedStyling;
    gridState = {
      current: {
        overscanColumnStartIndex: 0,
        overscanColumnStopIndex: 0,
        overscanRowStartIndex: 0,
        overscanRowStopIndex: 0,
      },
    };
    rect = { width: 100, height: 200, left: 0, top: 0 };

    viewService = {
      scrollTopRatio: 0.9,
      visibleTop: 0,
      visibleHeight: 11,
      page: 0,
      rowsPerPage: 100,
      qTop: 0,
      qHeight: 100,
      estimatedRowHeight: 25,
    };

    props = {
      columns,
      style,
      columnWidths,
      rowHeight,
      rowCount,
      pageInfo,
      gridRef,
      lineRef,
      gridState,
      isSnapshot,
      viewService,
    };

    wrapper = ({ children }: HookWrapperProps) => (
      <TestWithProviders layout={layout} rect={rect}>
        {children}
      </TestWithProviders>
    );
  });

  test("should update row meta and row height when setCellSize is called", async () => {
    const { result } = renderHook(() => useDynamicRowHeight(props), { wrapper });

    await waitFor(() => expect(result.current.rowMeta.current.totalHeight).toEqual(0));
    await waitFor(() => expect(result.current.estimatedRowHeight).toEqual(rowHeight));
    await waitFor(() => expect(result.current.getRowHeight(0)).toEqual(rowHeight));
    await waitFor(() => expect(result.current.getRowHeight(1)).toEqual(rowHeight));

    act(() => result.current.setCellSize("123456789", 0, 0));
    act(() => result.current.setCellSize("qwerty", 1, 0));

    await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(2));
    await waitFor(() => expect(result.current.rowMeta.current.heights).toEqual([25, 25]));
    await waitFor(() => expect(result.current.rowMeta.current.totalHeight).toEqual(50));
    await waitFor(() => expect(result.current.estimatedRowHeight).toEqual(25));
    await waitFor(() => expect(result.current.getRowHeight(0)).toEqual(25));
    await waitFor(() => expect(result.current.getRowHeight(1)).toEqual(25));
  });

  test("should updated an already measured rows height", async () => {
    const rowIdx = 0;
    const { result } = renderHook(() => useDynamicRowHeight(props), { wrapper });

    act(() => result.current.setCellSize("123456789", rowIdx, 0));

    await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(1));
    await waitFor(() => expect(result.current.rowMeta.current.heights).toEqual([25]));

    // Use a really long string on the next column
    const colIdx = 1;
    act(() => result.current.setCellSize(Array(columnWidths[colIdx]).fill("A").join(""), rowIdx, colIdx));

    await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(1));
    await waitFor(() => expect(result.current.rowMeta.current.heights).toEqual([41]));
    await waitFor(() => expect(result.current.rowMeta.current.totalHeight).toEqual(41));
    await waitFor(() => expect(result.current.estimatedRowHeight).toEqual(41));
  });

  test("should ignore an already measured cells height", async () => {
    const rowIdx = 0;
    const colIdx = 0;
    const { result } = renderHook(() => useDynamicRowHeight(props), { wrapper });

    act(() => result.current.setCellSize("123456789", rowIdx, colIdx));

    await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(1));
    await waitFor(() => expect(result.current.rowMeta.current.heights).toEqual([25]));
    await waitFor(() => expect(result.current.getRowHeight(0)).toEqual(25));
    await waitFor(() => expect(result.current.getRowHeight(1)).toEqual(25));

    // Use a really long string on the same row and column index as before
    act(() => result.current.setCellSize(Array(columnWidths[colIdx]).fill("A").join(""), rowIdx, colIdx));

    await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(1));
    await waitFor(() => expect(result.current.rowMeta.current.heights).toEqual([25]));
    await waitFor(() => expect(result.current.rowMeta.current.totalHeight).toEqual(25));
    await waitFor(() => expect(result.current.estimatedRowHeight).toEqual(25));
    await waitFor(() => expect(result.current.getRowHeight(0)).toEqual(25));
    await waitFor(() => expect(result.current.getRowHeight(1)).toEqual(25));
  });

  describe("resizeVisibleCells", () => {
    test("should update cell size for rendered rows", async () => {
      const rows = Array(rowCount)
        .fill(undefined)
        .map((_, rowIdx) => ({
          key: `row-${rowIdx}`,
          "col-0": { qText: `${rowIdx}-0`, pageRowIdx: rowIdx, pageColIdx: 0 },
          "col-1": { qText: `${rowIdx}-1`, pageRowIdx: rowIdx, pageColIdx: 1 },
        })) as unknown as Row[];

      const state = (gridState as React.MutableRefObject<GridState>).current;
      state.overscanRowStartIndex = 0;
      state.overscanRowStopIndex = rowCount;

      const { result } = renderHook(() => useDynamicRowHeight(props), { wrapper });

      act(() => result.current.resizeVisibleCells(rows));

      await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(rows.length));
      await waitFor(() => expect(result.current.rowMeta.current.heights).toEqual(Array(rowCount).fill(25)));
      await waitFor(() => expect(result.current.rowMeta.current.totalHeight).toEqual(25 * rowCount));
      await waitFor(() => expect(result.current.estimatedRowHeight).toEqual(25));
    });

    test("should handle when rows and size of layout is not in sync", async () => {
      const rows = Array(rowCount)
        .fill(undefined)
        .map((_, rowIdx) => ({
          key: `row-${rowIdx}`,
          "col-0": { qText: `${rowIdx}-0`, pageRowIdx: rowIdx, pageColIdx: 0 },
          "col-1": { qText: `${rowIdx}-1`, pageRowIdx: rowIdx, pageColIdx: 1 },
        })) as unknown as Row[];

      const state = (gridState as React.MutableRefObject<GridState>).current;
      state.overscanRowStartIndex = 0;
      state.overscanRowStopIndex = rowCount;

      const qcy = 2;
      layout = generateLayout(1, 1, qcy);

      const { result } = renderHook(() => useDynamicRowHeight(props), { wrapper });

      act(() => result.current.resizeVisibleCells(rows));

      await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(qcy));
      await waitFor(() => expect(result.current.rowMeta.current.heights).toEqual(Array(qcy).fill(25)));
      await waitFor(() => expect(result.current.rowMeta.current.totalHeight).toEqual(25 * qcy));
      await waitFor(() => expect(result.current.estimatedRowHeight).toEqual(25));
    });

    test("should not update cell heights when grid state is undefined", async () => {
      const rows = Array(rowCount)
        .fill(undefined)
        .map((_, rowIdx) => ({
          key: `row-${rowIdx}`,
          "col-0": { qText: `${rowIdx}-0`, pageRowIdx: rowIdx, pageColIdx: 0 },
          "col-1": { qText: `${rowIdx}-1`, pageRowIdx: rowIdx, pageColIdx: 1 },
        })) as unknown as Row[];

      props.gridState = undefined;

      const { result } = renderHook(() => useDynamicRowHeight(props), { wrapper });

      act(() => result.current.setCellSize("123456789", 0, 0));
      act(() => result.current.resizeVisibleCells(rows));

      await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(1));
      await waitFor(() => expect(result.current.rowMeta.current.heights).toEqual([25]));
    });
  });

  describe("reset row meta", () => {
    test("should reset row meta when layout is updated", async () => {
      const { result, rerender } = renderHook((p) => useDynamicRowHeight(p), { initialProps: props, wrapper });

      act(() => result.current.setCellSize("123456789", 0, 0));

      await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(1));
      act(() => {
        layout = { ...layout };
        rerender({ ...props });
      });

      await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(0));
    });

    test("should reset row meta when page info is updated", async () => {
      const { result, rerender } = renderHook((p) => useDynamicRowHeight(p), { initialProps: props, wrapper });

      act(() => result.current.setCellSize("123456789", 0, 0));

      await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(1));
      act(() => {
        rerender({ ...props, pageInfo: { ...pageInfo } });
      });

      await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(0));
    });
  });

  describe("resize all cells", () => {
    test("should resize all cells when width is updated", async () => {
      const { result, rerender } = renderHook((p) => useDynamicRowHeight(p), { initialProps: props, wrapper });

      act(() => result.current.setCellSize("123456789", 0, 0));

      await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(1));
      act(() => {
        rect = { ...rect };
        rerender({ ...props });
      });

      await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(1));
    });

    test("should resize all cells when style is updated", async () => {
      const { result, rerender } = renderHook((p) => useDynamicRowHeight(p), { initialProps: props, wrapper });

      act(() => result.current.setCellSize("123456789", 0, 0));

      await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(1));

      act(() => {
        props.style = { ...style, fontSize: "20px" };
        rerender({ ...props });
      });

      await waitFor(() => expect(result.current.rowMeta.current.count).toEqual(1));
    });
  });
});
