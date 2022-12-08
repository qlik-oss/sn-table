import React, { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { getColumns } from '../../../handle-data';
import useColumnSize from './hooks/use-column-size';
import Body from './Body';
import { DEFAULT_ROW_HEIGHT, HEADER_HEIGHT, PAGINATION_HEIGHT } from './constants';
import FullSizeContainer from './FullSizeContainer';
import Header from './Header';
import { TableContainerProps } from './types';
import { getHeaderStyle, getBodyCellStyle } from '../../utils/styling-utils';
import useScrollHandler from './hooks/use-scroll-handler';

const TableContainer = (props: TableContainerProps) => {
  const { layout, rect, pageInfo, paginationNeeded, model, theme, constraints, selectionsAPI } = props;
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeList>(null);
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
  const columns = useMemo(() => getColumns(layout), [layout]);
  const { width } = useColumnSize(rect, columns, headerStyle, bodyStyle);
  const totalWidth = columns.reduce((prev, curr, index) => prev + width[index], 0);
  const [totalHeight, setTotalHeight] = useState(pageInfo.rowsPerPage * DEFAULT_ROW_HEIGHT + HEADER_HEIGHT);
  const scrollHandler = useScrollHandler(headerRef, bodyRef, innerForwardRef, totalHeight, setTotalHeight);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = 0;
      ref.current.scrollTop = 0;
    }
  }, [layout, pageInfo]);

  return (
    <div
      data-testid="table-container"
      ref={ref}
      style={{
        overflow: constraints.active ? 'hidden' : 'auto',
        width: rect.width,
        height: rect.height - (paginationNeeded ? PAGINATION_HEIGHT : 0),
      }}
      onScroll={scrollHandler}
    >
      <FullSizeContainer width={totalWidth} height={totalHeight} paginationNeeded={paginationNeeded}>
        <Header
          headerStyle={headerStyle}
          layout={layout}
          rect={rect}
          pageInfo={pageInfo}
          columns={columns}
          columnWidth={width}
          forwardRef={headerRef}
        />
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
        />
      </FullSizeContainer>
    </div>
  );
};

// Export non memoized version for testing purpose
export { TableContainer };

export default memo(TableContainer);
