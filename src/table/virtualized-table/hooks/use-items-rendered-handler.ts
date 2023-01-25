import { useCallback, useRef } from 'react';
import { PageInfo, TableLayout } from '../../../types';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../constants';
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
  const firstVisisbleRow = useRef<number>(0);

  const handleItemsRendered = useCallback(
    ({
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex,
    }: OnItemsRendered) => {
      firstVisisbleRow.current = overscanRowStartIndex;

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
      firstVisisbleRow,
    ]
  );

  return { handleItemsRendered, firstVisisbleRow };
};

export default useItemsRendererHandler;
