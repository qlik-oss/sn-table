import React, { memo, useEffect } from 'react';
import { VariableSizeList } from 'react-window';
import TotalsCell from './TotalsCell';
import { useContextSelector, TableContext } from '../context';
import { TotalsProps } from './types';
import useResetHeader from './hooks/use-reset-header';
import { listStyle } from './Header';

const Totals = (props: TotalsProps) => {
  const { rect, forwardRef, pageInfo, totals, rowHeight, columns, viewService } = props;
  const { layout, styling, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);

  useResetHeader(forwardRef, layout, pageInfo, columnWidths, theme.name());

  const scrollLeft = layout.snapshotData ? viewService.scrollLeft : 0;

  useEffect(() => {
    forwardRef.current?.scrollTo(scrollLeft);
  }, [forwardRef, scrollLeft]);

  return (
    <VariableSizeList
      ref={forwardRef}
      layout="horizontal"
      style={listStyle}
      itemCount={layout.qHyperCube.qSize.qcx}
      itemSize={(index) => columnWidths[index]}
      height={rowHeight}
      width={rect.width}
      itemData={{ totalsStyle: styling.totals, columns, totals }}
    >
      {TotalsCell}
    </VariableSizeList>
  );
};

export default memo(Totals);
