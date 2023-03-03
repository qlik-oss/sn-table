import { useCallback, useEffect, useRef, useState } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { Column, PageInfo } from '../../../types';
import { TableContext, useContextSelector } from '../../context';
import { COMMON_CELL_STYLING } from '../../styling-defaults';
import { GeneratedStyling } from '../../types';
import {
  CELL_BORDER_HEIGHT,
  CELL_PADDING_HEIGHT,
  LINE_HEIGHT as LINE_HEIGHT_MULTIPLIER,
} from '../../utils/styling-utils';
import { MAX_NBR_LINES_OF_TEXT, MIN_BODY_ROW_HEIGHT } from '../constants';
import { BodyStyle, RowMeta } from '../types';
import { subtractCellPaddingAndBorder, subtractCellPaddingIconsAndBorder } from '../utils/cell-width-utils';
import useMeasureText from './use-measure-text';

interface Props {
  style: BodyStyle | GeneratedStyling;
  rowHeight?: number;
  rowCount: number;
  columnWidths: number[];
  pageInfo: PageInfo;
  gridRef?: React.RefObject<VariableSizeGrid<any>>;
  lineRef?: React.RefObject<VariableSizeList<any>>;
  columns?: Column[];
  boldText?: boolean;
}

const MAX_ELEMENT_DOM_SIZE = 15_000_000; // Guestimated max height value in px of a DOM element

const useDynamicRowHeight = ({
  style,
  columnWidths,
  rowHeight,
  pageInfo,
  rowCount,
  gridRef,
  lineRef,
  columns,
  boldText,
}: Props) => {
  const rowMeta = useRef<RowMeta>({
    lastScrollToRatio: 0,
    resetAfterRowIndex: 0, // TODO find a way to implement this, it can potentially improve performance
    heights: [],
    totalHeight: 0,
    count: 0,
  });
  const { layout } = useContextSelector(TableContext, (value) => value.baseProps);
  const [estimatedRowHeight, setEstimatedRowHeight] = useState(rowHeight || MIN_BODY_ROW_HEIGHT);
  const { measureText } = useMeasureText(style.fontSize, style.fontFamily, boldText);
  const lineHeight = parseInt(style.fontSize ?? COMMON_CELL_STYLING.fontSize, 10) * LINE_HEIGHT_MULTIPLIER;

  // Find a reasonable max line count to avoid issue where the react-window container DOM element gets too big
  const maxCellHeightExcludingPadding = MAX_ELEMENT_DOM_SIZE / rowCount - CELL_PADDING_HEIGHT - CELL_BORDER_HEIGHT;
  const maxLineCount = Math.max(
    0,
    Math.min(MAX_NBR_LINES_OF_TEXT, Math.round(maxCellHeightExcludingPadding / lineHeight))
  );

  useEffect(() => {
    rowMeta.current = {
      lastScrollToRatio: 0,
      resetAfterRowIndex: 0,
      heights: [],
      totalHeight: 0,
      count: 0,
    };
  }, [columnWidths, layout, pageInfo]);

  const getCellSize = useCallback(
    (text: string, colIdx: number) => {
      const width = measureText(text.trim());
      const cellWidth = columns
        ? subtractCellPaddingIconsAndBorder(columnWidths[colIdx], columns[colIdx])
        : subtractCellPaddingAndBorder(columnWidths[colIdx]);
      const estimatedLineCount = Math.min(maxLineCount, Math.ceil(width / cellWidth));
      const textHeight = Math.max(1, estimatedLineCount) * lineHeight;

      return textHeight + CELL_PADDING_HEIGHT + CELL_BORDER_HEIGHT;
    },
    [columnWidths, measureText, lineHeight, maxLineCount, columns]
  );

  const setCellSize = useCallback(
    (text: string, rowIdx: number, colIdx: number) => {
      const height = getCellSize(text, colIdx);
      const alreadyMeasuredRowHeight = rowMeta.current.heights[rowIdx];
      const diff = height - alreadyMeasuredRowHeight;

      if (diff > 0) {
        rowMeta.current.totalHeight += diff;
        rowMeta.current.heights[rowIdx] = height;
      } else if (alreadyMeasuredRowHeight === undefined) {
        rowMeta.current.count += 1;
        rowMeta.current.totalHeight += height;
        rowMeta.current.heights[rowIdx] = height;
      }

      setEstimatedRowHeight(rowMeta.current.totalHeight / rowMeta.current.count);
    },
    [getCellSize]
  );

  const getRowHeight = useCallback(
    (index: number) => rowMeta.current.heights[index] ?? estimatedRowHeight,
    [rowMeta, estimatedRowHeight]
  );

  // Reset the internal cache of react-window, otherwise the size of empty cells
  // would be cached and used on each render
  if (gridRef?.current) {
    gridRef.current.resetAfterRowIndex(rowMeta.current.resetAfterRowIndex, false);
  } else if (lineRef?.current) {
    lineRef.current.resetAfterIndex(rowMeta.current.resetAfterRowIndex, false);
  }

  return { setCellSize, getRowHeight, rowMeta, estimatedRowHeight, maxLineCount };
};

export default useDynamicRowHeight;
