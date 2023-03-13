import { useState, useMemo } from 'react';
import { Column, TotalsPosition } from '../../types';
import {
  MIN_COLUMN_WIDTH,
  ColumnWidthTypes,
  DEFAULT_COLUMN_PIXEL_WIDTH,
  DEFAULT_COLUMN_PERCENTAGE_WIDTH,
  MAX_COLUMN_WIDTH,
} from '../constants';
import useMeasureText from '../virtualized-table/hooks/use-measure-text';
import { TableStyling } from '../types';
import useOnPropsChange from '../virtualized-table/hooks/use-on-props-change';
import { BORDER_WIDTH } from '../styling-defaults';

type GetHugWidth = (headLabel: string, totalsLabel: string, glyphCount: number, isLocked: boolean) => number;

const HEADER_CELL_BUTTON_PADDING = 8 * 2;
const HEADER_CELL_PADDING = 4 * 2;
const SORT_ICON = 12 + 8 + 2;
const MENU_BUTTON = 24;
const FLEX_BOX_GAP = 4;
const LOOK_BUTTON_AND_AUTO_MARGIN = 20 + 4;
const ADJUSTED_HEADER_WIDTH =
  HEADER_CELL_BUTTON_PADDING + HEADER_CELL_PADDING + SORT_ICON + MENU_BUTTON + FLEX_BOX_GAP + BORDER_WIDTH;
const TOTALS_PADDING = 12 * 2;

/**
 * Calculates column widths in pixels, based on column settings and the table width.
 * First, pixel values for the three independent types ('pixels', 'percentage', 'fitToContent') are set.
 * Then the remaining width is divided equally between the auto columns, if there are any
 * The widths are sorted in the order they will be displayed
 */
export const getColumnWidths = (columns: Column[], tableWidth: number, getHugWidth: GetHugWidth) => {
  if (!columns?.length || tableWidth === 0) return [];

  const columnWidths: number[] = [];
  const autoColumnIndexes: number[] = [];
  let sumAutoWidths = tableWidth;

  columns.forEach((col, idx) => {
    if (col.columnWidth) {
      const {
        columnWidth: { type, pixels, percentage },
        label,
        qApprMaxGlyphCount,
        totalInfo,
      } = col;
      let newWidth = 0;

      const addKnownWidth = () => {
        columnWidths[idx] = Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, newWidth));
        sumAutoWidths -= columnWidths[idx];
      };

      switch (type) {
        case ColumnWidthTypes.PIXELS:
          newWidth = pixels || DEFAULT_COLUMN_PIXEL_WIDTH;
          addKnownWidth();
          break;
        case ColumnWidthTypes.PERCENTAGE:
          newWidth = ((percentage || DEFAULT_COLUMN_PERCENTAGE_WIDTH) / 100) * tableWidth;
          addKnownWidth();
          break;
        case ColumnWidthTypes.FIT_TO_CONTENT:
          newWidth = getHugWidth(label, totalInfo, qApprMaxGlyphCount, col.isLocked);
          addKnownWidth();
          break;
        case ColumnWidthTypes.AUTO:
          // stores the indexes of auto columns to loop over later
          autoColumnIndexes.push(idx);
          break;
        default:
          throw new Error(`${type} is not a valid column width type`);
      }
    } else {
      autoColumnIndexes.push(idx);
    }
  });

  if (autoColumnIndexes.length) {
    // divides remaining width evenly between auto columns
    const autoWidth = sumAutoWidths / autoColumnIndexes.length;
    autoColumnIndexes.forEach((autoIdx) => {
      columnWidths[autoIdx] = Math.max(MIN_COLUMN_WIDTH, autoWidth);
    });
  }

  return columnWidths;
};

const useColumnWidths = (
  columns: Column[],
  totalsPosition: TotalsPosition,
  tableWidth: number,
  { head, body }: TableStyling
): [number[], React.Dispatch<React.SetStateAction<number[]>>, React.Dispatch<React.SetStateAction<number>>] => {
  const showTotals = totalsPosition.atBottom || totalsPosition.atTop;
  const measureHeadLabel = useMeasureText(head.fontSize, head.fontFamily).measureText;
  const { measureText, estimateWidth } = useMeasureText(body.fontSize, body.fontFamily);
  const getHugWidth = useMemo<GetHugWidth>(
    () => (headLabel, totalsLabel, glyphCount, isLocked) => {
      const HEAD_LABEL_WIDTH = isLocked
        ? LOOK_BUTTON_AND_AUTO_MARGIN + ADJUSTED_HEADER_WIDTH + FLEX_BOX_GAP
        : ADJUSTED_HEADER_WIDTH;
      return Math.max(
        measureHeadLabel(headLabel) + HEAD_LABEL_WIDTH,
        showTotals ? measureText(totalsLabel) + TOTALS_PADDING + BORDER_WIDTH : 0,
        estimateWidth(glyphCount)
      );
    },
    [estimateWidth, measureHeadLabel, measureText, showTotals]
  );
  const [yScrollbarWidth, setYScrollbarWidth] = useState(0);

  const [columnWidths, setColumnWidths] = useState(() => getColumnWidths(columns, tableWidth, getHugWidth));

  useOnPropsChange(() => {
    setColumnWidths(getColumnWidths(columns, tableWidth - yScrollbarWidth, getHugWidth));
  }, [columns, tableWidth, yScrollbarWidth, getHugWidth]);

  return [columnWidths, setColumnWidths, setYScrollbarWidth];
};

export default useColumnWidths;
