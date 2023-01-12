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
import { useContextSelector, TableContext } from '../../context';

const Body = (props: BodyProps) => {
  console.count('Body');
  const { rect, forwardRef, columns, columnWidth, innerForwardRef, pageInfo, bodyStyle, totals } = props;
  const { layout, selectionsAPI } = useContextSelector(TableContext, (value) => value.baseProps);
  const isHoverEnabled = !!layout.components?.[0]?.content?.hoverEffect;
  const { scrollHandler, verticalScrollDirection, horizontalScrollDirection } = useScrollDirection();
  const { rowCount, visibleRowCount, visibleColumnCount } = useTableCount(layout, pageInfo, rect, columnWidth);
  let { height: bodyHeight } = rect;
  bodyHeight -= totals.shrinkBodyHeightBy;
  bodyHeight = Math.min(rowCount * DEFAULT_ROW_HEIGHT, bodyHeight);

  const { rowsInPage, loadRows, loadColumns } = useData(pageInfo, visibleRowCount, visibleColumnCount, columns);

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
    () => ({ rowsInPage, columns, bodyStyle, isHoverEnabled }),
    [rowsInPage, columns, bodyStyle, isHoverEnabled]
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
