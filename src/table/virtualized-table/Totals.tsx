import React, { memo, useEffect } from 'react';
import { VariableSizeList } from 'react-window';
import TotalsCell from './TotalsCell';
import { useContextSelector, TableContext } from '../context';
import { TotalsProps } from './types';
import useResetHeader from './hooks/use-reset-header';
import useDynamicRowHeight from './hooks/use-dynamic-row-height';

const Totals = (props: TotalsProps) => {
  const { rect, forwardRef, columnWidth, pageInfo, totals, rowHeight, columns } = props;
  const { layout, styling } = useContextSelector(TableContext, (value) => value.baseProps);

  useResetHeader(forwardRef, layout, pageInfo, columnWidth);

  const { setCellSize, getRowHeight } = useDynamicRowHeight({
    style: styling.totals,
    columnWidth,
    lineRef: forwardRef,
    rowCount: 1,
    rowHeight,
    layout,
    pageInfo,
    boldText: true,
  });

  useEffect(() => {
    columns.forEach((col, idx) => setCellSize(col.totalInfo, 0, idx));
  }, [columns, setCellSize]);

  return (
    <VariableSizeList
      ref={forwardRef}
      layout="horizontal"
      style={{
        overflow: 'hidden',
        background: styling.totals.background,
        boxSizing: 'border-box',
      }}
      itemCount={layout.qHyperCube.qSize.qcx}
      itemSize={(index) => columnWidth[index]}
      height={getRowHeight(0)}
      width={rect.width}
      itemData={{ totalsStyle: styling.totals, columns, totals }}
    >
      {TotalsCell}
    </VariableSizeList>
  );
};

export default memo(Totals);
