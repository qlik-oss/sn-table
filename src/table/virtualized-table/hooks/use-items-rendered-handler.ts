import { useCallback } from 'react';
import { PageInfo, TableLayout, ViewService } from '../../../types';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../constants';
import { GridState } from '../types';
import { LoadData } from './use-data';
import { ScrollDirection } from './use-scroll-direction';

export interface OnItemsRendered {
  overscanColumnStartIndex: number;
  overscanColumnStopIndex: number;
  overscanRowStartIndex: number;
  overscanRowStopIndex: number;
  visibleColumnStartIndex: number;
  visibleColumnStopIndex: number;
  visibleRowStartIndex: number;
  visibleRowStopIndex: number;
}

export interface ItemsHandlerProps {
  layout: TableLayout;
  loadRows: LoadData;
  loadColumns: LoadData;
  verticalScrollDirection: React.MutableRefObject<ScrollDirection>;
  horizontalScrollDirection: React.MutableRefObject<ScrollDirection>;
  rowCount: number;
  pageInfo: PageInfo;
  gridState: React.MutableRefObject<GridState>;
  viewService: ViewService;
}

/**
 * The callback function return by this hook is called when the range of items
 * rendered by react-window changes.
 *
 * The main purpose of it, is to load data as the user scrolls. Where the "buffer" is
 * there to avoid rendering empty cells while the user is scrolling.
 */
const useItemsRendererHandler = ({
  layout,
  loadRows,
  loadColumns,
  verticalScrollDirection,
  horizontalScrollDirection,
  rowCount,
  pageInfo,
  gridState,
  viewService,
}: ItemsHandlerProps) => {
  const handleItemsRendered = useCallback(
    ({
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex,
      visibleRowStartIndex,
      visibleRowStopIndex,
      visibleColumnStartIndex,
      visibleColumnStopIndex,
    }: OnItemsRendered) => {
      gridState.current.overscanColumnStartIndex = overscanColumnStartIndex;
      gridState.current.overscanColumnStopIndex = overscanColumnStopIndex;
      gridState.current.overscanRowStartIndex = overscanRowStartIndex;
      gridState.current.overscanRowStopIndex = overscanRowStopIndex;

      if (overscanRowStartIndex > rowCount) {
        // Safe guard against when a new page is loaded and the user have scrolled on the previously loaded page.
        // In such case overscanRowStartIndex could be larger than the actual amount of rows available
        return;
      }

      const qLeft = overscanColumnStartIndex;
      const qTop = overscanRowStartIndex + pageInfo.page * pageInfo.rowsPerPage;
      const qWidth = overscanColumnStopIndex - overscanColumnStartIndex + 1;
      const qHeight = overscanRowStopIndex - overscanRowStartIndex + 1;
      viewService.visibleLeft = visibleColumnStartIndex;
      viewService.visibleWidth = visibleColumnStopIndex - visibleColumnStartIndex + 1;
      viewService.visibleTop = visibleRowStartIndex + pageInfo.page * pageInfo.rowsPerPage;
      viewService.visibleHeight = visibleRowStopIndex - visibleRowStartIndex + 1;
      viewService.page = pageInfo.page;
      viewService.rowsPerPage = pageInfo.rowsPerPage;
      console.log(
        '*****',
        overscanColumnStartIndex,
        overscanColumnStopIndex,
        overscanRowStartIndex,
        overscanRowStopIndex,
        visibleRowStartIndex,
        visibleRowStopIndex,
        visibleColumnStartIndex,
        visibleColumnStopIndex
      );

      // Load data for visible grid and buffer grid
      if (verticalScrollDirection.current === ScrollDirection.Down) {
        const buffedHeight = qHeight + ROW_DATA_BUFFER_SIZE;
        const remainingRowsOnPage = rowCount - overscanRowStartIndex;
        const cappedHeight = overscanRowStartIndex + buffedHeight > rowCount ? remainingRowsOnPage : buffedHeight;
        loadRows(qLeft, qTop, qWidth, cappedHeight);
      } else if (verticalScrollDirection.current === ScrollDirection.Up) {
        const buffedHeight = qHeight + ROW_DATA_BUFFER_SIZE;
        const qTopStartIndexForPage = pageInfo.page * pageInfo.rowsPerPage;
        const cappedTop = Math.max(qTopStartIndexForPage, qTop - ROW_DATA_BUFFER_SIZE);
        loadRows(qLeft, cappedTop, qWidth, buffedHeight);
      }

      if (horizontalScrollDirection.current === ScrollDirection.Right) {
        const remainingColumns = layout.qHyperCube.qSize.qcx - qLeft;
        const buffedWidth = qWidth + COLUMN_DATA_BUFFER_SIZE;
        const cappedWidth = Math.min(remainingColumns, buffedWidth);
        loadColumns(qLeft, qTop, cappedWidth, qHeight);
      } else if (horizontalScrollDirection.current === ScrollDirection.Left) {
        const cappedLeft = Math.max(0, qLeft - COLUMN_DATA_BUFFER_SIZE);
        const buffedWidth = Math.min(layout.qHyperCube.qSize.qcx, qWidth + COLUMN_DATA_BUFFER_SIZE);
        loadColumns(cappedLeft, qTop, buffedWidth, qHeight);
      }
    },
    [
      pageInfo,
      loadRows,
      loadColumns,
      verticalScrollDirection,
      horizontalScrollDirection,
      rowCount,
      layout.qHyperCube.qSize,
      gridState,
    ]
  );

  return handleItemsRendered;
};

export default useItemsRendererHandler;
