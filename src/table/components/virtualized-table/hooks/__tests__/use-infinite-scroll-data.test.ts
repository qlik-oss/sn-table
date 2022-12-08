import { act, renderHook, waitFor } from '@testing-library/react';
import { Cell, Column, PageInfo, Row, TableLayout } from '../../../../../types';
import { generateDataPages, generateLayout } from '../../../../../__test__/generate-test-data';
import useInfiniteScrollData, { UseInfiniteScrollData } from '../use-infinite-scroll-data';

interface RenderHookResult {
  current: UseInfiniteScrollData;
}

describe('useInfiniteScrollData', () => {
  let model: EngineAPI.IGenericObject;
  let layout: TableLayout;
  let pageInfo: PageInfo;
  let columns: Column[];

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
    let result: RenderHookResult;
    await act(async () => {
      ({ result } = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns)));
    });

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
  //   pageInfo.page = 1;
  //   pageInfo.rowsPerPage = 1;
  //   const { result } = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns));
  //   result.current.loadData(0, 1, 1, 1);

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

  // test('should reset rowsInPage when pageInfo changes', async () => {
  //   const { result, rerender } = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, columns));
  //   result.current.loadData(0, 0, 1, 1);

  //   const expectedRows: Row[] = [
  //     {
  //       'col-0': {
  //         colIdx: 0,
  //         isLastRow: false,
  //         isSelectable: false,
  //         pageColIdx: 0,
  //         pageRowIdx: 0,
  //         qText: '0',
  //         rowIdx: 0,
  //       } as Cell,
  //       key: 'row-0',
  //     },
  //   ];

  //   await waitFor(() => expect(result.current.rowsInPage).toEqual(expectedRows));
  // });

  // test('should reset rowsInPage when layout changes', async () => {
  //   let result: RenderHookResult;
  //   let rerender: (props?: unknown) => void;

  //   await act(async () => {
  //     ({ result, rerender } = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns)));
  //   });

  //   const expectedRows: Row[] = [
  //     {
  //       'col-0': {
  //         colIdx: 0,
  //         isLastRow: false,
  //         isSelectable: false,
  //         pageColIdx: 0,
  //         pageRowIdx: 0,
  //         qText: '0',
  //         rowIdx: 0,
  //       } as Cell,
  //       key: 'row-0',
  //     },
  //   ];

  //   await waitFor(() => expect(result.current.rowsInPage).toEqual(expectedRows));

  //   layout = { ...layout };
  //   rerender({ model, layout, pageInfo });

  //   await waitFor(() => expect(result.current.rowsInPage).toEqual([]));
  // });

  describe('should set correct state for isSelectable', () => {
    test('when column is a dimension and not locked', async () => {
      columns = [{ isDim: true, isLocked: false } as Column];
      let result: RenderHookResult;
      await act(async () => {
        ({ result } = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns)));
      });

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(true));
    });

    test('when column is a dimension and is locked', async () => {
      columns = [{ isDim: true, isLocked: true } as Column];
      let result: RenderHookResult;
      await act(async () => {
        ({ result } = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns)));
      });

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(false));
    });

    test('when column is a measure', async () => {
      columns = [{ isDim: false, isLocked: false } as Column];
      let result: RenderHookResult;
      await act(async () => {
        ({ result } = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1, columns)));
      });

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(false));
    });
  });
});
