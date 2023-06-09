import { renderHook } from '@testing-library/react';
import { PageInfo, TableLayout, ViewService } from '../../../../types';
import { COLUMN_DATA_BUFFER_SIZE, MAX_PAGE_SIZE, ROW_DATA_BUFFER_SIZE } from '../../constants';
import { GridState } from '../../types';
import { LoadData } from '../use-data';
import useItemsRendererHandler, { ItemsHandlerProps, OnItemsRendered } from '../use-items-rendered-handler';
import { ScrollDirection } from '../use-scroll-direction';

describe('', () => {
  let layout: TableLayout;
  let loadRows: jest.Mock<LoadData>;
  let loadColumns: jest.Mock<LoadData>;
  let verticalScrollDirection: React.MutableRefObject<ScrollDirection>;
  let horizontalScrollDirection: React.MutableRefObject<ScrollDirection>;
  let rowCount: number;
  let pageInfo: PageInfo;
  let itemsHandlerProps: ItemsHandlerProps;
  let onItemsRendered: OnItemsRendered;
  let gridState: React.MutableRefObject<GridState>;
  let viewService: ViewService;

  beforeEach(() => {
    layout = {
      qHyperCube: {
        qSize: {
          qcx: 100,
          qcy: 200,
        },
      },
    } as TableLayout;

    gridState = {
      current: {
        overscanColumnStartIndex: 0,
        overscanRowStartIndex: 0,
        overscanColumnStopIndex: 0,
        overscanRowStopIndex: 0,
      },
    };

    loadRows = jest.fn();
    loadColumns = jest.fn();
    viewService = { qTop: 0, qHeight: 1, scrollLeft: 0 };

    verticalScrollDirection = { current: ScrollDirection.None };
    horizontalScrollDirection = { current: ScrollDirection.None };
    rowCount = 200;
    pageInfo = { page: 0, rowsPerPage: MAX_PAGE_SIZE, rowsPerPageOptions: [] };

    itemsHandlerProps = {
      layout,
      loadRows,
      loadColumns,
      verticalScrollDirection,
      horizontalScrollDirection,
      rowCount,
      pageInfo,
      gridState,
      viewService,
    };

    onItemsRendered = {
      overscanColumnStartIndex: 0,
      overscanColumnStopIndex: 10,
      overscanRowStartIndex: 0,
      overscanRowStopIndex: 10,
      visibleColumnStartIndex: 0,
      visibleColumnStopIndex: 10,
      visibleRowStartIndex: 0,
      visibleRowStopIndex: 10,
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should not fetch data when at start position', () => {
    onItemsRendered.overscanRowStartIndex = 0;
    onItemsRendered.overscanColumnStartIndex = 0;
    const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

    result.current(onItemsRendered);

    expect(loadRows).toHaveBeenCalledTimes(0);
    expect(loadColumns).toHaveBeenCalledTimes(0);
  });

  test('should update grid state', () => {
    onItemsRendered.overscanRowStartIndex = 1;
    onItemsRendered.overscanColumnStartIndex = 2;
    const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

    result.current(onItemsRendered);

    expect(gridState.current.overscanRowStartIndex).toBe(1);
    expect(gridState.current.overscanColumnStartIndex).toBe(2);
  });

  test('should not fetch data when row start index is larger than row count', () => {
    onItemsRendered.overscanRowStartIndex = 1000;
    rowCount = 10;
    const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

    result.current(onItemsRendered);

    expect(loadRows).toHaveBeenCalledTimes(0);
    expect(loadColumns).toHaveBeenCalledTimes(0);
  });

  test('should not fetch data scroll direction is not set', () => {
    verticalScrollDirection.current = ScrollDirection.None;
    horizontalScrollDirection.current = ScrollDirection.None;
    onItemsRendered.overscanRowStartIndex = 1;
    onItemsRendered.overscanColumnStartIndex = 1;
    const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

    result.current(onItemsRendered);

    expect(loadRows).toHaveBeenCalledTimes(0);
    expect(loadColumns).toHaveBeenCalledTimes(0);
  });

  describe('ScrollDirection.Down', () => {
    test('should load rows with buffer', () => {
      verticalScrollDirection.current = ScrollDirection.Down;
      onItemsRendered.overscanRowStartIndex = 100;
      onItemsRendered.overscanRowStopIndex = onItemsRendered.overscanRowStartIndex + 10;
      const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

      result.current(onItemsRendered);

      expect(loadRows).toHaveBeenCalledWith(0, onItemsRendered.overscanRowStartIndex, 11, 11 + ROW_DATA_BUFFER_SIZE);
    });

    test('should not call load rows with too large height', () => {
      verticalScrollDirection.current = ScrollDirection.Down;
      onItemsRendered.overscanRowStartIndex = rowCount - ROW_DATA_BUFFER_SIZE - 9; // 200 - 25 - 9 = 166
      onItemsRendered.overscanRowStopIndex = onItemsRendered.overscanRowStartIndex + 10; // 166 + 10 = 176
      const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

      result.current(onItemsRendered);

      expect(loadRows).toHaveBeenCalledWith(0, onItemsRendered.overscanRowStartIndex, 11, ROW_DATA_BUFFER_SIZE + 9);
    });
  });

  describe('ScrollDirection.Up', () => {
    test('should load rows with buffer', () => {
      verticalScrollDirection.current = ScrollDirection.Up;
      onItemsRendered.overscanRowStartIndex = 100;
      onItemsRendered.overscanRowStopIndex = onItemsRendered.overscanRowStartIndex + 10;
      const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

      result.current(onItemsRendered);

      expect(loadRows).toHaveBeenCalledWith(
        0,
        onItemsRendered.overscanRowStartIndex - ROW_DATA_BUFFER_SIZE,
        11,
        11 + ROW_DATA_BUFFER_SIZE
      );
    });

    test('should not call load rows with a qTop value of less than 0', () => {
      verticalScrollDirection.current = ScrollDirection.Up;
      onItemsRendered.overscanRowStartIndex = ROW_DATA_BUFFER_SIZE - 1;
      onItemsRendered.overscanRowStopIndex = onItemsRendered.overscanRowStartIndex + 10;
      const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

      result.current(onItemsRendered);

      expect(loadRows).toHaveBeenCalledWith(0, 0, 11, 11 + ROW_DATA_BUFFER_SIZE);
    });
  });

  describe('ScrollDirection.Right', () => {
    test('should load columns with buffer', () => {
      horizontalScrollDirection.current = ScrollDirection.Right;
      onItemsRendered.overscanColumnStartIndex = 50;
      onItemsRendered.overscanColumnStopIndex = onItemsRendered.overscanColumnStartIndex + 10;
      const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

      result.current(onItemsRendered);

      expect(loadColumns).toHaveBeenCalledWith(
        onItemsRendered.overscanColumnStartIndex,
        0,
        11 + COLUMN_DATA_BUFFER_SIZE,
        11
      );
    });

    test('should not call load columns with too large width', () => {
      horizontalScrollDirection.current = ScrollDirection.Right;
      onItemsRendered.overscanColumnStartIndex = layout.qHyperCube.qSize.qcx - COLUMN_DATA_BUFFER_SIZE - 9; // 86
      onItemsRendered.overscanColumnStopIndex = onItemsRendered.overscanColumnStartIndex + 10; // 96
      const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

      result.current(onItemsRendered);

      expect(loadColumns).toHaveBeenCalledWith(onItemsRendered.overscanColumnStartIndex, 0, 14, 11);
    });
  });

  describe('ScrollDirection.Left', () => {
    test('should load columns with buffer', () => {
      horizontalScrollDirection.current = ScrollDirection.Left;
      onItemsRendered.overscanColumnStartIndex = 50;
      onItemsRendered.overscanColumnStopIndex = onItemsRendered.overscanColumnStartIndex + 10;
      const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

      result.current(onItemsRendered);

      expect(loadColumns).toHaveBeenCalledWith(
        onItemsRendered.overscanColumnStartIndex - COLUMN_DATA_BUFFER_SIZE,
        0,
        11 + COLUMN_DATA_BUFFER_SIZE,
        11
      );
    });

    test('should not call load columns with a qLeft value of less than 0', () => {
      horizontalScrollDirection.current = ScrollDirection.Left;
      onItemsRendered.overscanColumnStartIndex = COLUMN_DATA_BUFFER_SIZE - 1;
      onItemsRendered.overscanColumnStopIndex = onItemsRendered.overscanColumnStartIndex + 10;
      const { result } = renderHook(() => useItemsRendererHandler(itemsHandlerProps));

      result.current(onItemsRendered);

      expect(loadColumns).toHaveBeenCalledWith(0, 0, 11 + COLUMN_DATA_BUFFER_SIZE, 11);
    });
  });
});
