import { useCallback } from 'react';
import { PageInfo, TableLayout } from '../../../../types';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../constants';
import { LoadDataByRows } from './use-infinite-scroll-data';
import { ScrollDirection } from './use-scroll-direction';

interface OnItemsRendered {
  overscanColumnStartIndex: number;
  overscanColumnStopIndex: number;
  overscanRowStartIndex: number;
  overscanRowStopIndex: number;
  visibleColumnStartIndex: number;
  visibleColumnStopIndex: number;
  visibleRowStartIndex: number;
  visibleRowStopIndex: number;
}

interface ItemsHandlerProps {
  layout: TableLayout;
  loadDataByRows: LoadDataByRows;
  loadDataByColumns: LoadDataByRows;
  scrollDirection: React.MutableRefObject<ScrollDirection>;
  rowCount: number;
  pageInfo: PageInfo;
}

const useItemsRendererHandler = ({
  layout,
  loadDataByRows,
  loadDataByColumns,
  scrollDirection,
  rowCount,
  pageInfo,
}: ItemsHandlerProps) => {
  const handleItemsRendered = useCallback(
    async ({
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex,
    }: OnItemsRendered) => {
      if (overscanRowStartIndex === 0 && overscanColumnStartIndex === 0) {
        // This case should handled by the initial data load
        return;
      }

      if (overscanRowStartIndex > rowCount) {
        // Safe guard against when a new page is loaded and the user have scrolled on the previously loaded page.
        // In such case overscanRowStartIndex could be larger than the actual amount of rows available
        return;
      }

      const qLeft = overscanColumnStartIndex;
      const qTop = overscanRowStartIndex + pageInfo.page * pageInfo.rowsPerPage;
      const qWidth = overscanColumnStopIndex - overscanColumnStartIndex + 1;
      const qHeight = overscanRowStopIndex - overscanRowStartIndex + 1;

      // Load data for visiable grid
      await loadDataByRows(qLeft, qTop, qWidth, qHeight);

      // Load data for buffer grid
      switch (scrollDirection.current) {
        case ScrollDirection.Down:
          await loadDataByRows(qLeft, overscanRowStopIndex, qWidth, ROW_DATA_BUFFER_SIZE);
          break;
        case ScrollDirection.Up: {
          const cappedTop = Math.max(0, pageInfo.page * pageInfo.rowsPerPage, qTop - ROW_DATA_BUFFER_SIZE);
          await loadDataByRows(qLeft, cappedTop, qWidth, ROW_DATA_BUFFER_SIZE);
          break;
        }
        case ScrollDirection.Right: {
          const startLeft = qLeft + COLUMN_DATA_BUFFER_SIZE;
          const cappedWidth = Math.min(
            COLUMN_DATA_BUFFER_SIZE,
            layout.qHyperCube.qSize.qcx - qLeft + COLUMN_DATA_BUFFER_SIZE
          );
          await loadDataByColumns(startLeft, qTop, cappedWidth, qHeight);
          break;
        }
        case ScrollDirection.Left: {
          const cappedLeft = Math.max(0, qLeft - COLUMN_DATA_BUFFER_SIZE);
          await loadDataByColumns(cappedLeft, qTop, COLUMN_DATA_BUFFER_SIZE, qHeight);
          break;
        }
        default:
          break;
      }
    },
    [pageInfo, loadDataByRows, loadDataByColumns, scrollDirection, rowCount, layout.qHyperCube.qSize.qcx]
  );

  return handleItemsRendered;
};

export default useItemsRendererHandler;
