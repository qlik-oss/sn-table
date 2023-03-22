import React from 'react';
import { Column } from '../../types';
import { useContextSelector, TableContext } from '../context';
import { GeneratedStyling } from '../types';
import CellText from '../components/CellText';
import { Totals } from './types';

interface TotalsCellProps {
  index: number;
  style: React.CSSProperties;
  data: {
    totalsStyle: GeneratedStyling;
    columns: Column[];
    totals: Totals;
  };
}

const TotalsCell = ({ index, style, data }: TotalsCellProps) => {
  const { layout, constraints } = useContextSelector(TableContext, (value) => value.baseProps);
  const {
    totalsStyle: { hoverColors, ...applicableStyling },
    columns,
    totals,
  } = data;
  const label = columns[index].totalInfo;
  const { totalsCellTextAlign } = columns[index];
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
        borderRightWidth: isLastColumn ? '0px' : '1px',
        borderTopWidth: totals.atBottom ? '1px' : '0px',
        borderBottomWidth: totals.atTop ? '1px' : '0px',
        padding: '4px 12px',
        justifyContent: totalsCellTextAlign,
        boxSizing: 'border-box',
        cursor: 'default',
        fontWeight: '600',
      }}
    >
      <CellText wordBreak lines={3}>
        {label}
      </CellText>
    </div>
  );
};

export default TotalsCell;
