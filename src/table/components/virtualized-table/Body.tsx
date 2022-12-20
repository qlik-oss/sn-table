import React, { useLayoutEffect, memo, useMemo } from 'react';
import { VariableSizeGrid } from 'react-window';
import { DEFAULT_ROW_HEIGHT, HEADER_AND_TOTALS_HEIGHT, HEADER_HEIGHT, PAGINATION_HEIGHT } from './constants';
import useData from './hooks/use-data';
import { BodyProps } from './types';
import Cell from './Cell';
import useScrollDirection from './hooks/use-scroll-direction';
import useTableCount from './hooks/use-table-count';
import useItemsRendererHandler from './hooks/use-items-rendered-handler';
import useSelectionsEffect from './hooks/use-selections-effect';

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
    selectionsAPI,
    totals,
  } = props;
  const { scrollHandler, verticalScrollDirection, horizontalScrollDirection } = useScrollDirection();
  const { rowCount, visibleRowCount, visibleColumnCount } = useTableCount(layout, pageInfo, rect, columnWidth);
  const stickyTop = totals.atTop ? HEADER_AND_TOTALS_HEIGHT : HEADER_HEIGHT;
  let { height: bodyHeight } = rect;
  bodyHeight -= paginationNeeded ? PAGINATION_HEIGHT : 0;
  bodyHeight -= totals.shrinkBodyHeightBy;
  bodyHeight = Math.min(rowCount * DEFAULT_ROW_HEIGHT, bodyHeight);

  const { rowsInPage, loadRows, loadColumns } = useData(
    model,
    layout,
    pageInfo,
    visibleRowCount,
    visibleColumnCount,
    columns
  );

  const handleItemsRendered = useItemsRendererHandler({
    layout,
    loadRows,
    loadColumns,
    verticalScrollDirection,
    horizontalScrollDirection,
    rowCount,
    pageInfo,
  });

  const itemData = useMemo(() => ({ rowsInPage, columns, bodyStyle }), [rowsInPage, columns, bodyStyle]);

  useSelectionsEffect(selectionsAPI, rowsInPage);

  useLayoutEffect(() => {
    if (!forwardRef.current) return;

    forwardRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    forwardRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, pageInfo.page, forwardRef, columnWidth]);

  return (
    <VariableSizeGrid
      data-key="body"
      ref={forwardRef}
      innerRef={innerForwardRef}
      style={{ position: 'sticky', top: `${stickyTop}px`, left: '0px', overflow: 'hidden' }}
      columnCount={layout.qHyperCube.qSize.qcx}
      columnWidth={(index) => columnWidth[index]}
      height={bodyHeight}
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
