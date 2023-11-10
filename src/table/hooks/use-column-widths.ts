import { ColumnWidthType, ColumnWidthValues } from "@qlik/nebula-table-utils/lib/constants";
import { useMeasureText, useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import { useMemo, useState } from "react";
import { Column, TotalsPosition } from "../../types";
import {
  ADJUSTED_HEADER_WIDTH,
  BORDER_WIDTH,
  FLEX_BOX_GAP,
  LOOK_BUTTON_AND_AUTO_MARGIN,
  TOTALS_PADDING,
} from "../styling-defaults";
import { TableStyling } from "../types";
import { MAX_NBR_LINES_OF_TEXT } from "../virtualized-table/constants";

type GetFitToContentWidth = (headLabel: string, totalsLabel: string, glyphCount: number, isLocked: boolean) => number;

/**
 * Calculates column widths in pixels, based on column settings and the table width.
 * First, pixel values for the three independent types ('pixels', 'percentage', 'fitToContent') are set.
 * Then the remaining width is divided equally between the auto columns, if there are any
 * The widths are sorted in the order they will be displayed
 */
export const getColumnWidths = (columns: Column[], tableWidth: number, getFitToContentWidth: GetFitToContentWidth) => {
  if (!columns?.length) return [];

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
        columnWidths[idx] = Math.min(ColumnWidthValues.PixelsMax, Math.max(ColumnWidthValues.PixelsMinTable, newWidth));
        sumAutoWidths -= columnWidths[idx];
      };

      switch (type) {
        case ColumnWidthType.Pixels:
          newWidth = pixels || ColumnWidthValues.PixelsDefault;
          addKnownWidth();
          break;
        case ColumnWidthType.Percentage:
          newWidth = ((percentage || ColumnWidthValues.PercentageDefault) / 100) * tableWidth;
          addKnownWidth();
          break;
        case ColumnWidthType.FitToContent:
          newWidth = getFitToContentWidth(label, totalInfo, qApprMaxGlyphCount, col.isLocked);
          addKnownWidth();
          break;
        case ColumnWidthType.Auto:
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
      columnWidths[autoIdx] = Math.max(ColumnWidthValues.PixelsMinTable, autoWidth);
    });
  }

  return columnWidths;
};

const isBodyWidthLessThenContainerWidth = (columnWidths: number[], yScrollbarWidth: number, tableWidth: number) =>
  columnWidths && columnWidths.length > 0 ? columnWidths.reduce((a, b) => a + b) + yScrollbarWidth < tableWidth : false;

const useColumnWidths = (
  columns: Column[],
  totalsPosition: TotalsPosition,
  tableWidth: number,
  { head, body }: TableStyling
): [
  number[],
  React.Dispatch<React.SetStateAction<number[]>>,
  React.Dispatch<React.SetStateAction<number>>,
  boolean
] => {
  const showTotals = totalsPosition.atBottom || totalsPosition.atTop;
  const measureHeadLabel = useMeasureText({
    ...head,
    bold: true,
    maxNbrLinesOfText: MAX_NBR_LINES_OF_TEXT,
  }).measureText;
  const measureTotalLabel = useMeasureText({
    ...body,
    bold: true,
    maxNbrLinesOfText: MAX_NBR_LINES_OF_TEXT,
  }).measureText;
  const { estimateWidth } = useMeasureText({ ...head, bold: false, maxNbrLinesOfText: MAX_NBR_LINES_OF_TEXT });

  const getFitToContentWidth = useMemo<GetFitToContentWidth>(
    () => (headLabel, totalsLabel, glyphCount, isLocked) => {
      const HEAD_LABEL_WIDTH = isLocked
        ? LOOK_BUTTON_AND_AUTO_MARGIN + ADJUSTED_HEADER_WIDTH + FLEX_BOX_GAP
        : ADJUSTED_HEADER_WIDTH;
      return Math.max(
        measureHeadLabel(headLabel) + HEAD_LABEL_WIDTH,
        showTotals ? measureTotalLabel(totalsLabel) + TOTALS_PADDING + BORDER_WIDTH : 0,
        estimateWidth(glyphCount)
      );
    },
    [estimateWidth, measureHeadLabel, measureTotalLabel, showTotals]
  );
  const [yScrollbarWidth, setYScrollbarWidth] = useState(0);

  const [columnWidths, setColumnWidths] = useState(() => getColumnWidths(columns, tableWidth, getFitToContentWidth));

  useOnPropsChange(() => {
    setColumnWidths(getColumnWidths(columns, tableWidth - yScrollbarWidth, getFitToContentWidth));
  }, [columns, tableWidth, yScrollbarWidth, getFitToContentWidth]);

  const showRightBorder = useMemo(
    () => isBodyWidthLessThenContainerWidth(columnWidths, yScrollbarWidth, tableWidth),
    [columnWidths, yScrollbarWidth, tableWidth]
  );

  return [columnWidths, setColumnWidths, setYScrollbarWidth, showRightBorder];
};

export default useColumnWidths;
