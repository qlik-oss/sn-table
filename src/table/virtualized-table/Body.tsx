import React, {
  memo,
  useMemo,
  useLayoutEffect,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef as forwardRefFn,
} from 'react';
import { VariableSizeGrid } from 'react-window';
import { debouncer } from 'qlik-chart-modules';
import useData from './hooks/use-data';
import { BodyProps, BodyRef, RenderedGrid } from './types';
import useScrollDirection from './hooks/use-scroll-direction';
import useTableCount from './hooks/use-table-count';
import useItemsRendererHandler from './hooks/use-items-rendered-handler';
import useSelectionsEffect from './hooks/use-selections-effect';
import { useContextSelector, TableContext } from '../context';
import Cell from './Cell';
import getCellItemKey from './utils/get-cell-item-key';
import useDynamicRowHeight from './hooks/use-dynamic-row-height';
import { ROW_DATA_BUFFER_SIZE } from './constants';

const Body = forwardRefFn((props: BodyProps, ref) => {
  const {
    rect,
    forwardRef,
    columns,
    columnWidth,
    innerForwardRef,
    pageInfo,
    bodyStyle,
    rowHeight,
    headerAndTotalsHeight,
    onRowCountChange,
  } = props;
  const renderedGridRef = useRef<RenderedGrid>({
    startRowIndex: 0,
    stopRowIndex: 0,
    startColumnIndex: 0,
    stopColumnIndex: 0,
  });
  const lastScrolledT = useRef(0);
  const { layout, model } = useContextSelector(TableContext, (value) => value.baseProps);
  const isHoverEnabled = !!layout.components?.[0]?.content?.hoverEffect;
  const { scrollHandler, verticalScrollDirection, horizontalScrollDirection } = useScrollDirection();
  const { rowCount, visibleRowCount, visibleColumnCount } = useTableCount(
    layout,
    pageInfo,
    rect,
    columnWidth,
    rowHeight
  );

  const { memoizedMeasureCell } = useDynamicRowHeight({ bodyStyle, rowHeight, columnWidth });

  const { rowsInPage, deferredRowCount, loadRows, loadColumns, measuredRowHeights, loadGrid } = useData(
    layout,
    model as EngineAPI.IGenericObject,
    pageInfo,
    rowCount,
    visibleRowCount,
    visibleColumnCount,
    columns,
    memoizedMeasureCell
  );

  const rowHeightCb = useCallback(
    (index: number) => (rowsInPage[index]?.height as number) ?? rowHeight,
    [rowsInPage, rowHeight]
  );

  const { handleItemsRendered, firstVisisbleRow } = useItemsRendererHandler({
    layout,
    loadRows,
    loadColumns,
    verticalScrollDirection,
    horizontalScrollDirection,
    rowCount: deferredRowCount,
    pageInfo,
    renderedGridRef,
  });

  const itemData = useMemo(
    () => ({ rowsInPage, columns, bodyStyle, isHoverEnabled }),
    [rowsInPage, columns, bodyStyle, isHoverEnabled]
  );

  useEffect(() => {
    onRowCountChange(deferredRowCount);
  }, [deferredRowCount, onRowCountChange]);

  useSelectionsEffect(rowsInPage);

  useLayoutEffect(() => {
    if (!forwardRef.current) return;

    forwardRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    forwardRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, pageInfo.page, forwardRef, columnWidth]);

  let { height: bodyHeight } = rect;
  bodyHeight -= headerAndTotalsHeight;
  if (deferredRowCount * rowHeight < bodyHeight) {
    const measuredBodyHeight = rowsInPage.reduce((height, row) => (row.height as number) + height, 0);
    bodyHeight = Math.min(measuredBodyHeight, bodyHeight);
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        scrollToIndex: debouncer(async (rowIndex: number) => {
          const qLeft = renderedGridRef.current.startColumnIndex;
          const qWidth = renderedGridRef.current.stopColumnIndex - renderedGridRef.current.startColumnIndex;
          const qHeight = renderedGridRef.current.stopRowIndex - renderedGridRef.current.startRowIndex;
          const qTop = rowIndex;
          // console.log('load grid', 'qTop', qTop, 'qHeight', qHeight);
          // await loadGrid(qLeft, qTop, qWidth, qHeight);
          forwardRef.current?.scrollToItem({ rowIndex: qTop, align: 'start' });
        }, 100),
        scrollTo: (scrollTop: number, count: number, t: number) => {
          // console.log('scrollTop', scrollTop, 'rowCount', count);
          if (t === 1) {
            console.log('scrolling to last item');
            forwardRef.current?.scrollToItem({ rowIndex: deferredRowCount - 1, align: 'start' });
          } else {
            forwardRef.current?.scrollTo({ scrollTop: scrollTop - bodyHeight });
          }
        },
      };
    },
    [renderedGridRef, loadGrid, forwardRef, bodyHeight, lastScrolledT, deferredRowCount]
  );

  forwardRef.current?.resetAfterRowIndex(firstVisisbleRow.current, false);

  const estimatedRowHeight = measuredRowHeights.current.totalHeight / measuredRowHeights.current.rowCount;

  // console.log('estimatedRowHeight', estimatedRowHeight);

  // console.log('measuredRowHeights', measuredRowHeights.current);
  // console.log('rendered grid', renderedGridRef.current);
  // console.log('clientHeigt', innerForwardRef.current?.clientHeight);

  if (!rowsInPage[0]) {
    return null;
  }
  console.log('clientHeight', innerForwardRef.current?.clientHeight);
  return (
    <VariableSizeGrid
      data-key="body"
      ref={forwardRef}
      innerRef={innerForwardRef}
      style={{ overflow: 'hidden' }}
      columnCount={layout.qHyperCube.qSize.qcx}
      columnWidth={(index) => columnWidth[index]}
      height={bodyHeight}
      rowCount={deferredRowCount}
      rowHeight={rowHeightCb}
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
