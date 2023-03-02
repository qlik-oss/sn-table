import React, { memo, useMemo, useLayoutEffect, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { VariableSizeGrid } from 'react-window';
import useData from './hooks/use-data';
import { BodyProps, BodyRef, ItemData, GridState } from './types';
import useScrollDirection from './hooks/use-scroll-direction';
import useTableCount from './hooks/use-table-count';
import useItemsRendererHandler from './hooks/use-items-rendered-handler';
import useSelectionsEffect from './hooks/use-selections-effect';
import { useContextSelector, TableContext } from '../context';
import Cell from './Cell';
import getCellItemKey from './utils/get-cell-item-key';
import useDynamicRowHeight from './hooks/use-dynamic-row-height';
import getBodyHeight from './utils/get-body-height';

const Body = forwardRef<BodyRef, BodyProps>((props, ref) => {
  const {
    rect,
    columns,
    columnWidths,
    innerForwardRef,
    pageInfo,
    bodyStyle,
    rowHeight,
    headerAndTotalsHeight,
    syncHeight,
  } = props;
  const gridRef = useRef<VariableSizeGrid>(null);
  const gridState = useRef<GridState>({
    overscanColumnStartIndex: 0,
    overscanRowStartIndex: 0,
  });
  const { layout, model, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const isHoverEnabled = !!layout.components?.[0]?.content?.hoverEffect;
  const { scrollHandler, verticalScrollDirection, horizontalScrollDirection } = useScrollDirection();
  const { rowCount, visibleRowCount, visibleColumnCount } = useTableCount(
    layout,
    pageInfo,
    rect,
    columnWidths,
    rowHeight
  );

  const { setCellSize, getRowHeight, rowMeta, estimatedRowHeight, maxLineCount } = useDynamicRowHeight({
    pageInfo,
    style: bodyStyle,
    rowHeight,
    columnWidths,
    gridRef,
    rowCount,
  });

  const { rowsInPage, deferredRowCount, loadRows, loadColumns } = useData(
    layout,
    model as EngineAPI.IGenericObject,
    pageInfo,
    rowCount,
    visibleRowCount,
    visibleColumnCount,
    columns,
    setCellSize,
    gridState
  );

  const handleItemsRendered = useItemsRendererHandler({
    layout,
    loadRows,
    loadColumns,
    verticalScrollDirection,
    horizontalScrollDirection,
    rowCount: deferredRowCount,
    pageInfo,
    gridState,
  });

  const itemData = useMemo<ItemData>(
    () => ({ rowsInPage, columns, bodyStyle, isHoverEnabled, maxLineCount }),
    [rowsInPage, columns, bodyStyle, isHoverEnabled, maxLineCount]
  );

  const bodyHeight = getBodyHeight(rect, headerAndTotalsHeight, deferredRowCount, estimatedRowHeight);

  useEffect(() => {
    syncHeight(innerForwardRef.current?.clientHeight ?? 0, true);
  }, [deferredRowCount, syncHeight, innerForwardRef]);

  useEffect(() => {
    syncHeight(innerForwardRef.current?.clientHeight ?? 0, false);

    if (rowMeta.current.lastScrollToRatio === 1) {
      // Hack to deal with the case when a user scrolls to the last row
      // and data has not yet finished loading
      gridRef.current?.scrollToItem({ rowIndex: deferredRowCount - 1, align: 'start' });
    }
  });

  useSelectionsEffect(rowsInPage);

  useLayoutEffect(() => {
    if (!gridRef.current) return;

    gridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
  }, [layout, pageInfo.page, gridRef, columnWidths, rowMeta, theme.name()]); // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(
    ref,
    () => {
      return {
        interpolatedScrollTo: (scrollTopRatio: number, scrollLeft: number) => {
          const innerHeight = (innerForwardRef.current?.clientHeight ?? bodyHeight) - bodyHeight;
          const scrollTop = Math.round(innerHeight * scrollTopRatio);
          rowMeta.current.lastScrollToRatio = scrollTopRatio;

          if (rowMeta.current.lastScrollToRatio === 1) {
            // Hack to ensure that the last row is scrolled to when row height is dynamic
            // and row has already been measured
            gridRef.current?.scrollToItem({ rowIndex: deferredRowCount - 1, align: 'start' });
            gridRef.current?.scrollTo({ scrollLeft });
          } else {
            gridRef.current?.scrollTo({ scrollTop, scrollLeft });
          }
        },
      };
    },
    [innerForwardRef, bodyHeight, rowMeta, deferredRowCount]
  );

  return (
    <VariableSizeGrid
      data-key="body"
      ref={gridRef}
      innerRef={innerForwardRef}
      style={{ overflow: 'hidden' }}
      columnCount={layout.qHyperCube.qSize.qcx}
      columnWidth={(index) => columnWidths[index]}
      height={bodyHeight}
      rowCount={deferredRowCount}
      rowHeight={getRowHeight}
      estimatedRowHeight={estimatedRowHeight}
      width={rect.width}
      itemData={itemData}
      onItemsRendered={handleItemsRendered}
      onScroll={scrollHandler}
      itemKey={getCellItemKey}
    >
      {Cell}
    </VariableSizeGrid>
  );
});

export default memo(Body);
