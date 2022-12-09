import { act, renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import { Cell, Column, PageInfo, Row, TableLayout } from '../../../../../types';
import { generateDataPages, generateLayout } from '../../../../../__test__/generate-test-data';
import useInfiniteScrollData, { UseInfiniteScrollData } from '../use-infinite-scroll-data';

describe('useInfiniteScrollData', () => {
  let model: EngineAPI.IGenericObject;
  let layout: TableLayout;
  let pageInfo: PageInfo;
  let columns: Column[];
  let renderHookResult: RenderHookResult<UseInfiniteScrollData, unknown>;

  beforeEach(() => {
    layout = generateLayout(1, 1, 5);

    pageInfo = {
      page: 0,
      rowsPerPage: 20,
      rowsPerPageOptions: [],
    };

    model = {
      getHyperCubeData: jest.fn() as jest.MockedFunction<() => Promise<EngineAPI.INxPivotPage[]>>,
    } as unknown as EngineAPI.IGenericObject;

    (model.getHyperCubeData as jest.Mock).mockResolvedValue(generateDataPages(1, 1));

    columns = [{ isDim: false, isLocked: false } as Column];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should load initial data and update rowsInPage', async () => {
    await act(async () => {
      renderHookResult = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns));
    });

    const { result } = renderHookResult;

    const expectedRows: Row[] = [
      {
        'col-0': {
          colIdx: 0,
          isLastRow: false,
          isSelectable: false,
          pageColIdx: 0,
          pageRowIdx: 0,
          qText: '0',
          rowIdx: 0,
        } as Cell,
        key: 'row-0',
      },
    ];

    await waitFor(() => expect(result.current.rowsInPage).toEqual(expectedRows));
  });

  // test('should insert row data at correct index based on current page', async () => {
  //   // Load data on the second page, for test purpose only load 1 row of data
  //   pageInfo = { ...pageInfo, page: 1 };
  //   await act(async () => {
  //     renderHookResult = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns));
  //   });

  //   const { result } = renderHookResult;

  //   const expectedRows: Row[] = [
  //     {
  //       'col-0': {
  //         colIdx: 0,
  //         isLastRow: false,
  //         isSelectable: false,
  //         pageColIdx: 0,
  //         pageRowIdx: 0,
  //         qText: '0',
  //         rowIdx: 1,
  //       } as Cell,
  //       key: 'row-0',
  //     },
  //   ];

  //   await waitFor(() => expect(result.current.rowsInPage).toEqual(expectedRows));
  // });

  test('should reset rowsInPage when pageInfo changes', async () => {
    await act(async () => {
      renderHookResult = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns));
    });

    const { rerender } = renderHookResult;

    await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(1));

    pageInfo = { ...pageInfo, page: 1 };
    await act(async () => {
      rerender({ model, layout, pageInfo });
    });

    await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(2));
  });

  test('should reset rowsInPage when layout changes', async () => {
    await act(async () => {
      renderHookResult = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns));
    });

    const { rerender } = renderHookResult;

    await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(1));

    layout = { ...layout };
    await act(async () => {
      rerender({ model, layout, pageInfo });
    });

    await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(2));
  });

  describe('should set correct state for isSelectable', () => {
    test('when column is a dimension and not locked', async () => {
      columns = [{ isDim: true, isLocked: false } as Column];
      await act(async () => {
        renderHookResult = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns));
      });

      const { result } = renderHookResult;

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(true));
    });

    test('when column is a dimension and is locked', async () => {
      columns = [{ isDim: true, isLocked: true } as Column];
      await act(async () => {
        renderHookResult = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns));
      });

      const { result } = renderHookResult;

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(false));
    });

    test('when column is a measure', async () => {
      columns = [{ isDim: false, isLocked: false } as Column];
      await act(async () => {
        renderHookResult = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns));
      });

      const { result } = renderHookResult;

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(false));
    });
  });
});
