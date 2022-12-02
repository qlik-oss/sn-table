import React, { useLayoutEffect, memo, useMemo } from 'react';
import { VariableSizeGrid } from 'react-window';
import { DEFAULT_ROW_HEIGHT, HEADER_HEIGHT, PAGINATION_HEIGHT } from './constants';
import useInfiniteScrollData from './hooks/use-infinite-scroll-data';
import { BodyProps } from './types';
import Cell from './Cell';
import useScrollDirection from './hooks/use-scroll-direction';
import useTableCount from './hooks/use-table-count';
import useItemsRendererHandler from './hooks/use-items-rendered-handler';

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
  const handleItemsRendered = useItemsRendererHandler({
    layout,
    loadDataByRows,
    loadDataByColumns,
    scrollDirection,
    rowCount,
    pageInfo,
  });

  useLayoutEffect(() => {
    if (!forwardRef.current) return;

    forwardRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    forwardRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, pageInfo.page, forwardRef, columnWidth]);

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
