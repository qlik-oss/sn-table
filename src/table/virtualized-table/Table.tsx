import React, { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeList } from 'react-window';
import Body from './Body';
import FullSizeContainer from './FullSizeContainer';
import Header from './Header';
import { TableProps, BodyStyle, BodyRef } from './types';
import useScrollHandler from './hooks/use-scroll-handler';
import Totals from './Totals';
import useTableCount from './hooks/use-table-count';
import ScrollableContainer from './ScrollableContainer';
import StickyContainer from './StickyContainer';
import toTableRect, { toStickyContainerRect } from './utils/to-rect';
import { useContextSelector, TableContext } from '../context';
import useScrollbarWidth from './hooks/use-scrollbar-width';
import useDidUpdateEffect from '../hooks/use-did-update-effect';
import useHeights from './hooks/use-heights';

const Table = (props: TableProps) => {
  const { pageInfo, rect } = props;
  const { totalsPosition, columns, paginationNeeded } = useContextSelector(TableContext, (value) => value.tableData);
  const { layout, theme, styling } = useContextSelector(TableContext, (value) => value.baseProps);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const setYScrollbarWidth = useContextSelector(TableContext, (value) => value.setYScrollbarWidth);
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeList>(null);
  const totalsRef = useRef<VariableSizeList>(null);
  const bodyRef = useRef<BodyRef>(null);
  const innerForwardRef = useRef() as React.RefObject<HTMLDivElement>;
  const { xScrollbarWidth, yScrollbarWidth } = useScrollbarWidth(ref);
  const bodyStyle = useMemo<BodyStyle>(
    () => ({
      ...styling.body,
      background: theme.background.color ?? 'transparent',
    }),
    [layout, theme.name()] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const { headerRowHeight, totalsRowHeight, bodyRowHeight, headerAndTotalsHeight } = useHeights({
    columns,
    columnWidths,
    pageInfo,
    totalsPosition,
    headerRef,
    totalsRef,
  });
  const tableRect = useMemo(() => toTableRect(rect, paginationNeeded), [rect, paginationNeeded]);
  const stickyContainerRect = useMemo(
    () => toStickyContainerRect(tableRect, xScrollbarWidth, yScrollbarWidth),
    [tableRect, xScrollbarWidth, yScrollbarWidth]
  );
  const { rowCount } = useTableCount(layout, pageInfo, stickyContainerRect, columnWidths, bodyRowHeight);
  const containerWidth = columnWidths.reduce((prev, curr) => prev + curr, 0);
  const [containerHeight, setContainerHeight] = useState(rowCount * bodyRowHeight + headerAndTotalsHeight); // Based on single line height, which is going to be out-of-sync when rows have multiple lines
  const scrollHandler = useScrollHandler(headerRef, totalsRef, bodyRef);

  const syncHeight = useCallback(
    (innerHeight: number, forceSync = false) => {
      const newHeight = innerHeight + headerAndTotalsHeight;
      // Handle an issue that occur when the measured row heights needs a scrollbar but single line height does not
      if (containerHeight < stickyContainerRect.height && newHeight > stickyContainerRect.height) {
        setContainerHeight(newHeight);
      } else if (forceSync) {
        setContainerHeight(newHeight);
      }
    },
    [containerHeight, headerAndTotalsHeight, stickyContainerRect.height]
  );

  const columResizeHandler = useCallback(() => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }

    bodyRef.current?.resizeCells();
  }, [ref]);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = 0;
      ref.current.scrollTop = 0;
    }
  }, [columns.length]);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [pageInfo, rowCount]);

  useDidUpdateEffect(() => {
    setYScrollbarWidth(yScrollbarWidth);
  }, [yScrollbarWidth]);

  const TotalsComponent = (
    <Totals
      rect={stickyContainerRect}
      pageInfo={pageInfo}
      columns={columns}
      forwardRef={totalsRef}
      totals={totalsPosition}
      rowHeight={totalsRowHeight}
    />
  );

  return (
    <ScrollableContainer ref={ref} width={tableRect.width} height={tableRect.height} onScroll={scrollHandler}>
      <FullSizeContainer width={containerWidth} height={containerHeight}>
        <StickyContainer rect={stickyContainerRect}>
          <Header
            headerStyle={styling.head}
            rect={stickyContainerRect}
            pageInfo={pageInfo}
            columns={columns}
            forwardRef={headerRef}
            rowHeight={headerRowHeight}
            columResizeHandler={columResizeHandler}
          />
          {totalsPosition.atTop ? TotalsComponent : null}
          <Body
            ref={bodyRef}
            innerForwardRef={innerForwardRef}
            bodyStyle={bodyStyle}
            rect={stickyContainerRect}
            pageInfo={pageInfo}
            columns={columns}
            rowHeight={bodyRowHeight}
            headerAndTotalsHeight={headerAndTotalsHeight}
            syncHeight={syncHeight}
          />
          {totalsPosition.atBottom ? TotalsComponent : null}
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};

// Export non memoized version for testing purpose
export { Table as TestableTable };

export default memo(Table);
