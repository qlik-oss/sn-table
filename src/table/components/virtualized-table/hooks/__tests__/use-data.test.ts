import { act, renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import { Cell, Column, PageInfo, Row, TableLayout } from '../../../../../types';
import { generateDataPages, generateLayout } from '../../../../../__test__/generate-test-data';
import useData, { UseData } from '../use-data';

interface OverrideUseDataProps {
  model?: EngineAPI.IGenericObject;
  layout?: TableLayout;
  pageInfo?: PageInfo;
  visibleRowCount?: number;
  visibleColumnCount?: number;
  columns?: Column[];
}

function generateDataPage(page: EngineAPI.INxPage) {
  return generateDataPages(1, 1, page.qLeft, page.qTop)[0];
}

describe('useData', () => {
  let model: EngineAPI.IGenericObject;
  let layout: TableLayout;
  let pageInfo: PageInfo;
  let columns: Column[];
  let renderHookResult: RenderHookResult<UseData, unknown>;
  let doRenderHook: (renderWithProps?: OverrideUseDataProps) => Promise<undefined>;

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

    (model.getHyperCubeData as jest.Mock).mockImplementation((path, pages: EngineAPI.INxPage[]) =>
      Promise.resolve(pages.map(generateDataPage))
    );

    columns = [{ isDim: false, isLocked: false } as Column, { isDim: false, isLocked: false } as Column];

    doRenderHook = (renderWithProps: OverrideUseDataProps = {}) => {
      return act(async () => {
        renderHookResult = renderHook(() =>
          useData(
            renderWithProps.model ?? model,
            renderWithProps.layout ?? layout,
            renderWithProps.pageInfo ?? pageInfo,
            renderWithProps.visibleRowCount ?? 1,
            renderWithProps.visibleColumnCount ?? 1,
            renderWithProps.columns ?? columns
          )
        );
      });
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('loadRows', () => {
    test('should load rows', async () => {
      await doRenderHook();
      const { result } = renderHookResult;

      await act(async () => {
        result.current.loadRows(0, 1, 1, 1);
      });

      const expectedRows: Row[] = [
        {
          'col-0': {
            // From initial data load
            colIdx: 0,
            isLastRow: false,
            isLastColumn: false,
            isSelectable: false,
            pageColIdx: 0,
            pageRowIdx: 0,
            qText: '0',
            rowIdx: 0,
          } as Cell,
          key: 'row-0',
        },
        {
          'col-0': {
            // From loadRows
            colIdx: 0,
            isLastRow: false,
            isLastColumn: false,
            isSelectable: false,
            pageColIdx: 0,
            pageRowIdx: 1,
            qText: '0',
            rowIdx: 1,
          } as Cell,
          key: 'row-1',
        },
      ];

      await waitFor(() => expect(result.current.rowsInPage).toEqual(expectedRows));
    });

    test('should flag last row', async () => {
      await doRenderHook();
      const { result } = renderHookResult;

      await act(async () => {
        result.current.loadRows(0, 4, 1, 1);
      });

      const expectedRow: Row = {
        'col-0': {
          colIdx: 0,
          isLastRow: true,
          isLastColumn: false,
          isSelectable: false,
          pageColIdx: 0,
          pageRowIdx: 4,
          qText: '0',
          rowIdx: 4,
        } as Cell,
        key: 'row-4',
      };

      await waitFor(() => expect(result.current.rowsInPage[4]).toEqual(expectedRow));
    });

    test('should not fetch duplicate data pages', async () => {
      await doRenderHook();
      const { result } = renderHookResult;

      await act(async () => {
        // Attempt to fetch the same page twice
        result.current.loadRows(0, 1, 1, 1);
        result.current.loadRows(0, 1, 1, 1);
      });

      await waitFor(() =>
        expect(model.getHyperCubeData).toHaveBeenLastCalledWith('/qHyperCubeDef', [
          {
            qLeft: 0,
            qTop: 1,
            qWidth: 1,
            qHeight: 1,
          },
        ])
      );
    });

    test('should not fetch row that is already loaded', async () => {
      await doRenderHook();
      const { result } = renderHookResult;

      await act(async () => {
        // Attempt to fetch the same page as the initial data load
        result.current.loadRows(0, 0, 1, 1);
      });

      await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(1)); // Only 1 call from the init data load
    });
  });

  describe('loadColumns', () => {
    test('should load columns', async () => {
      await doRenderHook();
      const { result } = renderHookResult;

      await act(async () => {
        result.current.loadColumns(1, 0, 1, 1);
      });

      const expectedRows: Row[] = [
        {
          key: 'row-0',
          'col-0': {
            // From initial data load
            colIdx: 0,
            isLastRow: false,
            isLastColumn: false,
            isSelectable: false,
            pageColIdx: 0,
            pageRowIdx: 0,
            qText: '0',
            rowIdx: 0,
          } as Cell,
          'col-1': {
            // From loadColumns
            colIdx: 1,
            isLastRow: false,
            isLastColumn: true,
            isSelectable: false,
            pageColIdx: 1,
            pageRowIdx: 0,
            qText: '0',
            rowIdx: 0,
          } as Cell,
        },
      ];

      await waitFor(() => expect(result.current.rowsInPage).toEqual(expectedRows));
    });

    test('should not fetch duplicate data pages', async () => {
      await doRenderHook();
      const { result } = renderHookResult;

      await act(async () => {
        // Attempt to fetch the same page twice
        result.current.loadColumns(1, 0, 1, 1);
        result.current.loadColumns(1, 0, 1, 1);
      });

      await waitFor(() =>
        expect(model.getHyperCubeData).toHaveBeenLastCalledWith('/qHyperCubeDef', [
          {
            qLeft: 1,
            qTop: 0,
            qWidth: 1,
            qHeight: 1,
          },
        ])
      );
    });

    test('should not fetch column that is already loaded', async () => {
      await doRenderHook();
      const { result } = renderHookResult;

      await act(async () => {
        // Attempt to fetch the same page as the initial data load
        result.current.loadColumns(0, 0, 1, 1);
      });

      await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(1)); // Only 1 call from the init data load
    });
  });

  describe('inital data load', () => {
    test('should load initial data and update rowsInPage', async () => {
      await doRenderHook();
      const { result } = renderHookResult;

      const expectedRows: Row[] = [
        {
          'col-0': {
            colIdx: 0,
            isLastRow: false,
            isLastColumn: false,
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

    test('should insert row data at correct index based on current page', async () => {
      // Load data on the second page, for test purpose only load 1 row of data
      pageInfo = { ...pageInfo, page: 1 };
      await doRenderHook({ pageInfo });

      const { result } = renderHookResult;

      const expectedRows: Row[] = [
        {
          'col-0': {
            colIdx: 0,
            isLastRow: false,
            isLastColumn: false,
            isSelectable: false,
            pageColIdx: 0,
            pageRowIdx: 0,
            qText: '0',
            rowIdx: 20,
          } as Cell,
          key: 'row-0',
        },
      ];

      await waitFor(() => expect(result.current.rowsInPage).toEqual(expectedRows));
    });

    test('should reset rowsInPage when pageInfo changes', async () => {
      await doRenderHook();
      const { rerender } = renderHookResult;

      await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(1));

      pageInfo = { ...pageInfo, page: 1 };
      await act(async () => {
        rerender({ model, layout, pageInfo });
      });

      await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(2));
    });

    test('should reset rowsInPage when layout changes', async () => {
      await doRenderHook();
      const { rerender } = renderHookResult;

      await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(1));

      layout = { ...layout };
      await act(async () => {
        rerender({ model, layout, pageInfo });
      });

      await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(2));
    });
  });

  describe('should set correct state for isSelectable', () => {
    test('when column is a dimension and not locked', async () => {
      columns = [{ isDim: true, isLocked: false } as Column];
      await doRenderHook({ columns });

      const { result } = renderHookResult;

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(true));
    });

    test('when column is a dimension and is locked', async () => {
      columns = [{ isDim: true, isLocked: true } as Column];
      await doRenderHook({ columns });

      const { result } = renderHookResult;

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(false));
    });

    test('when column is a measure', async () => {
      columns = [{ isDim: false, isLocked: false } as Column];
      await doRenderHook({ columns });

      const { result } = renderHookResult;

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(false));
    });
  });
});
