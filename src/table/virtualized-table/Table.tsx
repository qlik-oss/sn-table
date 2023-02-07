import React, { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeList } from 'react-window';
import { getColumns, getTotalPosition } from '../../handle-data';
import useColumnSize from './hooks/use-column-size';
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
import getHeights from './utils/get-height';
import useScrollbarWidth from './hooks/use-scrollbar-width';

const Table = (props: TableProps) => {
  const { rect, pageInfo, paginationNeeded } = props;
  const { layout, theme, styling } = useContextSelector(TableContext, (value) => value.baseProps);
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeList>(null);
  const totalsRef = useRef<VariableSizeList>(null);
  const bodyRef = useRef<BodyRef>(null);
  const innerForwardRef = useRef() as React.RefObject<HTMLDivElement>;
  const { xScrollbarWidth, yScrollbarWidth } = useScrollbarWidth(ref);
  const totals = useMemo(() => getTotalPosition(layout), [layout]);
  const bodyStyle = useMemo<BodyStyle>(
    () => ({
      ...styling.body,
      background: theme.background.color ?? 'transparent',
    }),
    [layout, theme.name()] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const { headerRowHeight, bodyRowHeight, headerAndTotalsHeight } = getHeights(styling.head, bodyStyle, totals);
  const columns = useMemo(() => getColumns(layout), [layout]);
  const tableRect = useMemo(() => toTableRect(rect, paginationNeeded), [rect, paginationNeeded]);
  const stickyContainerRect = useMemo(
    () => toStickyContainerRect(tableRect, xScrollbarWidth, yScrollbarWidth),
    [tableRect, xScrollbarWidth, yScrollbarWidth]
  );
  const { width } = useColumnSize(stickyContainerRect, columns, styling.head, bodyStyle);
  const { rowCount } = useTableCount(layout, pageInfo, stickyContainerRect, width, bodyRowHeight);
  const containerWidth = columns.reduce((prev, curr, index) => prev + width[index], 0);
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

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = 0;
      ref.current.scrollTop = 0;
    }
  }, [layout, pageInfo]);

  const TotalsComponent = (
    <Totals
      rect={stickyContainerRect}
      pageInfo={pageInfo}
      columns={columns}
      columnWidth={width}
      forwardRef={totalsRef}
      totals={totals}
      rowHeight={bodyRowHeight}
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
            columnWidth={width}
            forwardRef={headerRef}
            rowHeight={headerRowHeight}
          />
          {totals.atTop ? TotalsComponent : null}
          <Body
            ref={bodyRef}
            innerForwardRef={innerForwardRef}
            bodyStyle={bodyStyle}
            rect={stickyContainerRect}
            pageInfo={pageInfo}
            columns={columns}
            columnWidth={width}
            rowHeight={bodyRowHeight}
            headerAndTotalsHeight={headerAndTotalsHeight}
            syncHeight={syncHeight}
          />
          {totals.atBottom ? TotalsComponent : null}
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};

// Export non memoized version for testing purpose
export { Table as TestableTable };

export default memo(Table);
