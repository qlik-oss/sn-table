import React, { memo, useLayoutEffect } from 'react';
import { VariableSizeList } from 'react-window';
import TotalsCell from './TotalsCell';
import { useContextSelector, TableContext } from '../context';
import { TotalsProps } from './types';

const Totals = (props: TotalsProps) => {
  const { rect, forwardRef, columnWidth, pageInfo, totals, rowHeight, columns } = props;
  const { layout, styling } = useContextSelector(TableContext, (value) => value.baseProps);

  useLayoutEffect(() => {
    forwardRef?.current?.resetAfterIndex(0, true);
    forwardRef?.current?.scrollTo(0);
  }, [layout, pageInfo, forwardRef, columnWidth]);

  return (
    <VariableSizeList
      ref={forwardRef}
      layout="horizontal"
      style={{
        overflow: 'hidden',
        background: styling.totals.background,
        borderTop: totals.atBottom ? `1px solid ${styling.totals.borderTopColor}` : '0px',
        // TODO: figure out properly when it should have a bottom border
        borderBottom: totals.atTop ? `1px solid ${styling.totals.borderBottomColor}` : '0px',
        boxSizing: 'border-box',
      }}
      itemCount={layout.qHyperCube.qSize.qcx}
      itemSize={(index) => columnWidth[index]}
      height={rowHeight}
      width={rect.width}
      itemData={{ totalsStyle: styling.totals, columns }}
    >
      {TotalsCell}
    </VariableSizeList>
  );
};

export default memo(Totals);
