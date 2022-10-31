import { useState } from 'react';
import { Column } from '../../types';
import useEstimateWidth from './use-estimate-width';
import { EstimateWidth } from '../types';
import useDidUpdateEffect from './use-did-update-effect';

export const getColumnWidths = (columns: Column[], tableWidth: number, estimateWidth: EstimateWidth) => {
  if (!columns?.length || tableWidth === 0) return [];

  const MIN_WIDTH = 100;
  const columnWidths: number[] = [];
  const fillColumnIndexes: number[] = [];
  let allFillWidths = tableWidth;

  columns.forEach((col, idx) => {
    let newWidth = 0;

    switch (col.columnSizeType) {
      case 'pixels':
        newWidth = col.columnSize;
        break;
      case 'percentage':
        newWidth = (col.columnSize / 100) * tableWidth;
        break;
      case 'hug':
        newWidth = estimateWidth(col);
        break;
      case 'fill':
      case undefined:
        // stores the indexes of fill columns to loop over later
        fillColumnIndexes.push(idx);
        break;
      default:
        break;
    }

    if (col.columnSizeType && col.columnSizeType !== 'fill') {
      columnWidths[idx] = Math.max(MIN_WIDTH, newWidth);
      allFillWidths -= columnWidths[idx];
    }
  });

  if (fillColumnIndexes.length) {
    // divides remaining width evenly between fill columns
    const fillWidth = allFillWidths / fillColumnIndexes.length;
    fillColumnIndexes.forEach((fillIdx) => {
      columnWidths[fillIdx] = Math.max(MIN_WIDTH, fillWidth);
    });
  }

  return columnWidths;
};

const useColumnWidth = (
  columns: Column[],
  tableWidth: number
): [number[], React.Dispatch<React.SetStateAction<number[]>>] => {
  const estimateWidth = useEstimateWidth('13px', 'Arial');
  const [columnWidths, setColumnWidths] = useState(getColumnWidths(columns, tableWidth, estimateWidth));

  useDidUpdateEffect(() => {
    setColumnWidths(getColumnWidths(columns, tableWidth, estimateWidth));
  }, [columns, tableWidth]);

  return [columnWidths, setColumnWidths];
};

export default useColumnWidth;
