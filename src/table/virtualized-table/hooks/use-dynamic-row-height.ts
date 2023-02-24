import { useCallback, useEffect, useRef, useState } from 'react';
import { VariableSizeGrid } from 'react-window';
import { PageInfo, TableLayout } from '../../../types';
import { COMMON_CELL_STYLING } from '../../styling-defaults';
import {
  CELL_BORDER_HEIGHT,
  CELL_PADDING_HEIGHT,
  LINE_HEIGHT as LINE_HEIGHT_MULTIPLIER,
} from '../../utils/styling-utils';
import { MAX_NBR_LINES_OF_TEXT } from '../constants';
import { BodyStyle, RowMeta } from '../types';
import { subtractCellPaddingAndBorder } from '../utils/cell-width-utils';
import useMeasureText from './use-measure-text';

interface Props {
  bodyStyle: BodyStyle;
  rowHeight: number;
  rowCount: number;
  columnWidth: number[];
  gridRef: React.RefObject<VariableSizeGrid<any>>;
  layout: TableLayout;
  pageInfo: PageInfo;
}

const MAX_ELEMENT_DOM_SIZE = 15_000_000; // Guestimated max height value in px of a DOM element

const useDynamicRowHeight = ({ bodyStyle, columnWidth, gridRef, rowHeight, layout, pageInfo, rowCount }: Props) => {
  const rowMeta = useRef<RowMeta>({
    lastScrollToRatio: 0,
    resetAfterRowIndex: 0, // TODO find a way to implement this, it can potentially improve performance
    heights: [],
    totalHeight: 0,
    count: 0,
  });
  const [estimatedRowHeight, setEstimatedRowHeight] = useState(rowHeight);
  const { measureText } = useMeasureText(bodyStyle.fontSize, bodyStyle.fontFamily);
  const lineHeight = parseInt(bodyStyle.fontSize ?? COMMON_CELL_STYLING.fontSize, 10) * LINE_HEIGHT_MULTIPLIER;

  // Find a reasonable max line count to avoid issue where the react-window container DOM element gets too big
  const maxCellHeightExcluingPadding = MAX_ELEMENT_DOM_SIZE / rowCount - CELL_PADDING_HEIGHT - CELL_BORDER_HEIGHT;
  const maxLineCount = Math.max(
    0,
    Math.min(MAX_NBR_LINES_OF_TEXT, Math.round(maxCellHeightExcluingPadding / lineHeight))
  );

  useEffect(() => {
    rowMeta.current = {
      lastScrollToRatio: 0,
      resetAfterRowIndex: 0,
      heights: [],
      totalHeight: 0,
      count: 0,
    };
  }, [columnWidth, layout, pageInfo]);

  const getCellSize = useCallback(
    (text: string, colIdx: number) => {
      const width = measureText(text.trim());
      const cellWidth = subtractCellPaddingAndBorder(columnWidth[colIdx]);
      const estimatedLineCount = Math.min(maxLineCount, Math.ceil(width / cellWidth));
      const textHeight = Math.max(1, estimatedLineCount) * lineHeight;

      return textHeight + CELL_PADDING_HEIGHT + CELL_BORDER_HEIGHT;
    },
    [columnWidth, measureText, lineHeight, maxLineCount]
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
  gridRef.current?.resetAfterRowIndex(rowMeta.current.resetAfterRowIndex, false);

  return { setCellSize, getRowHeight, rowMeta, estimatedRowHeight, maxLineCount };
};

export default useDynamicRowHeight;
