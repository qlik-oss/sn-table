import React, { memo, useLayoutEffect, useMemo } from 'react';
import { VariableSizeList } from 'react-window';
import { getTotalsCellStyle } from '../../utils/styling-utils';
import { HEADER_HEIGHT, PAGINATION_HEIGHT } from './constants';
import TotalsCell from './TotalsCell';
import { TotalsProps } from './types';

const Totals = (props: TotalsProps) => {
  const { layout, rect, forwardRef, columnWidth, pageInfo, theme, totals, paginationNeeded } = props;
  const totalsStyle = useMemo(
    () => getTotalsCellStyle(layout, theme, totals.atTop ? 'top' : 'bottom'),
    [layout, theme.name(), totals]
  ); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    forwardRef?.current?.resetAfterIndex(0, true);
    forwardRef?.current?.scrollTo(0);
  }, [layout, pageInfo, forwardRef, columnWidth]);

  let top = totals.atTop ? HEADER_HEIGHT : rect.height - HEADER_HEIGHT;
  top -= totals.atBottom && paginationNeeded ? PAGINATION_HEIGHT : 0;

  return (
    <VariableSizeList
      ref={forwardRef}
      layout="horizontal"
      style={{
        position: 'sticky',
        top,
        left: 0,
        overflow: 'hidden',
        background: totalsStyle.background,
        borderTop: totals.atBottom ? `1px solid ${totalsStyle.borderTopColor}` : '0px',
        borderBottom: totals.atTop || !paginationNeeded ? `1px solid ${totalsStyle.borderBottomColor}` : '0px',
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
