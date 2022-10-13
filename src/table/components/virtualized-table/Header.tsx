import React, { useLayoutEffect } from 'react';
import { VariableSizeGrid } from 'react-window';
import { VirtualizedTableProps } from '../../types';
import HeaderCell from './HeaderCell';

const Header = (props: VirtualizedTableProps) => {
  const { layout, rect, forwardRef, columns, columnWidth } = props;

  useLayoutEffect(() => {
    if (!layout) return;
    forwardRef?.current?.resetAfterColumnIndex(0, true);
    forwardRef?.current?.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, forwardRef]);

  return (
    <VariableSizeGrid
      ref={forwardRef}
      style={{ position: 'sticky', top: 0, left: 0, overflow: 'hidden', backgroundColor: 'rgb(247, 247, 247)' }}
      columnCount={layout.qHyperCube.qSize.qcx}
      columnWidth={(index) => columnWidth[index]}
      height={33}
      rowCount={1}
      rowHeight={() => 32}
      width={rect.width}
      itemData={{ columns }}
    >
      {HeaderCell}
    </VariableSizeGrid>
  );
};

export default Header;
