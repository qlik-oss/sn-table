import React from 'react';
import { Column } from '../../types';
import { useContextSelector, TableContext } from '../context';
import { GeneratedStyling } from '../types';
import CellText from '../components/CellText';

interface TotalsCellProps {
  index: number;
  style: React.CSSProperties;
  data: {
    totalsStyle: GeneratedStyling;
    columns: Column[];
  };
}

const TotalsCell = ({ index, style, data }: TotalsCellProps) => {
  const { layout } = useContextSelector(TableContext, (value) => value.baseProps);
  const {
    totalsStyle: { hoverColors, ...applicableStyling },
    columns,
  } = data;
  const label = columns[index].totalInfo;
  const isLastColumn = layout.qHyperCube.qSize.qcx - 1 === index;

  return (
    <div
      className="sn-table-cell"
      style={{
        ...style,
        ...applicableStyling,
        display: 'flex',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: isLastColumn ? '0px' : '0px 1px 0px 0px',
        padding: '4px 12px',
        justifyContent: index === 0 ? 'left' : 'right',
        boxSizing: 'border-box',
        cursor: 'default',
        fontWeight: 'bold',
      }}
    >
      <CellText singleLine>{label}</CellText>
    </div>
  );
};

export default TotalsCell;
