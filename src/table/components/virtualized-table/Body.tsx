import React, { useLayoutEffect, memo, useMemo } from 'react';
import { VariableSizeGrid } from 'react-window';
import { DEFAULT_ROW_HEIGHT } from './constants';
import useData from './hooks/use-data';
import { BodyProps } from './types';
import Cell from './Cell';
import useScrollDirection from './hooks/use-scroll-direction';
import useTableCount from './hooks/use-table-count';
import useItemsRendererHandler from './hooks/use-items-rendered-handler';
import useSelectionsEffect from './hooks/use-selections-effect';
import useHoverEffect from './hooks/use-hover-effect';

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
    bodyStyle,
    selectionsAPI,
    totals,
  } = props;
  const { hoverIndex, setHoverIndex, showHoverEffect } = useHoverEffect(layout);
  const { scrollHandler, verticalScrollDirection, horizontalScrollDirection } = useScrollDirection();
  const { rowCount, visibleRowCount, visibleColumnCount } = useTableCount(layout, pageInfo, rect, columnWidth);
  let { height: bodyHeight } = rect;
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

  const itemData = useMemo(
    () => ({ rowsInPage, columns, bodyStyle, hoverIndex, setHoverIndex, showHoverEffect }),
    [rowsInPage, columns, bodyStyle, hoverIndex, setHoverIndex, showHoverEffect]
  );

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
      style={{ overflow: 'hidden' }}
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
