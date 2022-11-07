import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid } from 'react-window';
import { getColumns } from '../../../handle-data';
import useColumnSize from './hooks/use-column-size';
import Body from './Body';
import { DEFAULT_ROW_HEIGHT, PAGINATION_HEIGHT } from './constants';
import FullSizeContainer from './FullSizeContainer';
import Header from './Header';
import { TableContainerProps } from './types';
import { getHeaderStyle, getBodyCellStyle } from '../../utils/styling-utils';

export default function TableContainer(props: TableContainerProps) {
  const { layout, rect, pageInfo, paginationNeeded, model, theme } = props;
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeGrid>(null);
  const bodyRef = useRef<VariableSizeGrid>(null);
  const innerForwardRef = useRef() as React.RefObject<HTMLDivElement>;
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme), [layout, theme]);
  const bodyStyle = useMemo(() => getBodyCellStyle(layout, theme), [layout, theme]);
  const columns = useMemo(() => getColumns(layout), [layout]);
  const { width } = useColumnSize(rect, columns, headerStyle, bodyStyle);
  const totalWidth = columns.reduce((prev, curr, index) => prev + width[index], 0);
  const [totalHeight, setTotalHeight] = useState(pageInfo.rowsPerPage * DEFAULT_ROW_HEIGHT);

  const onScrollHandler = (event: React.SyntheticEvent) => {
    if (headerRef.current) {
      headerRef.current.scrollTo({
        scrollLeft: event.currentTarget.scrollLeft,
        scrollTop: event.currentTarget.scrollTop,
      });
    }

    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        scrollLeft: event.currentTarget.scrollLeft,
        scrollTop: event.currentTarget.scrollTop,
      });
    }

    if (innerForwardRef.current) {
      // Keep full size container in sync with the height calculation in react-window is doing
      setTotalHeight(innerForwardRef.current.clientHeight);
    }
  };

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
        overflow: 'auto',
        width: '100%',
        height: rect.height - (paginationNeeded ? PAGINATION_HEIGHT : 0),
      }}
      onScroll={onScrollHandler}
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
          model={model}
          layout={layout}
          rect={rect}
          pageInfo={pageInfo}
          paginationNeeded={paginationNeeded}
          columns={columns}
          columnWidth={width}
          forwardRef={bodyRef}
          innerForwardRef={innerForwardRef}
        />
      </FullSizeContainer>
    </div>
  );
}
