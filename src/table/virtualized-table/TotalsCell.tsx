import React from 'react';
// import { getTotalInfo } from '../../../handle-data';
import { TableLayout } from '../../types';
import { useContextSelector, TableContext } from '../context';
import { GeneratedStyling } from '../types';
import CellText from '../components/CellText';

interface TotalsCellProps {
  index: number;
  style: React.CSSProperties;
  data: {
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
  const { layout } = useContextSelector(TableContext, (value) => value.baseProps);
  const {
    totalsStyle: { hoverColors, ...applicableStyling },
  } = data;
  const label = getTotalInfo(layout, index);
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
      }}
    >
      <CellText singleLine>{label}</CellText>
    </div>
  );
};

export default TotalsCell;
