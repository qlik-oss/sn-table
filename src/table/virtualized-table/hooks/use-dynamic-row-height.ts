import { useCallback, useRef, useState } from 'react';
import { VariableSizeGrid } from 'react-window';
import { COMMON_CELL_STYLING } from '../../styling-defaults';
import { CELL_BORDER_HEIGHT, CELL_PADDING_HEIGHT, LINE_HEIGHT } from '../../utils/styling-utils';
import { PADDING_LEFT_RIGHT } from '../constants';
import { BodyStyle, RowMeta } from '../types';
import useMeasureText from './use-measure-text';

interface Props {
  bodyStyle: BodyStyle;
  rowHeight: number;
  columnWidth: number[];
  gridRef: React.RefObject<VariableSizeGrid<any>>;
}

const PADDING = PADDING_LEFT_RIGHT * 2;
const BORDER = 1;

const useDynamicRowHeight = ({ bodyStyle, columnWidth, gridRef, rowHeight }: Props) => {
  const rowMeta = useRef<RowMeta>({
    lastScrollToRatio: 0,
    resetAfterRowIndex: 0, // TODO find a way to implement this, it can potentially improve performance
    heights: [],
    totalHeight: 0,
    count: 0,
  });
  const [estimatedRowHeight, setEstimatedRowHeight] = useState(rowHeight);
  const { measureText } = useMeasureText(bodyStyle.fontSize, bodyStyle.fontFamily);
  const lineHeight = parseInt(bodyStyle.fontSize ?? COMMON_CELL_STYLING.fontSize, 10) * LINE_HEIGHT;

  const getCellSize = useCallback(
    (text: string, colIdx: number) => {
      const width = measureText(text);
      // Cap the max number of supported lines to avoid issues with to large DOM element with 250k rows of data * 10 lines per row
      const estimatedLineCount = Math.min(10, Math.ceil(width / (columnWidth[colIdx] - PADDING - BORDER)));
      const height = Math.max(1, estimatedLineCount) * lineHeight;

      return height + CELL_PADDING_HEIGHT + CELL_BORDER_HEIGHT;
    },
    [columnWidth, measureText, lineHeight]
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

  return { setCellSize, getRowHeight, rowMeta, estimatedRowHeight };
};

export default useDynamicRowHeight;
