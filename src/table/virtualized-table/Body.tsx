import React, { memo, useMemo, useLayoutEffect, useCallback } from 'react';
import { VariableSizeGrid } from 'react-window';
import useData from './hooks/use-data';
import { BodyProps } from './types';
import useScrollDirection from './hooks/use-scroll-direction';
import useTableCount from './hooks/use-table-count';
import useItemsRendererHandler from './hooks/use-items-rendered-handler';
import useSelectionsEffect from './hooks/use-selections-effect';
import { useContextSelector, TableContext } from '../context';
import { Row } from '../../types';
import useMeasureText from './hooks/use-measure-text';
import Cell from './Cell';
import useOnPropsChange from './hooks/use-on-props-change';

const PADDING = 12 * 2;
const BORDER = 1;

const getMeasuredRowHeight = (lineHeight: number, row: Row | undefined, measureText: (text: string) => number) => {
  const cellHeights = Object.entries(row ?? {})
    .filter(([key]) => key !== 'key')
    .map(([, cell]) =>
      typeof cell === 'object'
        ? Math.max(1, Math.ceil(measureText(cell.qText) / (180 - PADDING - BORDER))) * lineHeight
        : lineHeight
    );

  return Math.max(lineHeight, ...cellHeights);
};

const getMeasuredCellHeight = (
  lineHeight: number,
  text: string,
  columnWidth: number,
  measureText: (text: string) => number
) => {
  const width = measureText(text);
  const height = Math.max(1, Math.ceil(width / (columnWidth - PADDING - BORDER))) * lineHeight;

  return { width, height };
};

const Body = (props: BodyProps) => {
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
  } = props;
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

  const { measureText } = useMeasureText(bodyStyle.fontSize, bodyStyle.fontFamily);

  const measureCellHeight = useCallback(
    (text: string, colIdx: number) => getMeasuredCellHeight(rowHeight, text, columnWidth[colIdx], measureText),
    [measureText, rowHeight, columnWidth]
  );

  const { rowsInPage, deferredRowCount, loadRows, loadColumns, maxRowHeight } = useData(
    layout,
    model as EngineAPI.IGenericObject,
    pageInfo,
    rowCount,
    visibleRowCount,
    visibleColumnCount,
    columns,
    measureCellHeight
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
  });

  const itemData = useMemo(
    () => ({ rowsInPage, columns, bodyStyle, isHoverEnabled }),
    [rowsInPage, columns, bodyStyle, isHoverEnabled]
  );

  useOnPropsChange(() => {
    forwardRef.current?.resetAfterRowIndex(firstVisisbleRow.current, false);
  }, [rowsInPage]);

  useSelectionsEffect(rowsInPage);

  useLayoutEffect(() => {
    if (!forwardRef.current) return;
    console.log('CALLED');
    forwardRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    forwardRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, pageInfo.page, forwardRef, columnWidth]);

  let { height: bodyHeight } = rect;
  bodyHeight -= headerAndTotalsHeight;
  bodyHeight = Math.min(deferredRowCount * rowHeight, bodyHeight);

  if (!rowsInPage[0]) {
    console.log('render NULL');
    return null;
  }

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
      estimatedRowHeight={maxRowHeight.current}
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
