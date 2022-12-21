import React, { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { stardust } from '@nebula.js/stardust';
import { getColumns } from '../../../handle-data';
import useColumnSize from './hooks/use-column-size';
import Body from './Body';
import { DEFAULT_ROW_HEIGHT, PAGINATION_HEIGHT } from './constants';
import FullSizeContainer from './FullSizeContainer';
import Header from './Header';
import { TableContainerProps } from './types';
import { getHeaderStyle, getBodyCellStyle } from '../../utils/styling-utils';
import useScrollHandler from './hooks/use-scroll-handler';
import Totals from './Totals';
import useTotals from './hooks/use-totals';
import useOnPropsChange from './hooks/use-on-props-change';
import useTableCount from './hooks/use-table-count';
import ScrollableContainer from './ScrollableContainer';

const toTableContainerRect = (
  rect: stardust.Rect,
  rowCount: number,
  paginationNeeded: boolean,
  shrinkBodyHeightBy: number
) => {
  let height = rect.height - (paginationNeeded ? PAGINATION_HEIGHT : 0);
  height = Math.min(rowCount * DEFAULT_ROW_HEIGHT + shrinkBodyHeightBy, height);

  return {
    ...rect,
    height,
  };
};

const TableContainer = (props: TableContainerProps) => {
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
  const { width } = useColumnSize(rect, columns, headerStyle, bodyStyle);
  const { rowCount } = useTableCount(layout, pageInfo, rect, width);
  const containerWidth = columns.reduce((prev, curr, index) => prev + width[index], 0);
  const [containerHeight, setContainerHeight] = useState(rowCount * DEFAULT_ROW_HEIGHT + totals.shrinkBodyHeightBy);
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
      rect={rect}
      pageInfo={pageInfo}
      paginationNeeded={paginationNeeded}
      columns={columns}
      columnWidth={width}
      forwardRef={totalsRef}
      totals={totals}
    />
  );

  const tableContainerRect = toTableContainerRect(rect, rowCount, paginationNeeded, totals.shrinkBodyHeightBy);

  return (
    <ScrollableContainer
      forwardRef={ref}
      constraints={constraints}
      width={tableContainerRect.width}
      height={tableContainerRect.height}
      onScroll={scrollHandler}
      style={bodyStyle}
    >
      <FullSizeContainer width={containerWidth} height={containerHeight}>
        <Header
          headerStyle={headerStyle}
          layout={layout}
          rect={rect}
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
          rect={rect}
          pageInfo={pageInfo}
          paginationNeeded={paginationNeeded}
          columns={columns}
          columnWidth={width}
          forwardRef={bodyRef}
          innerForwardRef={innerForwardRef}
          selectionsAPI={selectionsAPI}
          totals={totals}
        />
        {totals.atBottom ? TotalsComponent : null}
      </FullSizeContainer>
    </ScrollableContainer>
  );
};

// Export non memoized version for testing purpose
export { TableContainer };

export default memo(TableContainer);
