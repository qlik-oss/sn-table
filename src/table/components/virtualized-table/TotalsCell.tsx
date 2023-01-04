import React from 'react';
// import { getTotalInfo } from '../../../handle-data';
import { TableLayout } from '../../../types';
import { GeneratedStyling } from '../../types';
import CellText from '../CellText';

interface TotalsCellProps {
  index: number;
  style: React.CSSProperties;
  data: {
    layout: TableLayout;
    totalsStyle: GeneratedStyling;
  };
}

function getTotalInfo(layout: TableLayout, colIdx: number) {
  const numDims = layout.qHyperCube.qDimensionInfo.length;
  if (colIdx >= numDims) return layout.qHyperCube.qGrandTotalRow[colIdx - numDims]?.qText;
  if (colIdx === 0) return layout.totals?.label;
  return '';
}

const TotalsCell = ({ index, style, data }: TotalsCellProps) => {
  const {
    layout,
    totalsStyle: { hoverColors, ...applicableStyling },
  } = data;
  const label = getTotalInfo(layout, index);

  return (
    <div
      className="sn-table-cell"
      style={{
        ...style,
        ...applicableStyling,
        display: 'flex',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: index === 0 ? '0px 1px 0px 1px' : '0px 1px 0px 0px',
        padding: '4px',
        justifyContent: index === 0 ? 'left' : 'right',
        boxSizing: 'border-box',
        cursor: 'default',
      }}
    >
      <CellText>{label}</CellText>
    </div>
  );
};

export default TotalsCell;
