import React, { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { getColumns, getTotalPosition } from '../../handle-data';
import useColumnSize from './hooks/use-column-size';
import Body from './Body';
import FullSizeContainer from './FullSizeContainer';
import Header from './Header';
import { TableProps, BodyStyle, BodyRef } from './types';
import { getHeaderStyle, getBodyStyle } from '../utils/styling-utils';
import useScrollHandler from './hooks/use-scroll-handler';
import Totals from './Totals';
import useOnPropsChange from './hooks/use-on-props-change';
import useTableCount from './hooks/use-table-count';
import ScrollableContainer from './ScrollableContainer';
import StickyContainer from './StickyContainer';
import toTableRect from './utils/to-rect';
import { useContextSelector, TableContext } from '../context';
import getHeights from './utils/get-height';

const Table = (props: TableProps) => {
  const { rect, pageInfo, paginationNeeded } = props;
  const { layout, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeList>(null);
  const totalsRef = useRef<VariableSizeList>(null);
  const bodyRef = useRef<VariableSizeGrid>(null);
  const bRef = useRef<BodyRef>(null);
  const innerForwardRef = useRef() as React.RefObject<HTMLDivElement>;
  const totals = useMemo(() => getTotalPosition(layout), [layout]);
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme, !totals.atTop), [layout, theme, totals]);
  const bodyStyle = useMemo<BodyStyle>(
    () => ({
      ...getBodyStyle(layout, theme),
      background: theme.background.color ?? 'transparent',
    }),
    [layout, theme.name()] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const { headerRowHeight, bodyRowHeight, headerAndTotalsHeight } = getHeights(headerStyle, bodyStyle, totals);
  const columns = useMemo(() => getColumns(layout), [layout]);
  const tableRect = useMemo(() => toTableRect(rect, paginationNeeded), [rect, paginationNeeded]);
  const { width } = useColumnSize(tableRect, columns, headerStyle, bodyStyle);
  const { rowCount } = useTableCount(layout, pageInfo, tableRect, width, bodyRowHeight);
  const containerWidth = columns.reduce((prev, curr, index) => prev + width[index], 0);
  const [containerHeight, setContainerHeight] = useState(rowCount * bodyRowHeight);
  const scrollHandler = useScrollHandler(
    headerRef,
    totalsRef,
    bodyRef,
    innerForwardRef,
    containerHeight,
    headerAndTotalsHeight,
    setContainerHeight,
    bRef
  );

  // Use dererred row count to set a new height, as the row count here and in the `Body` are not always in sync
  const onRowCountChangeHandler = useCallback(
    (deferredRowCount: number) => setContainerHeight(deferredRowCount * bodyRowHeight),
    [bodyRowHeight, headerAndTotalsHeight]
  );

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = 0;
      ref.current.scrollTop = 0;
    }
  }, [layout, pageInfo]);

  const TotalsComponent = (
    <Totals
      rect={tableRect}
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
        <StickyContainer rect={tableRect}>
          <Header
            headerStyle={headerStyle}
            rect={tableRect}
            pageInfo={pageInfo}
            columns={columns}
            columnWidth={width}
            forwardRef={headerRef}
            rowHeight={headerRowHeight}
          />
          {totals.atTop ? TotalsComponent : null}
          <Body
            ref={bRef}
            bodyStyle={bodyStyle}
            rect={tableRect}
            pageInfo={pageInfo}
            columns={columns}
            columnWidth={width}
            forwardRef={bodyRef}
            innerForwardRef={innerForwardRef}
            rowHeight={bodyRowHeight}
            headerAndTotalsHeight={headerAndTotalsHeight}
            onRowCountChange={onRowCountChangeHandler}
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
