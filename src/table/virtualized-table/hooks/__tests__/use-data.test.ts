import { act, renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import { Cell, Column, ExtendedTheme, PageInfo, Row, TableLayout } from '../../../../types';
import { generateDataPages, generateLayout } from '../../../../__test__/generate-test-data';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../../constants';
import { SetCellSize, GridState } from '../../types';
import useData, { UseData } from '../use-data';

interface OverrideUseDataProps {
  model?: EngineAPI.IGenericObject;
  layout?: TableLayout;
  pageInfo?: PageInfo;
  rowCount?: number;
  visibleRowCount?: number;
  visibleColumnCount?: number;
  columns?: Column[];
  initialDataPages?: EngineAPI.INxDataPage[];
}

function generateDataPage(page: EngineAPI.INxPage) {
  return generateDataPages(page.qHeight, page.qWidth, page.qLeft, page.qTop)[0];
}

describe('useData', () => {
  const QCY = 1000;
  const QCX = 100;
  const VISIBLE_ROW_COUNT = 1;
  const VISIBLE_COLUMN_COUNT = 1;
  const INIT_DATA_FETCH_HEIGHT = VISIBLE_ROW_COUNT + ROW_DATA_BUFFER_SIZE;
  const INIT_DATA_FETCH_WIDTH = VISIBLE_COLUMN_COUNT + COLUMN_DATA_BUFFER_SIZE;
  let model: EngineAPI.IGenericObject;
  let layout: TableLayout;
  let pageInfo: PageInfo;
  let columns: Column[];
  let renderHookResult: RenderHookResult<UseData, unknown>;
  let doRenderHook: (renderWithProps?: OverrideUseDataProps) => Promise<void>;
  let setCellSizeMock: jest.MockedFunction<SetCellSize>;
  let gridState: React.MutableRefObject<GridState>;
  let initialDataPages: EngineAPI.INxDataPage[];
  const theme = {
    getColorPickerColor: () => undefined,
    name: () => undefined,
    getStyle: () => undefined,
    background: { isDark: false },
  } as unknown as ExtendedTheme;

  beforeEach(() => {
    layout = generateLayout(1, 1, QCY);
    layout.qHyperCube.qSize.qcx = QCX;
    initialDataPages = generateDataPages(
      INIT_DATA_FETCH_HEIGHT,
      INIT_DATA_FETCH_WIDTH
    ) as unknown as EngineAPI.INxDataPage[];

    gridState = {
      current: {
        overscanColumnStartIndex: 0,
        overscanRowStartIndex: 0,
        overscanColumnStopIndex: 0,
        overscanRowStopIndex: 0,
      },
    };

    pageInfo = {
      page: 0,
      rowsPerPage: QCY / 2,
      rowsPerPageOptions: [],
    };

    model = {
      getHyperCubeData: jest.fn() as jest.MockedFunction<() => Promise<EngineAPI.INxPivotPage[]>>,
    } as unknown as EngineAPI.IGenericObject;

    (model.getHyperCubeData as jest.Mock).mockImplementation((path, pages: EngineAPI.INxPage[]) =>
      Promise.resolve(pages.map(generateDataPage))
    );

    columns = Array(QCX)
      .fill(undefined)
      .map((_, colIdx) => ({ isDim: false, isLocked: false, id: `col-${colIdx}`, colIdx } as Column));

    setCellSizeMock = jest.fn() as jest.MockedFunction<SetCellSize>;

    doRenderHook = (renderWithProps: OverrideUseDataProps = {}) => {
      return act(async () => {
        renderHookResult = renderHook(() =>
          useData({
            layout: renderWithProps.layout ?? layout,
            model: renderWithProps.model ?? model,
            theme,
            initialDataPages: renderWithProps.initialDataPages ?? initialDataPages,
            pageInfo: renderWithProps.pageInfo ?? pageInfo,
            rowCount: renderWithProps.rowCount ?? pageInfo.rowsPerPage,
            visibleRowCount: renderWithProps.visibleRowCount ?? VISIBLE_ROW_COUNT,
            visibleColumnCount: renderWithProps.visibleColumnCount ?? VISIBLE_COLUMN_COUNT,
            columns: renderWithProps.columns ?? columns,
            setCellSize: setCellSizeMock,
            gridState,
          })
        );
      });
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('loadRows', () => {
    test('should load rows', async () => {
      const rowIdx = INIT_DATA_FETCH_HEIGHT; // row index for the last row from initial data fetch is (INIT_DATA_FETCH_HEIGHT - 1)
      await doRenderHook();
      const { result } = renderHookResult;

      // Verify that the row we and to load does not already exist
      await waitFor(() => expect(result.current.rowsInPage).toHaveLength(pageInfo.rowsPerPage));
      await waitFor(() => expect(result.current.rowsInPage[rowIdx]).toBeUndefined());

      await act(async () => result.current.loadRows(0, rowIdx, 2, 1));

      const expectedRow: Row = {
        'col-0': {
          colIdx: 0,
          isLastColumn: false,
          isLastRow: false,
          isSelectable: false,
          pageColIdx: 0,
          pageRowIdx: rowIdx,
          qText: '0',
          rowIdx,
          isNumeric: false,
        } as Cell,
        'col-1': {
          colIdx: 1,
          isLastColumn: false,
          isLastRow: false,
          isSelectable: false,
          pageColIdx: 1,
          pageRowIdx: rowIdx,
          qText: '1',
          rowIdx,
          isNumeric: false,
        } as Cell,
        key: `row-${rowIdx}`,
      };

      await waitFor(() => expect(result.current.rowsInPage[rowIdx]).toEqual(expectedRow));
    });

    test('should flag last row in data set', async () => {
      pageInfo.rowsPerPage = QCY;
      const rowIdx = pageInfo.rowsPerPage - 1;
      await doRenderHook();
      const { result } = renderHookResult;

      // Verify that the row we and to load does not already exist
      await waitFor(() => expect(result.current.rowsInPage[rowIdx]).toBeUndefined());

      await act(async () => result.current.loadRows(0, rowIdx, 2, 1));

      const expectedRow: Row = {
        'col-0': {
          colIdx: 0,
          isLastColumn: false,
          isLastRow: true,
          isSelectable: false,
          pageColIdx: 0,
          pageRowIdx: rowIdx,
          qText: '0',
          rowIdx,
          isNumeric: false,
        } as Cell,
        'col-1': {
          colIdx: 1,
          isLastColumn: false,
          isLastRow: true,
          isSelectable: false,
          pageColIdx: 1,
          pageRowIdx: rowIdx,
          qText: '1',
          rowIdx,
          isNumeric: false,
        } as Cell,
        key: `row-${rowIdx}`,
      };

      await waitFor(() => expect(result.current.rowsInPage[rowIdx]).toEqual(expectedRow));
    });

    test('should not fetch row that is already loaded', async () => {
      await doRenderHook();
      const { result } = renderHookResult;

      await act(async () => {
        // Attempt to fetch the same page as the initial data load
        result.current.loadRows(0, 0, 1, 1);
      });

      await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(0));
    });
  });

  describe('loadColumns', () => {
    test('should load columns', async () => {
      const colIdx = INIT_DATA_FETCH_WIDTH;
      await doRenderHook();
      const { result } = renderHookResult;

      // Verify that the column we and to load does not already exist
      await waitFor(() => expect(result.current.rowsInPage[0][`col-${colIdx}`]).toBeUndefined());

      await act(async () => {
        result.current.loadColumns(colIdx, 0, 1, 1);
      });

      const expectedCell = {
        colIdx,
        isLastRow: false,
        isLastColumn: false,
        isSelectable: false,
        pageColIdx: colIdx,
        pageRowIdx: 0,
        qText: '0',
        rowIdx: 0,
        isNumeric: false,
      } as Cell;

      await waitFor(() => expect(result.current.rowsInPage[0][`col-${colIdx}`]).toEqual(expectedCell));
    });

    test('should flag last column', async () => {
      const colIdx = QCX - 1;
      await doRenderHook();
      const { result } = renderHookResult;

      // Verify that the column we and to load does not already exist
      await waitFor(() => expect(result.current.rowsInPage[0][`col-${colIdx}`]).toBeUndefined());

      await act(async () => {
        result.current.loadColumns(colIdx, 0, 1, 1);
      });

      const expectedCell = {
        colIdx,
        isLastRow: false,
        isLastColumn: true,
        isSelectable: false,
        pageColIdx: colIdx,
        pageRowIdx: 0,
        qText: '0',
        rowIdx: 0,
        isNumeric: false,
      } as Cell;

      await waitFor(() => expect(result.current.rowsInPage[0][`col-${colIdx}`]).toEqual(expectedCell));
    });

    test('should not fetch column that is already loaded', async () => {
      await doRenderHook();
      const { result } = renderHookResult;

      await act(async () => {
        // Attempt to fetch the same page as the initial data load
        result.current.loadColumns(0, 0, 1, 1);
      });

      await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(0));
    });
  });

  describe('inital data load', () => {
    test('should not load additional data given layout includes visible and buffer rows', async () => {
      await doRenderHook();

      await waitFor(() => expect(model.getHyperCubeData).toHaveBeenCalledTimes(0));
    });

    test('should load additional data given initial data pages does not include visible and buffer rows', async () => {
      initialDataPages = generateDataPages(
        INIT_DATA_FETCH_HEIGHT - 1,
        INIT_DATA_FETCH_WIDTH
      ) as unknown as EngineAPI.INxDataPage[];

      await doRenderHook({ initialDataPages });

      await waitFor(() =>
        expect(model.getHyperCubeData).toHaveBeenNthCalledWith(1, '/qHyperCubeDef', [
          { qHeight: 1, qLeft: 0, qTop: INIT_DATA_FETCH_HEIGHT - 1, qWidth: 6 },
        ])
      );
    });

    test('should derive data from init data pages updates', async () => {
      await doRenderHook();

      await waitFor(() => expect(renderHookResult.result.current.rowsInPage).toHaveLength(QCY / 2));

      layout = generateLayout(1, 1, 10);
      layout.qHyperCube.qSize.qcx = 10;
      initialDataPages = generateDataPages(10, 10) as unknown as EngineAPI.INxDataPage[];

      pageInfo = {
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: [],
      };

      const { rerender } = renderHookResult;

      await act(() => rerender({ layout, pageInfo, initialDataPages }));

      await waitFor(() => expect(renderHookResult.result.current.rowsInPage).toHaveLength(10));
    });

    test('should handle when data can not be derived from the initial data pages', async () => {
      // This would be the case with an sn-table already created before this feature became available
      initialDataPages = [];

      await doRenderHook({ initialDataPages });

      // As the data cannot be derived, it needs to be fetched
      await waitFor(() =>
        expect(model.getHyperCubeData).toHaveBeenNthCalledWith(1, '/qHyperCubeDef', [
          { qHeight: 26, qLeft: 0, qTop: 0, qWidth: 6 },
        ])
      );
      await waitFor(() => expect(renderHookResult.result.current.rowsInPage).toHaveLength(pageInfo.rowsPerPage));
    });

    test('should load initial data and update rowsInPage', async () => {
      await doRenderHook();
      const { result } = renderHookResult;

      await waitFor(() => {
        Array(INIT_DATA_FETCH_HEIGHT)
          .fill(undefined)
          .forEach((_, rowIdx) => {
            expect(result.current.rowsInPage[rowIdx]?.key).toEqual(`row-${rowIdx}`);
          });
      });
      await waitFor(() => expect(result.current.rowsInPage[INIT_DATA_FETCH_HEIGHT]).toBeUndefined());
    });

    test('should insert row data at correct index based on current page', async () => {
      // Load data on the second page, for test purpose only load 1 row of data
      pageInfo = { ...pageInfo, page: 1 };
      await doRenderHook({ pageInfo });

      const { result } = renderHookResult;

      const expectedCell = {
        colIdx: 0,
        isLastRow: false,
        isLastColumn: false,
        isSelectable: false,
        pageColIdx: 0,
        pageRowIdx: 0,
        qText: '0',
        rowIdx: 500,
        isNumeric: false,
      } as Cell;

      await waitFor(() => expect(result.current.rowsInPage[0]['col-0']).toEqual(expectedCell));
      await waitFor(() => {
        Array(VISIBLE_ROW_COUNT + ROW_DATA_BUFFER_SIZE)
          .fill(undefined)
          .forEach((_, rowIdx) => {
            expect(result.current.rowsInPage[rowIdx]?.key).toEqual(`row-${rowIdx}`);
          });
      });
    });

    test('should set correct column index', async () => {
      columns[0].colIdx = 3;
      await doRenderHook({ columns });

      const { result } = renderHookResult;

      await waitFor(() => {
        const cell = result.current.rowsInPage[0]['col-0'] as Cell;
        expect(cell.colIdx).toEqual(columns[0].colIdx);
      });
    });
  });

  describe('should set correct state for isSelectable', () => {
    test('when column is a dimension and not locked', async () => {
      columns[0].isDim = true;
      columns[0].isLocked = false;
      await doRenderHook({ columns });

      const { result } = renderHookResult;

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(true));
    });

    test('when column is a dimension and is locked', async () => {
      columns[0].isDim = true;
      columns[0].isLocked = true;
      await doRenderHook({ columns });

      const { result } = renderHookResult;

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(false));
    });

    test('when column is a measure', async () => {
      columns[0].isDim = false;
      columns[0].isLocked = false;
      await doRenderHook({ columns });

      const { result } = renderHookResult;

      await waitFor(() => expect((result.current.rowsInPage[0]['col-0'] as Cell).isSelectable).toBe(false));
    });
  });
});
