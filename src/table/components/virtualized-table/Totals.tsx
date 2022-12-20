import React, { useLayoutEffect, memo, useMemo } from 'react';
import { VariableSizeList } from 'react-window';
import { TotalsProps } from './types';
import { HEADER_HEIGHT, PAGINATION_HEIGHT } from './constants';
import TotalsCell from './TotalsCell';
import { getTotalsCellStyle } from '../../utils/styling-utils';

const Totals = (props: TotalsProps) => {
  const { layout, rect, forwardRef, columnWidth, pageInfo, theme, totals, paginationNeeded } = props;
  const totalsStyle = useMemo(() => getTotalsCellStyle(layout, theme), [layout, theme.name()]); // eslint-disable-line react-hooks/exhaustive-deps

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
        backgroundColor: totalsStyle.backgroundColor,
        borderColor: totalsStyle.borderColor,
        borderStyle: 'solid',
        borderWidth: '0px',
        borderTopWidth: totals.atBottom ? '1px' : '0px',
        borderBottomWidth: totals.atTop || paginationNeeded ? '1px' : '0px',
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
