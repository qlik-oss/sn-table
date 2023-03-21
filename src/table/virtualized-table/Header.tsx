import React, { memo } from 'react';
import { VariableSizeList } from 'react-window';
import { HeaderProps } from './types';
import HeaderCell from './HeaderCell';
import { useContextSelector, TableContext } from '../context';
import useResetHeader from './hooks/use-reset-header';

const Header = (props: HeaderProps) => {
  const { rect, forwardRef, columns, pageInfo, headerStyle, rowHeight, columResizeHandler } = props;
  const { layout, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);

  useResetHeader(forwardRef, layout, pageInfo, columnWidths, theme);

  return (
    <VariableSizeList
      ref={forwardRef}
      layout="horizontal"
      style={{
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
      itemCount={layout.qHyperCube.qSize.qcx}
      itemSize={(index) => columnWidths[index]}
      height={rowHeight}
      width={rect.width}
      itemData={{ columns, headerStyle, columResizeHandler }}
    >
      {HeaderCell}
    </VariableSizeList>
  );
};

export default memo(Header);
