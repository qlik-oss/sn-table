import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid } from 'react-window';
import { getColumns } from '../../../handle-data';
import useColumnSize from '../../hooks/use-column-size';
import Body from './Body';
import { DEFAULT_ROW_HEIGHT } from './constants';
import FullSizeContainer from './FullSizeContainer';
import Header from './Header';
import { VirtualizedTableProps } from './types';

export default function TableContainer(props: VirtualizedTableProps) {
  const { layout, rect, theme } = props;
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeGrid>(null);
  const bodyRef = useRef<VariableSizeGrid>(null);
  const innerForwardRef = useRef() as React.RefObject<HTMLDivElement>;
  const { columns } = useMemo(() => getColumns(layout), [layout]);
  const { width } = useColumnSize(rect, columns);
  const totalWidth = columns.reduce((prev, curr, index) => prev + width[index], 0);
  const [totalHeight, setTotalHeight] = useState(layout.qHyperCube.qSize.qcy * DEFAULT_ROW_HEIGHT);
  console.log('RENDERING WRAPPER', theme);

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

    event.preventDefault();
  };

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = 0;
      ref.current.scrollTop = 0;
    }
  }, [layout]);

  return (
    <div
      data-key="table-container"
      ref={ref}
      style={{
        overflow: 'auto',
        width: '100%',
        height: rect.height - 49,
      }}
      onScroll={onScrollHandler}
    >
      <FullSizeContainer width={totalWidth} height={totalHeight}>
        <Header {...props} columns={columns} columnWidth={width} forwardRef={headerRef} />
        <Body {...props} columns={columns} columnWidth={width} forwardRef={bodyRef} innerForwardRef={innerForwardRef} />
      </FullSizeContainer>
    </div>
  );
}
