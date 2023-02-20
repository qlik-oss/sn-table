import React, { memo } from 'react';
import { VariableSizeList } from 'react-window';
import { HeaderProps } from './types';
import HeaderCell from './HeaderCell';
import { useContextSelector, TableContext } from '../context';
import useResetHeader from './hooks/use-reset-header';

const Header = (props: HeaderProps) => {
  const { rect, forwardRef, columns, columnWidth, pageInfo, headerStyle, rowHeight } = props;
  const { layout } = useContextSelector(TableContext, (value) => value.baseProps);

  useResetHeader(forwardRef, layout, pageInfo, columnWidth, columns);

  return (
    <VariableSizeList
      ref={forwardRef}
      layout="horizontal"
      style={{
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
      itemCount={layout.qHyperCube.qSize.qcx}
      itemSize={(index) => columnWidth[index]}
      height={rowHeight}
      width={rect.width}
      itemData={{ columns, headerStyle }}
    >
      {HeaderCell}
    </VariableSizeList>
  );
};

export default memo(Header);
