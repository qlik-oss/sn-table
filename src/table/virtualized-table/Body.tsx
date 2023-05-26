/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useMemo, useLayoutEffect, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
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
import useOnPropsChange from './hooks/use-on-props-change';
import getBodyHeight from './utils/get-body-height';
import { getStylingComponent } from '../utils/styling-utils';

const grdiStyle: React.CSSProperties = {
  overflow: 'hidden',
  /**
   * "will-change" is by default "transform" in react-window. This disables that default value,
   * as there was issues with rendering border when the width of the react-window "list" was
   * a floating point number.
   *
   * If performance issues arrise when scrolling, this may need to be change back the "transform"
   * again to resolve those performance issues, but the issue with rendering border will need to
   * be fixed in some other way.
   */
  willChange: 'auto',
};

const Body = forwardRef<BodyRef, BodyProps>((props, ref) => {
  const {
    rect,
    columns,
    innerForwardRef,
    pageInfo,
    bodyStyle,
    rowHeight,
    headerAndTotalsHeight,
    syncHeight,
    viewService,
  } = props;
  const { layout, model, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const initialDataPages = useContextSelector(TableContext, (value) => value.initialDataPages);

  const gridRef = useRef<VariableSizeGrid>(null);
  const gridState = useRef<GridState>({
    overscanColumnStartIndex: 0,
    overscanRowStartIndex: 0,
    overscanColumnStopIndex: 0,
    overscanRowStopIndex: 0,
  });
  const isHoverEnabled = !!getStylingComponent(layout)?.content?.hoverEffect;
  const { scrollHandler, verticalScrollDirection, horizontalScrollDirection } = useScrollDirection();
  const { rowCount, visibleRowCount, visibleColumnCount } = useTableCount(
    layout,
    pageInfo,
    rect,
    columnWidths,
    rowHeight
  );

  const { setCellSize, getRowHeight, rowMeta, estimatedRowHeight, maxLineCount, resizeVisibleCells } =
    useDynamicRowHeight({
      pageInfo,
      style: bodyStyle,
      rowHeight,
      columnWidths,
      gridRef,
      rowCount,
      gridState,
    });

  const { rowsInPage, loadRows, loadColumns } = useData({
    layout,
    model: model as EngineAPI.IGenericObject,
    theme,
    initialDataPages,
    pageInfo,
    rowCount,
    visibleRowCount,
    visibleColumnCount,
    columns,
    setCellSize,
    gridState,
  });

  const handleItemsRendered = useItemsRendererHandler({
    layout,
    loadRows,
    loadColumns,
    verticalScrollDirection,
    horizontalScrollDirection,
    rowCount,
    pageInfo,
    gridState,
    viewService,
  });

  const itemData = useMemo<ItemData>(
    () => ({ rowsInPage, columns, bodyStyle, isHoverEnabled, maxLineCount }),
    [rowsInPage, columns, bodyStyle, isHoverEnabled, maxLineCount]
  );

  const bodyHeight = getBodyHeight(rect, headerAndTotalsHeight, rowCount, estimatedRowHeight);

  const interpolatedScrollTo = (scrollTopRatio: number, scrollLeft: number) => {
    const innerHeight = (innerForwardRef.current?.clientHeight ?? bodyHeight) - bodyHeight;
    const scrollTop = Math.round(innerHeight * scrollTopRatio);
    rowMeta.current.lastScrollToRatio = scrollTopRatio;
    if (rowMeta.current.lastScrollToRatio === 1) {
      // Hack to ensure that the last row is scrolled to when row height is dynamic
      // and row has already been measured
      gridRef.current?.scrollToItem({ rowIndex: rowCount - 1, align: 'start' });
      gridRef.current?.scrollTo({ scrollLeft });
    } else {
      gridRef.current?.scrollTo({ scrollTop, scrollLeft });
    }
  };

  useLayoutEffect(() => {
    syncHeight(innerForwardRef.current?.clientHeight ?? 0, true);
  }, [rowCount, syncHeight, innerForwardRef]);

  useLayoutEffect(() => {
    syncHeight(innerForwardRef.current?.clientHeight ?? 0, false);

    if (rowMeta.current.lastScrollToRatio === 1) {
      // Hack to deal with the case when a user scrolls to the last row
      // and data has not yet finished loading
      gridRef.current?.scrollToItem({ rowIndex: rowCount - 1, align: 'start' });
    }
  });

  useSelectionsEffect(rowsInPage);

  // React to events that can invalidate cell width and/or height.
  // If grid cache is not reset, any new cell width/height would not be applied by the grid,
  // producing strange cases where some text may not properly fit inside the cell.
  useOnPropsChange(() => {
    gridRef.current?.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: false });
  }, [layout, pageInfo, theme.name(), rect.width, columnWidths]);

  useImperativeHandle(
    ref,
    () => {
      return {
        interpolatedScrollTo,
        resizeCells: () => {
          gridRef.current?.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: false });
          resizeVisibleCells(rowsInPage);
        },
      };
    },
    [innerForwardRef, bodyHeight, rowMeta, rowCount, resizeVisibleCells, rowsInPage]
  );

  const scrollLeft = layout.snapshotData ? viewService.scrollLeft : 0;
  const scrollTopRatio = layout.snapshotData ? viewService.scrollTopRatio || 0 : 0;

  useEffect(() => {
    interpolatedScrollTo(scrollTopRatio, scrollLeft);
  }, [scrollTopRatio, scrollLeft]);

  return (
    <VariableSizeGrid
      data-key="body"
      ref={gridRef}
      innerRef={innerForwardRef}
      style={grdiStyle}
      columnCount={layout.qHyperCube.qSize.qcx}
      columnWidth={(index) => columnWidths[index]}
      height={bodyHeight}
      rowCount={rowCount}
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
