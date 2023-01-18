import React, { memo, useLayoutEffect, useMemo } from 'react';
import { VariableSizeList } from 'react-window';
import { getTotalsCellStyle } from '../../utils/styling-utils';
import TotalsCell from './TotalsCell';
import { TotalsProps } from './types';

const Totals = (props: TotalsProps) => {
  const { layout, rect, forwardRef, columnWidth, pageInfo, theme, totals, rowHeight } = props;
  const totalsStyle = useMemo(() => getTotalsCellStyle(layout, theme, totals.atTop), [layout, theme.name(), totals]); // eslint-disable-line react-hooks/exhaustive-deps

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
        background: totalsStyle.background,
        borderTop: totals.atBottom ? `1px solid ${totalsStyle.borderTopColor}` : '0px',
        // TODO: figure out properly when it should have a bottom border
        borderBottom: totals.atTop ? `1px solid ${totalsStyle.borderBottomColor}` : '0px',
        boxSizing: 'border-box',
      }}
      itemCount={layout.qHyperCube.qSize.qcx}
      itemSize={(index) => columnWidth[index]}
      height={rowHeight}
      width={rect.width}
      itemData={{ layout, totalsStyle }}
    >
      {TotalsCell}
    </VariableSizeList>
  );
};

export default memo(Totals);
