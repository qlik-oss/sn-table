import React, { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { getColumns } from '../../../handle-data';
import useColumnSize from './hooks/use-column-size';
import Body from './Body';
import { DEFAULT_ROW_HEIGHT } from './constants';
import FullSizeContainer from './FullSizeContainer';
import Header from './Header';
import { TableProps, BodyStyle } from './types';
import { getHeaderStyle, getBodyStyle } from '../../utils/styling-utils';
import useScrollHandler from './hooks/use-scroll-handler';
import Totals from './Totals';
import useTotals from './hooks/use-totals';
import useOnPropsChange from './hooks/use-on-props-change';
import useTableCount from './hooks/use-table-count';
import ScrollableContainer from './ScrollableContainer';
import StickyContainer from './StickyContainer';
import { toTableRect, toStickyContainerRect } from './utils/to-rect';
import { useContextSelector, TableContext } from '../../context';

const Table = (props: TableProps) => {
  const { rect, pageInfo, paginationNeeded } = props;
  const { layout, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeList>(null);
  const totalsRef = useRef<VariableSizeList>(null);
  const bodyRef = useRef<VariableSizeGrid>(null);
  const innerForwardRef = useRef() as React.RefObject<HTMLDivElement>;
  const totals = useTotals();
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme, !totals.atTop), [layout, theme, totals]);
  const bodyStyle = useMemo<BodyStyle>(
    () => ({
      ...getBodyStyle(layout, theme),
      background: theme.background.color ?? 'transparent',
    }),
    [layout, theme.name()] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const columns = useMemo(() => getColumns(layout), [layout]);
  const tableRect = toTableRect(rect, paginationNeeded);
  const { width } = useColumnSize(tableRect, columns, headerStyle, bodyStyle);
  const { rowCount } = useTableCount(pageInfo, tableRect, width);
  const containerWidth = columns.reduce((prev, curr, index) => prev + width[index], 0);
  const [containerHeight, setContainerHeight] = useState(rowCount * DEFAULT_ROW_HEIGHT + totals.shrinkBodyHeightBy);
  const stickyContainerRect = toStickyContainerRect(tableRect, rowCount, totals.shrinkBodyHeightBy);
  const scrollHandler = useScrollHandler(
    headerRef,
    totalsRef,
    bodyRef,
    innerForwardRef,
    containerHeight,
    totals.shrinkBodyHeightBy,
    setContainerHeight
  );

  useOnPropsChange(() => {
    setContainerHeight(rowCount * DEFAULT_ROW_HEIGHT + totals.shrinkBodyHeightBy);
  }, [rowCount, totals.shrinkBodyHeightBy]);

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
    />
  );

  return (
    <ScrollableContainer ref={ref} width={tableRect.width} height={tableRect.height} onScroll={scrollHandler}>
      <FullSizeContainer width={containerWidth} height={containerHeight}>
        <StickyContainer rect={stickyContainerRect}>
          <Header
            headerStyle={headerStyle}
            rect={stickyContainerRect}
            pageInfo={pageInfo}
            columns={columns}
            columnWidth={width}
            forwardRef={headerRef}
          />
          {totals.atTop ? TotalsComponent : null}
          <Body
            bodyStyle={bodyStyle}
            rect={stickyContainerRect}
            pageInfo={pageInfo}
            columns={columns}
            columnWidth={width}
            forwardRef={bodyRef}
            innerForwardRef={innerForwardRef}
            totals={totals}
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
