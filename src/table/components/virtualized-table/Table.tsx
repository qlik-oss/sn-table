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

const Table = (props: TableProps) => {
  const {
    layout,
    rect,
    pageInfo,
    paginationNeeded,
    model,
    theme,
    constraints,
    selectionsAPI,
    embed,
    translator,
    changeSortOrder,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeList>(null);
  const totalsRef = useRef<VariableSizeList>(null);
  const bodyRef = useRef<VariableSizeGrid>(null);
  const innerForwardRef = useRef() as React.RefObject<HTMLDivElement>;
  const totals = useTotals(layout);
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme, !totals.atTop), [layout, theme, totals]);
  const bodyStyle = useMemo<BodyStyle>(
    () => ({
      ...getBodyStyle(layout, theme),
      background: theme.background.color ?? 'transparent',
    }),
    [layout, theme.name()] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const isInteractionEnabled = !constraints.active && !selectionsAPI.isModal();
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
            embed={embed}
            translator={translator}
            changeSortOrder={changeSortOrder}
            isInteractionEnabled={isInteractionEnabled}
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
