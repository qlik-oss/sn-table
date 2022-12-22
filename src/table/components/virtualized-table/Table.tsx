import React, { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { getColumns } from '../../../handle-data';
import useColumnSize from './hooks/use-column-size';
import Body from './Body';
import { DEFAULT_ROW_HEIGHT } from './constants';
import FullSizeContainer from './FullSizeContainer';
import Header from './Header';
import { TableProps } from './types';
import { getHeaderStyle, getBodyCellStyle } from '../../utils/styling-utils';
import useScrollHandler from './hooks/use-scroll-handler';
import Totals from './Totals';
import useTotals from './hooks/use-totals';
import useOnPropsChange from './hooks/use-on-props-change';
import useTableCount from './hooks/use-table-count';
import ScrollableContainer from './ScrollableContainer';
import StickyContainer from './StickyContainer';
import { toTableRect, toStickyContainerRect } from './utils/to-rect';

const Table = (props: TableProps) => {
  const { layout, rect, pageInfo, paginationNeeded, model, theme, constraints, selectionsAPI } = props;
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeList>(null);
  const totalsRef = useRef<VariableSizeList>(null);
  const bodyRef = useRef<VariableSizeGrid>(null);
  const innerForwardRef = useRef() as React.RefObject<HTMLDivElement>;
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme), [layout, theme]);
  const bodyStyle = useMemo(
    () => ({
      ...getBodyCellStyle(layout, theme),
      backgroundColor: theme.background.color, // Append both background and backgroundColor to avoid conflicting prop error when selecting styling is applied
      background: theme.background.color,
    }),
    [layout, theme]
  );
  const totals = useTotals(layout);
  const columns = useMemo(() => getColumns(layout), [layout]);
  const tableRect = toTableRect(rect, paginationNeeded);
  const { width } = useColumnSize(tableRect, columns, headerStyle, bodyStyle);
  const { rowCount } = useTableCount(layout, pageInfo, tableRect, width);
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
      theme={theme}
      layout={layout}
      rect={stickyContainerRect}
      pageInfo={pageInfo}
      columns={columns}
      columnWidth={width}
      forwardRef={totalsRef}
      totals={totals}
    />
  );

  return (
    <ScrollableContainer
      forwardRef={ref}
      constraints={constraints}
      width={tableRect.width}
      height={tableRect.height}
      onScroll={scrollHandler}
    >
      <FullSizeContainer width={containerWidth} height={containerHeight}>
        <StickyContainer rect={stickyContainerRect} style={bodyStyle}>
          <Header
            headerStyle={headerStyle}
            layout={layout}
            rect={stickyContainerRect}
            pageInfo={pageInfo}
            columns={columns}
            columnWidth={width}
            forwardRef={headerRef}
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
