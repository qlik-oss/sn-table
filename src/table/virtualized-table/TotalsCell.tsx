import React from 'react';
import { Column } from '../../types';
import { useContextSelector, TableContext } from '../context';
import { GeneratedStyling } from '../types';
import CellText from '../components/CellText';
import { Totals } from './types';
import { isNumeric } from '../utils/is-numeric';

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
  const { layout, interactions } = useContextSelector(TableContext, (value) => value.baseProps);
  const showRightBorder = useContextSelector(TableContext, (value) => value.showRightBorder);
  const {
    totalsStyle: { hoverColors, ...applicableStyling },
    columns,
    totals,
  } = data;
  const label = columns[index].totalInfo;
  const { totalsTextAlign } = columns[index];
  const isLastColumn = layout.qHyperCube.qSize.qcx - 1 === index;

  return (
    <div
      className="sn-table-cell"
      title={interactions.passive ? label : undefined}
      style={{
        ...style,
        ...applicableStyling,
        display: 'flex',
        alignItems: totals.atTop ? 'end' : 'start',
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
      <CellText wordBreak={!isNumeric(label)} lines={3}>
        {label}
      </CellText>
    </div>
  );
};

export default TotalsCell;
