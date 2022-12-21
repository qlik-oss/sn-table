import React from 'react';
// import { getTotalInfo } from '../../../handle-data';
import { TableLayout } from '../../../types';
import { GeneratedStyling } from '../../types';

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
  const { layout, totalsStyle } = data;
  const label = getTotalInfo(layout, index);
  const isLastColumn = layout.qHyperCube.qSize.qcx - 1 === index;

  return (
    <div
      className="sn-table-cell"
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        borderColor: totalsStyle.borderColor,
        borderStyle: 'solid',
        borderWidth: isLastColumn ? '0px' : '0px 1px 0px 0px',
        padding: '0px 14px',
        justifyContent: index === 0 ? 'left' : 'right',
        boxSizing: 'border-box',
        cursor: 'default',
      }}
    >
      <span
        className="sn-table-cell-text"
        style={{
          fontSize: totalsStyle.fontSize,
          fontFamily: totalsStyle.fontFamily,
          fontWeight: 'bold',
          color: totalsStyle.color,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default TotalsCell;
