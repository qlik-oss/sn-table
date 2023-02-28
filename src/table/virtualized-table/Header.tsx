import React, { memo, useEffect } from 'react';
import { VariableSizeList } from 'react-window';
import { HeaderProps } from './types';
import HeaderCell from './HeaderCell';
import { useContextSelector, TableContext } from '../context';
import useResetHeader from './hooks/use-reset-header';
import useDynamicRowHeight from './hooks/use-dynamic-row-height';
import { PADDING_TOP_BOTTOM } from './constants';

const Header = (props: HeaderProps) => {
  const { rect, forwardRef, columns, columnWidth, pageInfo, headerStyle, rowHeight } = props;
  const { layout } = useContextSelector(TableContext, (value) => value.baseProps);

  useResetHeader(forwardRef, layout, pageInfo, columnWidth);

  const { setCellSize, getRowHeight } = useDynamicRowHeight({
    style: headerStyle,
    columnWidth,
    lineRef: forwardRef,
    rowCount: 1,
    rowHeight,
    layout,
    pageInfo,
    columns,
    boldText: true,
  });

  useEffect(() => {
    columns.forEach((col, idx) => setCellSize(col.label, 0, idx));
  }, [columns, setCellSize]);

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
      height={getRowHeight(0) + PADDING_TOP_BOTTOM * 2}
      width={rect.width}
      itemData={{ columns, headerStyle }}
    >
      {HeaderCell}
    </VariableSizeList>
  );
};

export default memo(Header);
