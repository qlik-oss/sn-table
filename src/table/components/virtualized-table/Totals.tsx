import React, { useLayoutEffect, memo, useMemo } from 'react';
import { VariableSizeList } from 'react-window';
import { TotalsProps } from './types';
import { HEADER_HEIGHT } from './constants';
import TotalsCell from './TotalsCell';
import { getTotalsCellStyle } from '../../utils/styling-utils';
import { useContextSelector, TableContext } from '../../context';

const Totals = (props: TotalsProps) => {
  const { rect, forwardRef, columnWidth, pageInfo, totals } = props;
  const { layout, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const totalsStyle = useMemo(() => getTotalsCellStyle(layout, theme), [layout, theme.name()]); // eslint-disable-line react-hooks/exhaustive-deps

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
        backgroundColor: totalsStyle.backgroundColor,
        borderColor: totalsStyle.borderColor,
        borderStyle: 'solid',
        borderWidth: '0px',
        borderTopWidth: totals.atBottom ? '1px' : '0px',
        borderBottomWidth: totals.atTop ? '1px' : '0px',
        boxSizing: 'border-box',
      }}
      itemCount={layout.qHyperCube.qSize.qcx}
      itemSize={(index) => columnWidth[index]}
      height={HEADER_HEIGHT}
      width={rect.width}
      itemData={{ totalsStyle }}
    >
      {TotalsCell}
    </VariableSizeList>
  );
};

export default memo(Totals);
