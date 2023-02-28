import React, { memo } from 'react';
import { VariableSizeList } from 'react-window';
import TotalsCell from './TotalsCell';
import { useContextSelector, TableContext } from '../context';
import { TotalsProps } from './types';
import useResetHeader from './hooks/use-reset-header';

const Totals = (props: TotalsProps) => {
  const { rect, forwardRef, columnWidth, pageInfo, totals, rowHeight, columns } = props;
  const { layout, styling } = useContextSelector(TableContext, (value) => value.baseProps);

  useResetHeader(forwardRef, layout, pageInfo, columnWidth);

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
      height={rowHeight}
      width={rect.width}
      itemData={{ totalsStyle: styling.totals, columns, totals }}
    >
      {TotalsCell}
    </VariableSizeList>
  );
};

export default memo(Totals);
