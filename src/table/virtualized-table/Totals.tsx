import React, { memo } from 'react';
import { VariableSizeList } from 'react-window';
import TotalsCell from './TotalsCell';
import { useContextSelector, TableContext } from '../context';
import { TotalsProps } from './types';
import useResetHeader from './hooks/use-reset-header';

const listStyle: React.CSSProperties = {
  overflow: 'hidden',
  boxSizing: 'border-box',
  /**
   * "will-change" is by default "transform" in react-window. This disables that default value,
   * as there was issues with rendering border when the width of the react-window "list" was
   * a floating point number.
   *
   * If performance issues arrise when scrolling, this may need to be change back the "transform"
   * again to resolve those performance issues, but the issue with rendering border will need to
   * be fixed in some other way.
   *
   */
  willChange: 'auto',
};

const Totals = (props: TotalsProps) => {
  const { rect, forwardRef, pageInfo, totals, rowHeight, columns } = props;
  const { layout, styling, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);

  useResetHeader(forwardRef, layout, pageInfo, columnWidths, theme.name());

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
