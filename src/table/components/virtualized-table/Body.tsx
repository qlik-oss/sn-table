import React, { useCallback, useEffect, useLayoutEffect, memo, useMemo, useRef } from 'react';
import { VariableSizeGrid } from 'react-window';
import {
  COLUMN_DATA_BUFFER_SIZE,
  DEFAULT_ROW_HEIGHT,
  HEADER_HEIGHT,
  PAGINATION_HEIGHT,
  ROW_DATA_BUFFER_SIZE,
} from './constants';
import useInfiniteScrollData from './hooks/use-infinite-scroll-data';
import { BodyProps } from './types';
import Cell from './Cell';
import useScrollDirection, { ScrollDirection } from './hooks/use-scroll-direction';
import useTableCount from './hooks/use-table-count';

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

const Body = (props: BodyProps) => {
  const {
    rect,
    layout,
    model,
    forwardRef,
    columns,
    columnWidth,
    innerForwardRef,
    pageInfo,
    paginationNeeded,
    bodyStyle,
  } = props;
  const { scrollHandler, scrollDirection } = useScrollDirection();
  const { rowCount, visibleRowCount, visibleColumnCount } = useTableCount(layout, pageInfo, rect, columnWidth);
  const { rowsInPage, loadDataByRows, loadDataByColumns } = useInfiniteScrollData(
    model,
    layout,
    pageInfo,
    visibleRowCount,
    visibleColumnCount
  );

  useLayoutEffect(() => {
    if (!forwardRef.current) return;

    forwardRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    forwardRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, pageInfo.page, forwardRef, columnWidth]);

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

  const itemData = useMemo(() => ({ rowsInPage, columns, bodyStyle }), [rowsInPage, columns, bodyStyle]);

  return (
    <VariableSizeGrid
      data-key="body"
      ref={forwardRef}
      innerRef={innerForwardRef}
      style={{ position: 'sticky', top: `${HEADER_HEIGHT}px`, left: '0px', overflow: 'hidden' }}
      columnCount={layout.qHyperCube.qSize.qcx}
      columnWidth={(index) => columnWidth[index]}
      height={rect.height - HEADER_HEIGHT - (paginationNeeded ? PAGINATION_HEIGHT : 0)}
      rowCount={rowCount}
      rowHeight={() => DEFAULT_ROW_HEIGHT}
      estimatedRowHeight={DEFAULT_ROW_HEIGHT}
      width={rect.width}
      itemData={itemData}
      onItemsRendered={handleItemsRendered}
      onScroll={scrollHandler}
    >
      {Cell}
    </VariableSizeGrid>
  );
};

export default memo(Body);
