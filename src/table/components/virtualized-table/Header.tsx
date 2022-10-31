import React, { useLayoutEffect, memo } from 'react';
import { VariableSizeGrid } from 'react-window';
import { VirtualizedTableProps } from '../../types';
import { DEFAULT_ROW_HEIGHT, HEADER_HEIGHT } from './constants';
import HeaderCell from './HeaderCell';

const Header = (props: VirtualizedTableProps) => {
  const { layout, rect, forwardRef, columns, columnWidth } = props;
  console.log('RENDERING HEADER');

  useLayoutEffect(() => {
    forwardRef?.current?.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    forwardRef?.current?.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, forwardRef]);

  return (
    <VariableSizeGrid
      ref={forwardRef}
      style={{ position: 'sticky', top: 0, left: 0, overflow: 'hidden', backgroundColor: 'rgb(247, 247, 247)' }}
      columnCount={layout.qHyperCube.qSize.qcx}
      columnWidth={(index) => columnWidth[index]}
      height={HEADER_HEIGHT}
      rowCount={1}
      rowHeight={() => DEFAULT_ROW_HEIGHT}
      width={rect.width}
      itemData={{ columns }}
    >
      {HeaderCell}
    </VariableSizeGrid>
  );
};

export default memo(Header);
