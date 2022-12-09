import { useCallback } from 'react';
import { PageInfo, TableLayout } from '../../../../types';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../constants';
import { LoadData } from './use-data';
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
  loadRows: LoadData;
  loadColumns: LoadData;
  verticalScrollDirection: React.MutableRefObject<ScrollDirection>;
  horizontalScrollDirection: React.MutableRefObject<ScrollDirection>;
  rowCount: number;
  pageInfo: PageInfo;
}

const useItemsRendererHandler = ({
  layout,
  loadRows,
  loadColumns,
  verticalScrollDirection,
  horizontalScrollDirection,
  rowCount,
  pageInfo,
}: ItemsHandlerProps) => {
  const handleItemsRendered = useCallback(
    ({
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

      // Load data for visible grid and buffer grid
      switch (verticalScrollDirection.current) {
        case ScrollDirection.Down: {
          const buffedHeight = qHeight + ROW_DATA_BUFFER_SIZE;
          const remainingRowsOnPage = rowCount - overscanRowStartIndex;
          const cappedHeight = overscanRowStartIndex + buffedHeight > rowCount ? remainingRowsOnPage : buffedHeight;
          loadRows(qLeft, qTop, qWidth, cappedHeight);
          break;
        }

        case ScrollDirection.Up: {
          const buffedHeight = qHeight + ROW_DATA_BUFFER_SIZE;
          const qTopStartIndexForPage = pageInfo.page * pageInfo.rowsPerPage;
          const cappedTop = Math.max(qTopStartIndexForPage, qTop - ROW_DATA_BUFFER_SIZE);
          loadRows(qLeft, cappedTop, qWidth, buffedHeight);
          break;
        }
        default:
          break;
      }

      switch (horizontalScrollDirection.current) {
        case ScrollDirection.Right: {
          const remainingColumns = layout.qHyperCube.qSize.qcx - qLeft;
          const buffedWidth = qWidth + COLUMN_DATA_BUFFER_SIZE;
          const cappedWidth = Math.min(remainingColumns, buffedWidth);
          loadColumns(qLeft, qTop, cappedWidth, qHeight);
          break;
        }

        case ScrollDirection.Left: {
          const cappedLeft = Math.max(0, qLeft - COLUMN_DATA_BUFFER_SIZE);
          const buffedWidth = Math.min(layout.qHyperCube.qSize.qcx, qWidth + COLUMN_DATA_BUFFER_SIZE);
          loadColumns(cappedLeft, qTop, buffedWidth, qHeight);
          break;
        }
        default:
          break;
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
    ]
  );

  return handleItemsRendered;
};

export default useItemsRendererHandler;
