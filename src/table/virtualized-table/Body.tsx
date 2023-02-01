import React, {
  memo,
  useMemo,
  useLayoutEffect,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef as forwardRefFn,
} from 'react';
import { VariableSizeGrid } from 'react-window';
import useData from './hooks/use-data';
import { BodyProps, BodyRef, ItemData } from './types';
import useScrollDirection from './hooks/use-scroll-direction';
import useTableCount from './hooks/use-table-count';
import useItemsRendererHandler from './hooks/use-items-rendered-handler';
import useSelectionsEffect from './hooks/use-selections-effect';
import { useContextSelector, TableContext } from '../context';
import Cell from './Cell';
import getCellItemKey from './utils/get-cell-item-key';
import useDynamicRowHeight from './hooks/use-dynamic-row-height';

const Body = forwardRefFn((props: BodyProps, ref) => {
  const {
    rect,
    columns,
    columnWidth,
    innerForwardRef,
    pageInfo,
    bodyStyle,
    rowHeight,
    headerAndTotalsHeight,
    onRowCountChange,
  } = props;
  const gridRef = useRef<VariableSizeGrid>(null);
  const { layout, model, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const isHoverEnabled = !!layout.components?.[0]?.content?.hoverEffect;
  const { scrollHandler, verticalScrollDirection, horizontalScrollDirection } = useScrollDirection();
  const { rowCount, visibleRowCount, visibleColumnCount } = useTableCount(
    layout,
    pageInfo,
    rect,
    columnWidth,
    rowHeight
  );

  const { setCellSize, getRowHeight, rowMeta, estimatedRowHeight } = useDynamicRowHeight({
    bodyStyle,
    rowHeight,
    columnWidth,
    gridRef,
  });

  const { rowsInPage, deferredRowCount, loadRows, loadColumns } = useData(
    layout,
    model as EngineAPI.IGenericObject,
    pageInfo,
    rowCount,
    visibleRowCount,
    visibleColumnCount,
    columns,
    setCellSize
  );

  const handleItemsRendered = useItemsRendererHandler({
    layout,
    loadRows,
    loadColumns,
    verticalScrollDirection,
    horizontalScrollDirection,
    rowCount: deferredRowCount,
    pageInfo,
  });

  const itemData = useMemo<ItemData>(
    () => ({ rowsInPage, columns, bodyStyle, isHoverEnabled }),
    [rowsInPage, columns, bodyStyle, isHoverEnabled]
  );

  useEffect(() => {
    onRowCountChange(deferredRowCount);
  }, [deferredRowCount, onRowCountChange]);

  useEffect(() => {
    if (rowMeta.current.lastScrollToRatio === 1) {
      // Hack to deal with the case when a user scrolls to the last row
      // and data has not yet finished loading
      gridRef.current?.scrollToItem({ rowIndex: deferredRowCount - 1, align: 'start' });
    }
  });

  useSelectionsEffect(rowsInPage);

  useLayoutEffect(() => {
    if (!gridRef.current) return;

    rowMeta.current.lastScrollToRatio = 0;
    gridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    gridRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, pageInfo.page, gridRef, columnWidth, rowMeta, theme.name()]); // eslint-disable-line react-hooks/exhaustive-deps

  let { height: bodyHeight } = rect;
  bodyHeight -= headerAndTotalsHeight;
  if (deferredRowCount * rowHeight < bodyHeight) {
    bodyHeight = Math.min(rowMeta.current.totalHeight, bodyHeight);
  }

  useImperativeHandle<unknown, BodyRef>(
    ref,
    () => {
      return {
        interpolatedScrollTo: (scrollTopRatio: number, scrollLeft: number) => {
          const innerHeight = (innerForwardRef.current?.clientHeight ?? bodyHeight) - bodyHeight;
          const scrollTop = innerHeight * scrollTopRatio;
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
      columnWidth={(index) => columnWidth[index]}
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
