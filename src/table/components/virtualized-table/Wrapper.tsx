import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { VariableSizeGrid } from 'react-window';
import { getColumns } from '../../../handle-data';
import useColumnSize from '../../hooks/use-column-size';
import { VirtualizedTableProps } from '../../types';
import Body from './Body';
import FullSizeContainer from './FullSizeContainer';
import Header from './Header';

export default function Wrapper(props: VirtualizedTableProps) {
  const { layout, rect } = props;
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeGrid>(null);
  const bodyRef = useRef<VariableSizeGrid>(null);
  const { columns } = useMemo(() => getColumns(layout), [layout]);
  const { width } = useColumnSize(rect, columns);
  const fullWidth = columns.reduce((prev, curr, index) => prev + width[index], 0);

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
  };

  useLayoutEffect(() => {
    if (layout && ref.current) {
      ref.current.scrollLeft = 0;
      ref.current.scrollTop = 0;
    }
  }, [layout]);

  return (
    <div
      ref={ref}
      style={{
        overflow: 'auto',
        width: rect.width,
        height: rect.height,
        border: '1px solid #ccc',
      }}
      onScroll={onScrollHandler}
    >
      <FullSizeContainer width={fullWidth} height={layout.qHyperCube.qSize.qcy * 32}>
        <Header {...props} columns={columns} columnWidth={width} forwardRef={headerRef} />
        <Body {...props} columns={columns} columnWidth={width} forwardRef={bodyRef} />
      </FullSizeContainer>
    </div>
  );
}
