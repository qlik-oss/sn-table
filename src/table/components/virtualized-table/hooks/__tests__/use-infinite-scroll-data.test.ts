import { renderHook, waitFor, act } from '@testing-library/react';
import { Cell, PageInfo, Row, TableLayout } from '../../../../../types';
import { generateDataPages, generateLayout } from '../../../../../__test__/generate-test-data';
import useInfiniteScrollData, { UseInfiniteScrollData } from '../use-infinite-scroll-data';

describe('useInfiniteScrollData', () => {
  let model: EngineAPI.IGenericObject;
  let layout: TableLayout;
  let pageInfo: PageInfo;

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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should load initial data and update rowsInPage', async () => {
    let result: {
      current: UseInfiniteScrollData;
    };
    await act(async () => {
      ({ result } = renderHook(() => useInfiniteScrollData(model, layout, pageInfo, 1, 1)));
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
  //   const { result } = renderHook(() => useInfiniteScrollData(model, layout, pageInfo));
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
  //   const { result, rerender } = renderHook(() => useInfiniteScrollData(model, layout, pageInfo));
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

  //   pageInfo = { ...pageInfo };
  //   rerender({ model, layout, pageInfo });

  //   await waitFor(() => expect(result.current.rowsInPage).toEqual([]));
  // });

  // test('should reset rowsInPage when layout changes', async () => {
  //   const { result, rerender } = renderHook(() => useInfiniteScrollData(model, layout, pageInfo));
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

  //   layout = { ...layout };
  //   rerender({ model, layout, pageInfo });

  //   await waitFor(() => expect(result.current.rowsInPage).toEqual([]));
  // });
});
