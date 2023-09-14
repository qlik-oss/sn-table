import { useCallback, useRef, useState } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { useOnPropsChange } from '@qlik-oss/nebula-table-utils/lib/hooks';
import { Column, PageInfo, Row, ViewService } from '../../../types';
import { TableContext, useContextSelector } from '../../context';
import { COMMON_CELL_STYLING } from '../../styling-defaults';
import { GeneratedStyling } from '../../types';
import {
  CELL_BORDER_HEIGHT,
  CELL_PADDING_HEIGHT,
  LINE_HEIGHT as LINE_HEIGHT_MULTIPLIER,
} from '../../utils/styling-utils';
import { MAX_NBR_LINES_OF_TEXT, MIN_BODY_ROW_HEIGHT } from '../constants';
import { BodyStyle, GridState, RowMeta } from '../types';
import { getAdjustedCellWidth, getAdjustedHeadCellWidth } from '../utils/cell-width-utils';
import useMeasureText from './use-measure-text';
import useMutableProp from './use-mutable-prop';

export interface UseDynamicRowHeightProps {
  style: BodyStyle | GeneratedStyling;
  rowHeight?: number;
  rowCount: number;
  columnWidths: number[];
  pageInfo: PageInfo;
  gridRef?: React.RefObject<VariableSizeGrid<any>>;
  lineRef?: React.RefObject<VariableSizeList<any>>;
  columns?: Column[];
  boldText?: boolean;
  gridState?: React.MutableRefObject<GridState>;
  isSnapshot: boolean;
  viewService: ViewService;
  maxNbrLines?: number;
}

const MAX_ELEMENT_DOM_SIZE = 8_000_000; // Guestimated max height value in px of a DOM element

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
  gridState,
  isSnapshot,
  viewService,
  maxNbrLines = MAX_NBR_LINES_OF_TEXT,
}: UseDynamicRowHeightProps) => {
  const rowMeta = useRef<RowMeta>({
    lastScrollToRatio: 0,
    resetAfterRowIndex: 0, // TODO find a way to implement this, it can potentially improve performance
    heights: [],
    totalHeight: 0,
    count: 0,
    measuredCells: new Map<string, [string, number, number, boolean]>(),
  });
  const { layout, rect } = useContextSelector(TableContext, (value) => value.baseProps);
  const [estimatedRowHeight, setEstimatedRowHeight] = useState(rowHeight || MIN_BODY_ROW_HEIGHT);
  const { measureText, estimateLineCount } = useMeasureText(style.fontSize, style.fontFamily, boldText);
  const lineHeight = parseInt(style.fontSize ?? COMMON_CELL_STYLING.fontSize, 10) * LINE_HEIGHT_MULTIPLIER;

  // Find a reasonable max line count to avoid issue where the react-window container DOM element gets too big
  const maxCellHeightExcludingPadding = MAX_ELEMENT_DOM_SIZE / rowCount - CELL_PADDING_HEIGHT - CELL_BORDER_HEIGHT;
  const maxLineCount = Math.max(0, Math.min(maxNbrLines, Math.round(maxCellHeightExcludingPadding / lineHeight)));

  const getCellSize = useCallback(
    (text: string, colIdx: number, isNumeric: boolean) => {
      const cellWidth = columns
        ? getAdjustedHeadCellWidth(columnWidths[colIdx], columns[colIdx])
        : getAdjustedCellWidth(columnWidths[colIdx]);
      const estimatedLineCount = Math.min(
        maxLineCount,
        estimateLineCount({ text: text.trim(), maxWidth: cellWidth, isNumeric })
      );
      const textHeight = Math.max(1, estimatedLineCount) * lineHeight;

      return textHeight + CELL_PADDING_HEIGHT + CELL_BORDER_HEIGHT;
    },
    [columnWidths, lineHeight, maxLineCount, columns, estimateLineCount]
  );

  const setCellSize = useCallback(
    (text: string, rowIdx: number, colIdx: number, isNumeric = false, batchStateUpdate = false) => {
      const key = `${rowIdx}-${colIdx}`;
      if (rowMeta.current.measuredCells.has(key)) {
        return;
      }

      rowMeta.current.measuredCells.set(key, [text, rowIdx, colIdx, isNumeric]);
      const height = getCellSize(text, colIdx, isNumeric);

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

      if (!batchStateUpdate && !isSnapshot) {
        setEstimatedRowHeight(rowMeta.current.totalHeight / rowMeta.current.count);
      }
    },
    [getCellSize, isSnapshot]
  );

  const getRowHeight = useCallback(
    (rowIdx: number) => rowMeta.current.heights[rowIdx] ?? estimatedRowHeight,
    [rowMeta, estimatedRowHeight]
  );

  const resetRowMeta = useCallback(() => {
    rowMeta.current.lastScrollToRatio = 0;
    rowMeta.current.resetAfterRowIndex = 0;
    rowMeta.current.heights = [];
    rowMeta.current.totalHeight = 0;
    rowMeta.current.count = 0;
    rowMeta.current.measuredCells.clear();
  }, [rowMeta]);

  // Use "mutableSetCellSize" so that "resizeAllCells" is not recreated every time
  // "columnWidths" changes will the user is actively re-sizing a column.
  const mutableSetCellSize = useMutableProp(setCellSize);

  // Allows cell sizes to be recalculated while a user is actively re-sizing a column
  const resizeAllCells = useCallback(() => {
    const copyOfMeasuredCells = new Map(rowMeta.current.measuredCells);
    resetRowMeta();

    copyOfMeasuredCells.forEach(([text, rowIdx, colIdx, isNumeric]) => {
      mutableSetCellSize.current(text, rowIdx, colIdx, isNumeric, true);
    });

    if (!isSnapshot) {
      setEstimatedRowHeight(rowMeta.current.totalHeight / rowMeta.current.count);
    }
  }, [resetRowMeta, isSnapshot, mutableSetCellSize]);

  /**
   * Some user actions and events can trigger row heights to be invalidated
   * - A column is re-sized
   * - New layout (ex. due to property changes or outside selections)
   * - Change of page (which would load new data)
   * - Theme change (ex. fonts)
   * - Container element is re-sized (object re-sized in Qlik Sense or browser window re-sized)
   */
  useOnPropsChange(() => {
    resetRowMeta();
  }, [layout, pageInfo]);

  /**
   * When theme or container element changes. The data remains valid, in such case
   * reset row meta and recompute row heights again.
   *
   * "measureText" is used as a way to detect changes in the theme.
   */
  useOnPropsChange(() => {
    resizeAllCells();
  }, [measureText, rect.width]);

  // Allows cell sizes to be recalculated while a user is actively re-sizing a column
  const resizeVisibleCells = (rows: Row[]) => {
    if (!gridState) return;

    resetRowMeta();

    const { overscanRowStartIndex: rowStart, overscanRowStopIndex } = gridState.current;
    const rowStop = Math.min(overscanRowStopIndex, layout.qHyperCube.qSize.qcy - 1);

    for (let rowIdx = rowStart; rowIdx <= rowStop; rowIdx++) {
      const row = rows[rowIdx] ?? {};
      Object.values(row).forEach((cell) => {
        if (typeof cell === 'object') {
          setCellSize(cell.qText ?? '', rowIdx, cell.pageColIdx, cell.isNumeric);
        }
      });
    }
  };

  // Reset the internal cache of react-window, otherwise the size of empty cells
  // would be cached and used on each render
  if (gridRef?.current) {
    gridRef.current.resetAfterRowIndex(rowMeta.current.resetAfterRowIndex, false);
  } else if (lineRef?.current) {
    lineRef.current.resetAfterIndex(rowMeta.current.resetAfterRowIndex, false);
  }

  viewService.estimatedRowHeight = estimatedRowHeight;

  return {
    setCellSize,
    getRowHeight,
    rowMeta,
    estimatedRowHeight,
    maxLineCount,
    resizeVisibleCells,
    resizeAllCells,
    resetRowMeta,
  };
};

export default useDynamicRowHeight;
