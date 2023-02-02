import { useState } from 'react';
import { Column } from '../../types';
import { MIN_COLUMN_WIDTH, ColumnWidthTypes } from '../constants';
import useDidUpdateEffect from './use-did-update-effect';
import useMeasureText, { MeasureTextHook } from '../virtualized-table/hooks/use-measure-text';

/**
 * Calculates column widths in pixels, based on column settings and the table width.
 * First, pixel values for the three independent types ('pixels', 'percentage', 'hug') are set.
 * Then the remaining width is divided equally between the 'fill' columns, if there is any
 * The widths are sorted in the order they will be displayed
 */
export const getColumnWidths = (
  columns: Column[],
  tableWidth: number,
  { measureText, estimateWidth }: MeasureTextHook
) => {
  if (!columns?.length || tableWidth === 0) return [];

  const columnWidths: number[] = [];
  const fillColumnIndexes: number[] = [];
  let sumFillWidths = tableWidth;

  columns.forEach((col, idx) => {
    if (col.columnWidth) {
      const {
        columnWidth: { type, pixels, percentage },
        label,
        qApprMaxGlyphCount,
      } = col;
      let newWidth = 0;

      const addKnownWidth = () => {
        columnWidths[idx] = Math.max(MIN_COLUMN_WIDTH, newWidth);
        sumFillWidths -= columnWidths[idx];
      };

      switch (type) {
        case ColumnWidthTypes.PIXELS:
          if (!pixels) throw new Error(`pixel value is not defined`);
          newWidth = pixels;
          addKnownWidth();
          break;
        case ColumnWidthTypes.PERCENTAGE:
          if (!percentage) throw new Error(`pixel value is not defined`);
          newWidth = (percentage / 100) * tableWidth;
          addKnownWidth();
          break;
        case ColumnWidthTypes.HUG:
          newWidth = Math.max(measureText(label), estimateWidth(qApprMaxGlyphCount));
          addKnownWidth();
          break;
        case ColumnWidthTypes.FILL:
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
      columnWidths[fillIdx] = Math.max(MIN_COLUMN_WIDTH, fillWidth);
    });
  }

  return columnWidths;
};

const useColumnWidths = (
  columns: Column[],
  tableWidth: number
): [number[], React.Dispatch<React.SetStateAction<number[]>>] => {
  const measureTextMethods = useMeasureText('13px', 'Arial');
  // TODO use actual font size (and font eventually)
  const [columnWidths, setColumnWidths] = useState(getColumnWidths(columns, tableWidth, measureTextMethods));

  useDidUpdateEffect(() => {
    setColumnWidths(getColumnWidths(columns, tableWidth, measureTextMethods));
  }, [columns, tableWidth]);

  return [columnWidths, setColumnWidths];
};

export default useColumnWidths;
