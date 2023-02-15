import { useMemo, useState } from 'react';
import { Column, ExtendedTheme, TableData, TableLayout } from '../../types';
import {
  MIN_COLUMN_WIDTH,
  ColumnWidthTypes,
  DEFAULT_COLUMN_PIXEL_WIDTH,
  DEFAULT_COLUMN_PERCENTAGE_WIDTH,
  MAX_COLUMN_WIDTH,
} from '../constants';
import useDidUpdateEffect from './use-did-update-effect';
import useMeasureText from '../virtualized-table/hooks/use-measure-text';
import { TableStyling } from '../types';
import { getBodyStyle, getHeaderStyle, getTotalsStyle } from '../utils/styling-utils';

type GetHugWidth = (headLabel: string, totalsLabel: string, glyphCount: number) => number;

/**
 * Calculates column widths in pixels, based on column settings and the table width.
 * First, pixel values for the three independent types ('pixels', 'percentage', 'hug') are set.
 * Then the remaining width is divided equally between the 'fill' columns, if there is any
 * The widths are sorted in the order they will be displayed
 */
export const getColumnWidths = (columns: Column[], tableWidth: number, getHugWidth: GetHugWidth) => {
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
        totalInfo,
      } = col;
      let newWidth = 0;

      const addKnownWidth = () => {
        columnWidths[idx] = Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, newWidth));
        sumFillWidths -= columnWidths[idx];
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
        case ColumnWidthTypes.HUG:
          newWidth = getHugWidth(label, totalInfo, qApprMaxGlyphCount);
          addKnownWidth();
          break;
        case ColumnWidthTypes.FILL:
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

const useColumnWidthsAndStyling = (
  layout: TableLayout,
  theme: ExtendedTheme,
  { columns, rows, totalsPosition }: TableData,
  rootElement: HTMLElement
): [number[], React.Dispatch<React.SetStateAction<number[]>>, TableStyling] => {
  const tableWidth = rootElement.clientWidth;
  const tableHeight = rootElement.clientHeight;

  const { head, body, totals } = useMemo(() => {
    const totalsAtTop = totalsPosition.atTop;
    return {
      body: getBodyStyle(layout, theme, rows.length, tableHeight),
      head: getHeaderStyle(layout, theme, !totalsAtTop),
      totals: getTotalsStyle(layout, theme, totalsAtTop),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, theme.name(), rows, totalsPosition, tableHeight]);

  const measureHeadLabel = useMeasureText(head.fontSize, head.fontFamily).measureText;
  const { measureText, estimateWidth } = useMeasureText(body.fontSize, body.fontFamily);
  const getHugWidth = (headLabel: string, totalsLabel: string, glyphCount: number) =>
    Math.max(measureHeadLabel(headLabel), measureText(totalsLabel), estimateWidth(glyphCount));

  const [columnWidths, setColumnWidths] = useState(() => getColumnWidths(columns, tableWidth, getHugWidth));

  const styling = useMemo<TableStyling>(() => {
    const showRightBorder = columnWidths.reduce((sum, w) => sum + w, 0) < tableWidth;
    const rightBorderStyling = {
      '&:last-child': {
        borderRightWidth: showRightBorder ? '1px' : '0px',
      },
    };
    return {
      body: { ...body, ...rightBorderStyling },
      head: { ...head, ...rightBorderStyling },
      totals: { ...totals, ...rightBorderStyling },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, tableWidth, body, head, totals]);

  useDidUpdateEffect(() => {
    setColumnWidths(getColumnWidths(columns, tableWidth, getHugWidth));
  }, [columns, tableWidth]);

  return [columnWidths, setColumnWidths, styling];
};

export default useColumnWidthsAndStyling;
