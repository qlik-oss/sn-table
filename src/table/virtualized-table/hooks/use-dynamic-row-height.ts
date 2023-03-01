import { useCallback, useRef, useState } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { Cell, Column, PageInfo, Row, TableLayout } from '../../../types';
import { COMMON_CELL_STYLING } from '../../styling-defaults';
import { GeneratedStyling } from '../../types';
import {
  CELL_BORDER_HEIGHT,
  CELL_PADDING_HEIGHT,
  LINE_HEIGHT as LINE_HEIGHT_MULTIPLIER,
} from '../../utils/styling-utils';
import { subtractCellPaddingAndBorder, subtractCellPaddingIconsAndBorder } from '../utils/cell-width-utils';
import { COLUMN_DATA_BUFFER_SIZE, MAX_NBR_LINES_OF_TEXT } from '../constants';
import { BodyStyle, GridState, RowMeta } from '../types';
import useMeasureText from './use-measure-text';
import useOnPropsChange from './use-on-props-change';

interface Props {
  style: BodyStyle | GeneratedStyling;
  rowHeight: number;
  rowCount: number;
  columnWidth: number[];
  layout: TableLayout;
  pageInfo: PageInfo;
  gridRef?: React.RefObject<VariableSizeGrid<any>>;
  lineRef?: React.RefObject<VariableSizeList<any>>;
  columns?: Column[];
  boldText?: boolean;
  gridState?: React.MutableRefObject<GridState>;
}

const MAX_ELEMENT_DOM_SIZE = 15_000_000; // Guestimated max height value in px of a DOM element

const useDynamicRowHeight = ({
  style,
  columnWidth,
  rowHeight,
  layout,
  pageInfo,
  rowCount,
  gridRef,
  lineRef,
  columns,
  boldText,
  gridState,
}: Props) => {
  const rowMeta = useRef<RowMeta>({
    lastScrollToRatio: 0,
    resetAfterRowIndex: 0, // TODO find a way to implement this, it can potentially improve performance
    heights: [],
    totalHeight: 0,
    count: 0,
    measuredCells: new Set<string>(),
  });
  const [estimatedRowHeight, setEstimatedRowHeight] = useState(rowHeight);
  const { measureText } = useMeasureText(style.fontSize, style.fontFamily, boldText);
  const lineHeight = parseInt(style.fontSize ?? COMMON_CELL_STYLING.fontSize, 10) * LINE_HEIGHT_MULTIPLIER;

  // Find a reasonable max line count to avoid issue where the react-window container DOM element gets too big
  const maxCellHeightExcludingPadding = MAX_ELEMENT_DOM_SIZE / rowCount - CELL_PADDING_HEIGHT - CELL_BORDER_HEIGHT;
  const maxLineCount = Math.max(
    0,
    Math.min(MAX_NBR_LINES_OF_TEXT, Math.round(maxCellHeightExcludingPadding / lineHeight))
  );

  const getCellSize = useCallback(
    (text: string, colIdx: number) => {
      const width = measureText(text.trim());
      const cellWidth = columns
        ? subtractCellPaddingIconsAndBorder(columnWidth[colIdx], columns[colIdx])
        : subtractCellPaddingAndBorder(columnWidth[colIdx]);
      const estimatedLineCount = Math.min(maxLineCount, Math.ceil(width / cellWidth));
      const textHeight = Math.max(1, estimatedLineCount) * lineHeight;

      return textHeight + CELL_PADDING_HEIGHT + CELL_BORDER_HEIGHT;
    },
    [columnWidth, measureText, lineHeight, maxLineCount, columns]
  );

  const setCellSize = useCallback(
    (text: string, rowIdx: number, colIdx: number) => {
      const key = `${rowIdx}-${colIdx}`;
      if (rowMeta.current.measuredCells.has(key)) {
        return;
      }

      rowMeta.current.measuredCells.add(key);
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

  useOnPropsChange(() => {
    rowMeta.current.lastScrollToRatio = 0;
    rowMeta.current.resetAfterRowIndex = 0;
    rowMeta.current.heights = [];
    rowMeta.current.totalHeight = 0;
    rowMeta.current.count = 0;
    rowMeta.current.measuredCells.clear();
  }, [layout, pageInfo, getCellSize]);

  const updateCellHeight = (rows: Row[]) => {
    if (!gridState) return;

    const { overscanRowStartIndex: rowStart, overscanRowStopIndex, overscanColumnStopIndex } = gridState.current;
    // By including COLUMN_DATA_BUFFER_SIZE here, the likely hood of cells changing size once the user releases
    // the column resizer should be reduced
    const columnStop = Math.min(overscanColumnStopIndex + COLUMN_DATA_BUFFER_SIZE, layout.qHyperCube.qSize.qcx - 1);
    const rowStop = Math.min(overscanRowStopIndex, layout.qHyperCube.qSize.qcy - 1);

    for (let rowIdx = rowStart; rowIdx <= rowStop; rowIdx++) {
      const row = rows[rowIdx];
      if (row) {
        for (let colIdx = 0; colIdx <= columnStop; colIdx++) {
          const cell = row[`col-${colIdx}`] as Cell;
          if (cell) {
            setCellSize(cell.qText ?? '', rowIdx, colIdx);
          }
        }
      }
    }
  };

  // Reset the internal cache of react-window, otherwise the size of empty cells
  // would be cached and used on each render
  if (gridRef?.current) {
    gridRef.current.resetAfterRowIndex(rowMeta.current.resetAfterRowIndex, false);
  } else if (lineRef?.current) {
    lineRef.current.resetAfterIndex(rowMeta.current.resetAfterRowIndex, false);
  }

  return { setCellSize, getRowHeight, rowMeta, estimatedRowHeight, maxLineCount, updateCellHeight };
};

export default useDynamicRowHeight;
