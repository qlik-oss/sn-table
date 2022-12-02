import { useCallback } from 'react';
import { PageInfo, TableLayout } from '../../../../types';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../constants';
import { LoadBy } from './use-infinite-scroll-data';
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
  loadRows: LoadBy;
  loadColumns: LoadBy;
  scrollDirection: React.MutableRefObject<ScrollDirection>;
  rowCount: number;
  pageInfo: PageInfo;
}

const useItemsRendererHandler = ({
  layout,
  loadRows,
  loadColumns,
  scrollDirection,
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

      const pageLeft = overscanColumnStartIndex;
      const qTop = overscanRowStartIndex + pageInfo.page * pageInfo.rowsPerPage;
      const qWidth = overscanColumnStopIndex - overscanColumnStartIndex + 1;
      const qHeight = overscanRowStopIndex - overscanRowStartIndex + 1;

      // Load data for visible grid and buffer grid
      switch (scrollDirection.current) {
        case ScrollDirection.Down: {
          const buffedHeight = qHeight + ROW_DATA_BUFFER_SIZE;
          const remainingRowsOnPage = rowCount - overscanRowStartIndex;
          const cappedHeight = overscanRowStartIndex + buffedHeight > rowCount ? remainingRowsOnPage : buffedHeight;
          loadRows(pageLeft, qTop, qWidth, cappedHeight);
          break;
        }

        case ScrollDirection.Up: {
          const buffedHeight = qHeight + ROW_DATA_BUFFER_SIZE;
          const qTopStartIndexForPage = pageInfo.page * pageInfo.rowsPerPage;
          const cappedTop = Math.max(qTopStartIndexForPage, qTop - ROW_DATA_BUFFER_SIZE);
          loadRows(pageLeft, cappedTop, qWidth, buffedHeight);
          break;
        }

        case ScrollDirection.Right: {
          const cappedWidth = Math.min(COLUMN_DATA_BUFFER_SIZE + qWidth, layout.qHyperCube.qSize.qcx - pageLeft);
          loadColumns(pageLeft, qTop, cappedWidth, qHeight); // TODO fix area values
          break;
        }

        case ScrollDirection.Left: {
          const cappedLeft = Math.max(0, pageLeft - COLUMN_DATA_BUFFER_SIZE);
          loadColumns(cappedLeft, qTop, qWidth, qHeight); // TODO fix area values
          break;
        }
        default:
          break;
      }
    },
    [pageInfo, loadRows, loadColumns, scrollDirection, rowCount, layout.qHyperCube.qSize]
  );

  return handleItemsRendered;
};

export default useItemsRendererHandler;
