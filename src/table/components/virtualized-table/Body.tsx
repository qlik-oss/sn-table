import React, { useCallback, useEffect, useLayoutEffect, memo, useMemo } from 'react';
import { VariableSizeGrid } from 'react-window';
import { DEFAULT_ROW_HEIGHT, HEADER_HEIGHT, PAGINATION_HEIGHT } from './constants';
import useInfiniteScrollData from './hooks/use-infinite-scroll-data';
import { BodyProps } from './types';
import Cell from './Cell';

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
  const { rowsInPage, loadData, debouncedLoadData } = useInfiniteScrollData(model, layout, pageInfo);
  const rowCount = Math.min(pageInfo.rowsPerPage, layout.qHyperCube.qSize.qcy - pageInfo.page * pageInfo.rowsPerPage);
  const visibleRowCount = Math.min(rowCount, Math.ceil(rect.height / DEFAULT_ROW_HEIGHT));
  const visibleColumnCount = useMemo(
    () =>
      columnWidth.reduce(
        (data, colWidth) => {
          if (data.width < rect.width) {
            data.width += colWidth;
            data.count += 1;
          }

          return data;
        },
        { count: 0, width: 0 }
      ),
    [rect, columnWidth]
  ).count;

  useEffect(() => {
    // Initial data load
    const top = pageInfo.page * pageInfo.rowsPerPage;
    loadData(0, top, visibleColumnCount, visibleRowCount);
  }, [layout, visibleRowCount, visibleColumnCount, loadData, pageInfo]);

  useLayoutEffect(() => {
    if (!forwardRef.current) return;

    forwardRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    forwardRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, pageInfo, forwardRef]);

  const handleItemsRendered = useCallback(
    ({
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex,
    }: OnItemsRendered) => {
      if (overscanColumnStartIndex > 0 || overscanRowStartIndex > 0) {
        const left = overscanColumnStartIndex;
        const top = overscanRowStartIndex + pageInfo.page * pageInfo.rowsPerPage;
        const width = overscanColumnStopIndex - overscanColumnStartIndex + 1;
        const height = overscanRowStopIndex - overscanRowStartIndex + 1;

        debouncedLoadData(left, top, width, height);
      }
    },
    [debouncedLoadData, pageInfo]
  );

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
      itemData={{ rowsInPage, columns, bodyStyle }}
      onItemsRendered={handleItemsRendered}
    >
      {Cell}
    </VariableSizeGrid>
  );
};

export default memo(Body);
