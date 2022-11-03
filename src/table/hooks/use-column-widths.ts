import { useState } from 'react';
import { Column } from '../../types';
import useEstimateWidth from './use-estimate-width';
import { EstimateWidth } from '../types';
import useDidUpdateEffect from './use-did-update-effect';

/**
 * Calculates column widths in pixels, based on column settings and the table width.
 * First, pixel values for the three independent types ('pixels', 'percentage', 'hug') are set.
 * Then the remaining width is divided equally between the 'fill' columns, if there is any
 * The widths are sorted in the order they will be displayed
 */
export const getColumnWidths = (columns: Column[], tableWidth: number, estimateWidth: EstimateWidth) => {
  if (!columns?.length || tableWidth === 0) return [];

  const MIN_WIDTH = 100;
  const columnWidths: number[] = [];
  const fillColumnIndexes: number[] = [];
  let sumFillWidths = tableWidth;

  columns.forEach((col, idx) => {
    if (col.columnSize) {
      const {
        columnSize: { type, widthPx, widthPr },
      } = col;
      let newWidth = 0;

      const replaceKnownWidth = () => {
        columnWidths[idx] = Math.max(MIN_WIDTH, newWidth);
        sumFillWidths -= columnWidths[idx];
      };

      switch (type) {
        case 'pixels':
          newWidth = widthPx;
          replaceKnownWidth();
          break;
        case 'percentage':
          newWidth = (widthPr / 100) * tableWidth;
          replaceKnownWidth();
          break;
        case 'hug':
          newWidth = estimateWidth(col);
          replaceKnownWidth();
          break;
        case 'fill':
        case undefined:
          // stores the indexes of fill columns to loop over later
          fillColumnIndexes.push(idx);
          break;
        default:
          throw new Error(`${type} is not a valid column width type`);
      }
    } else {
      fillColumnIndexes.push(idx);
    }
  });

  if (fillColumnIndexes.length) {
    // divides remaining width evenly between fill columns
    const fillWidth = sumFillWidths / fillColumnIndexes.length;
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
  // TODO use actual font size (and font eventually)
  const estimateWidth = useEstimateWidth('13px', 'Arial');
  const [columnWidths, setColumnWidths] = useState(getColumnWidths(columns, tableWidth, estimateWidth));

  useDidUpdateEffect(() => {
    setColumnWidths(getColumnWidths(columns, tableWidth, estimateWidth));
  }, [columns, tableWidth]);

  return [columnWidths, setColumnWidths];
};

export default useColumnWidth;
