import React, { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { getColumns, getTotalPosition } from '../../../handle-data';
import useColumnSize from './hooks/use-column-size';
import Body from './Body';
import FullSizeContainer from './FullSizeContainer';
import Header from './Header';
import { TableProps, BodyStyle } from './types';
import { getHeaderStyle, getBodyStyle } from '../../utils/styling-utils';
import useScrollHandler from './hooks/use-scroll-handler';
import Totals from './Totals';
import useOnPropsChange from './hooks/use-on-props-change';
import useTableCount from './hooks/use-table-count';
import ScrollableContainer from './ScrollableContainer';
import StickyContainer from './StickyContainer';
import { toTableRect, toStickyContainerRect } from './utils/to-rect';
import { getBodyRowHeight, getHeaderRowHeight } from './utils/get-height';

const Table = (props: TableProps) => {
  const { layout, rect, pageInfo, paginationNeeded, model, theme, constraints, selectionsAPI } = props;
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeList>(null);
  const totalsRef = useRef<VariableSizeList>(null);
  const bodyRef = useRef<VariableSizeGrid>(null);
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
  const headerRowHeight = getHeaderRowHeight(headerStyle);
  const bodyRowHeight = getBodyRowHeight(bodyStyle);
  const headerAndTotalsHeight = totals.atTop || totals.atBottom ? headerRowHeight + bodyRowHeight : headerRowHeight;
  const columns = useMemo(() => getColumns(layout), [layout]);
  const tableRect = toTableRect(rect, paginationNeeded);
  const { width } = useColumnSize(tableRect, columns, headerStyle, bodyStyle);
  const { rowCount } = useTableCount(layout, pageInfo, tableRect, width, bodyRowHeight);
  const containerWidth = columns.reduce((prev, curr, index) => prev + width[index], 0);
  const [containerHeight, setContainerHeight] = useState(rowCount * bodyRowHeight + headerAndTotalsHeight);
  const stickyContainerRect = toStickyContainerRect(tableRect, rowCount, headerAndTotalsHeight, bodyRowHeight);
  const scrollHandler = useScrollHandler(
    headerRef,
    totalsRef,
    bodyRef,
    innerForwardRef,
    containerHeight,
    headerAndTotalsHeight,
    setContainerHeight
  );

  useOnPropsChange(() => {
    setContainerHeight(rowCount * bodyRowHeight + headerAndTotalsHeight);
  }, [rowCount, headerAndTotalsHeight, bodyRowHeight]);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = 0;
      ref.current.scrollTop = 0;
    }
  }, [layout, pageInfo]);

  const TotalsComponent = (
    <Totals
      theme={theme}
      layout={layout}
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
    <ScrollableContainer
      ref={ref}
      constraints={constraints}
      width={tableRect.width}
      height={tableRect.height}
      onScroll={scrollHandler}
    >
      <FullSizeContainer width={containerWidth} height={containerHeight}>
        <StickyContainer rect={stickyContainerRect}>
          <Header
            headerStyle={headerStyle}
            layout={layout}
            rect={stickyContainerRect}
            pageInfo={pageInfo}
            columns={columns}
            columnWidth={width}
            forwardRef={headerRef}
            rowHeight={headerRowHeight}
          />
          {totals.atTop ? TotalsComponent : null}
          <Body
            bodyStyle={bodyStyle}
            model={model}
            layout={layout}
            rect={stickyContainerRect}
            pageInfo={pageInfo}
            columns={columns}
            columnWidth={width}
            forwardRef={bodyRef}
            innerForwardRef={innerForwardRef}
            selectionsAPI={selectionsAPI}
            rowHeight={bodyRowHeight}
            headerAndTotalsHeight={headerAndTotalsHeight}
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
