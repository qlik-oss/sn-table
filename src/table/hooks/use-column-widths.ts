// import { useState, useMemo, useEffect } from 'react';
import { Column } from '../../types';

const getHugWidth = (column: Column) => {
  const el = document.createElement('canvas').getContext('2d');
  if (el) {
    el.font = '12px arial';
    const headerWidthEst = el.measureText(column.label).width + 25;
    const bodyWidthEst = el.measureText('M').width * column.qApprMaxGlyphCount + 25;
    return Math.max(headerWidthEst, bodyWidthEst);
  }
  return 0;
};

export default function getColumnWidths(columns: Column[], containerWidth: number) {
  if (!columns?.length || containerWidth === 0) return [];

  const MIN_WIDTH = 100;
  const columnWidths: number[] = [];
  const fillColumnIdxs: number[] = [];
  let allFillWidths = containerWidth;

  columns.forEach((col, idx) => {
    let newWidth = 0;

    switch (col.columnSizeType) {
      case 'pixels':
        newWidth = col.columnSize;
        break;
      case 'percentage':
        newWidth = (col.columnSize / 100) * containerWidth;
        break;
      case 'hug':
        newWidth = getHugWidth(col);
        break;
      case 'fill':
      case undefined:
        // stores the indexes of fill columns to loop over later
        fillColumnIdxs.push(idx);
        break;
      default:
        break;
    }

    if (col.columnSizeType && col.columnSizeType !== 'fill') {
      columnWidths[idx] = Math.max(MIN_WIDTH, newWidth);
      allFillWidths -= columnWidths[idx];
    }
  });

  if (fillColumnIdxs.length) {
    // divides remaining width evenly between fill columns
    const fillWidth = allFillWidths / fillColumnIdxs.length;
    fillColumnIdxs.forEach((fillIdx) => {
      columnWidths[fillIdx] = Math.max(MIN_WIDTH, fillWidth);
    });
  }

  return columnWidths;
}

// const useColumnWidth = (containerWidth: number, columns: Column[]) => {
//   const { measureText, estimateWidth } = useMeasureText('13px', 'Arial');
//   const widths = useMemo(
//     () =>
//       columns.map((c) => {
//         // const fillWidth = rect.width / columns.length;
//         const maxWidth = Math.max(measureText(c.label), estimateWidth(c.qApprMaxGlyphCount));
//         // return Math.min(500, maxWidth);
//         return maxWidth;
//       }),
//     [containerWidth, columns, measureText, estimateWidth]
//   );
//   return widths;
// };
// export default useColumnSize;
