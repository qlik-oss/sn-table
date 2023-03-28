import React from 'react';
import { Column } from '../../types';
import { useContextSelector, TableContext } from '../context';
import { GeneratedStyling } from '../types';
import CellText from '../components/CellText';
import { Totals } from './types';
import { getAdjustedCellWidth } from './utils/cell-width-utils';

interface TotalsCellProps {
  index: number;
  style: React.CSSProperties;
  data: {
    totalsStyle: GeneratedStyling;
    columns: Column[];
    totals: Totals;
    columnWidths: number[];
  };
}

const TotalsCell = ({ index, style, data }: TotalsCellProps) => {
  const { layout, constraints } = useContextSelector(TableContext, (value) => value.baseProps);
  const showRightBorder = useContextSelector(TableContext, (value) => value.showRightBorder);
  const {
    totalsStyle: { hoverColors, ...applicableStyling },
    columns,
    totals,
    columnWidths,
  } = data;
  const label = columns[index].totalInfo;
  const { totalsTextAlign } = columns[index];
  const isLastColumn = layout.qHyperCube.qSize.qcx - 1 === index;

  return (
    <div
      className="sn-table-cell"
      title={!constraints.passive ? label : undefined}
      style={{
        ...style,
        ...applicableStyling,
        display: 'flex',
        alignItems: 'center',
        borderStyle: 'solid',
        borderLeftWidth: '0px',
        borderRightWidth: isLastColumn && !showRightBorder ? '0px' : '1px',
        borderTopWidth: totals.atBottom ? '1px' : '0px',
        borderBottomWidth: totals.atTop ? '1px' : '0px',
        padding: '4px 12px',
        justifyContent: totalsTextAlign,
        boxSizing: 'border-box',
        cursor: 'default',
        fontWeight: '600',
      }}
    >
      <CellText wordBreak lines={3} width={getAdjustedCellWidth(columnWidths[index])}>
        {label}
      </CellText>
    </div>
  );
};

export default TotalsCell;
