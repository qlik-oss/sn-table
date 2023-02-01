import { useCallback, useRef } from 'react';
import { VariableSizeGrid } from 'react-window';
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
  const { measureText } = useMeasureText(bodyStyle.fontSize, bodyStyle.fontFamily);

  const getCellSize = useCallback(
    (text: string, colIdx: number) => {
      const width = measureText(text);
      const estimatedLineCount = Math.ceil(width / (columnWidth[colIdx] - PADDING - BORDER));
      const height = Math.max(1, estimatedLineCount) * rowHeight;

      return height;
    },
    [columnWidth, measureText, rowHeight]
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
    },
    [getCellSize]
  );

  const getRowHeight = useCallback(
    (index: number) => rowMeta.current.heights[index] ?? rowHeight,
    [rowMeta, rowHeight]
  );

  const estimatedRowHeight = rowMeta.current.totalHeight / rowMeta.current.count;

  // Reset the internal cache of react-window, otherwise the size of empty cells
  // would be cached and used on each render
  gridRef.current?.resetAfterRowIndex(rowMeta.current.resetAfterRowIndex, false);

  return { setCellSize, getRowHeight, rowMeta, estimatedRowHeight };
};

export default useDynamicRowHeight;
