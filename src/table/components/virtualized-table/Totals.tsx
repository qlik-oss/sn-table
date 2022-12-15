import React, { useLayoutEffect, memo } from 'react';
import { VariableSizeList } from 'react-window';
import { TotalsProps } from './types';
import { HEADER_HEIGHT } from './constants';
import TotalsCell from './TotalsCell';

const Totals = (props: TotalsProps) => {
  const { layout, rect, forwardRef, columnWidth, pageInfo, totalsStyle, totalsPosition } = props;

  useLayoutEffect(() => {
    forwardRef?.current?.resetAfterIndex(0, true);
    forwardRef?.current?.scrollTo(0);
  }, [layout, pageInfo, forwardRef, columnWidth]);

  if (totalsPosition === 'noTotals') {
    return null;
  }

  return (
    <VariableSizeList
      ref={forwardRef}
      layout="horizontal"
      style={{
        position: 'sticky',
        top: totalsPosition === 'top' ? HEADER_HEIGHT : rect.height - HEADER_HEIGHT,
        left: 0,
        overflow: 'hidden',
        backgroundColor: totalsStyle.backgroundColor,
        borderColor: totalsStyle.borderColor,
        borderStyle: 'solid',
        borderWidth: totalsPosition === 'top' ? '0px 0px 1px 0px' : '1px 0px 0px 0px',
        boxSizing: 'border-box',
      }}
      itemCount={layout.qHyperCube.qSize.qcx}
      itemSize={(index) => columnWidth[index]}
      height={HEADER_HEIGHT}
      width={rect.width}
      itemData={{ layout, totalsStyle }}
    >
      {TotalsCell}
    </VariableSizeList>
  );
};

export default memo(Totals);
