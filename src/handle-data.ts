import { isNumericCell } from "./table/utils/is-numeric";
import {
  Align,
  Column,
  ExtendedNxDimensionInfo,
  ExtendedNxMeasureInfo,
  PageInfo,
  Row,
  SetPageInfo,
  TableData,
  TableLayout,
  TextAlign,
  ViewService,
} from "./types";

const MAX_CELLS = 10000;
const HIDDEN_ERROR_CODE = 7005;

/**
 * Calculates the highest amount of rows that can be shown given the amount of columns
 */
export function getHighestPossibleRpp(width: number, rowsPerPageOptions: number[]) {
  const highestPossibleOption = [...rowsPerPageOptions].reverse().find((opt) => opt * width <= MAX_CELLS);
  return highestPossibleOption || Math.floor(MAX_CELLS / width); // covering corner case of lowest option being too high
}

/**
 * Get the position of the totals
 */
export function getTotalPosition(layout: TableLayout, viewService: ViewService) {
  // For multi-page pdf the totals row may not be needed from the second pdf page
  if (viewService.viewState?.skipTotals) return { atTop: false, atBottom: false };
  const [hasDimension, hasMeasure, hasGrandTotal, isTotalModeAuto, position] = [
    layout.qHyperCube.qDimensionInfo.length > 0,
    layout.qHyperCube.qMeasureInfo.length > 0,
    layout.qHyperCube.qGrandTotalRow.length > 0,
    layout.totals?.show,
    layout.totals.position,
  ];

  if (hasGrandTotal && ((hasDimension && hasMeasure) || (!isTotalModeAuto && !hasDimension))) {
    if (isTotalModeAuto || position === "top") {
      return { atTop: true, atBottom: false };
    }
    if (!isTotalModeAuto && position === "bottom") {
      return { atTop: false, atBottom: true };
    }
  }

  return { atTop: false, atBottom: false };
}

/**
 * Gets the totals label for the first column, empty string for other dimensions and the totals value for measures
 */
export function getTotalInfo(layout: TableLayout, isDim: boolean, pageColIdx: number, visibleColIdx: number) {
  if (!isDim) return layout.qHyperCube.qGrandTotalRow[visibleColIdx]?.qText ?? "";
  if (pageColIdx === 0) return layout.totals.label ?? "";
  return "";
}

/**
 * Gets the totals alignment for head, totals and body
 * bodyTextAlign is later used to determine independent alignment for each body cell
 */
export function getAlignInfo(
  textAlign: TextAlign,
  qDimensionType: EngineAPI.DimensionType | undefined,
  isDim: boolean
): { headTextAlign: Align; totalsTextAlign: Align; bodyTextAlign: Align | "auto" } {
  if (textAlign && !textAlign.auto) {
    return { headTextAlign: textAlign.align, totalsTextAlign: textAlign.align, bodyTextAlign: textAlign.align };
  }

  return {
    headTextAlign: qDimensionType === "N" || qDimensionType === undefined ? "right" : "left",
    totalsTextAlign: isDim ? "left" : "right",
    bodyTextAlign: "auto",
  };
}

/**
 * Gets the correct text alignment for body cells, based on the text alignment info from the column and cell content
 */
export const getBodyCellAlign = (cell: EngineAPI.INxCell, textAlign: Align | "auto") => {
  if (textAlign !== "auto") {
    return textAlign;
  }

  return isNumericCell(cell) ? "right" : "left";
};

/**
 * Gets all column info.
 */
export function getColumnInfo(layout: TableLayout, colIdx: number, pageColIdx: number, visibleColIdx: number): Column {
  const { qDimensionInfo, qMeasureInfo, qEffectiveInterColumnSortOrder } = layout.qHyperCube;
  const numDims = qDimensionInfo.length;
  const isDim = colIdx < numDims;
  const info = isDim ? qDimensionInfo[colIdx] : qMeasureInfo[colIdx - numDims];

  // using model.getInterColumnSortOrder causes issues in rendering tests
  // model does not contains `getInterColumnSortOrder()` method in rendering test
  // that is the reason why using `qEffectiveInterColumnSortOrder` from layout instead
  const isActivelySorted = colIdx === qEffectiveInterColumnSortOrder[0];

  let fieldIndex = 0;
  let fieldId = "";
  let isLocked = false;
  let selectionColIdx = -1;
  let qDimensionType;
  if (isDim) {
    const dimInfo = info as ExtendedNxDimensionInfo;
    fieldIndex = dimInfo.qGroupPos;
    fieldId = dimInfo.qGroupFieldDefs[fieldIndex];
    isLocked = dimInfo.qLocked;
    selectionColIdx = visibleColIdx;
    ({ qDimensionType } = dimInfo);
  }

  const {
    qFallbackTitle,
    textAlign,
    qAttrExprInfo,
    qSortIndicator,
    qReverseSort,
    qApprMaxGlyphCount,
    columnWidth,
    qLibraryId,
  } = info;

  return {
    isDim,
    isLocked,
    fieldId,
    colIdx,
    qLibraryId,
    pageColIdx,
    qApprMaxGlyphCount,
    qReverseSort,
    columnWidth,
    selectionColIdx,
    isActivelySorted,
    id: `col-${pageColIdx}`,
    label: qFallbackTitle,
    stylingIDs: qAttrExprInfo.map((expr) => expr.id),
    // making sure that qSortIndicator is either A or D
    sortDirection: qSortIndicator && qSortIndicator !== "N" ? qSortIndicator : "A",
    totalInfo: getTotalInfo(layout, isDim, pageColIdx, visibleColIdx),
    ...getAlignInfo(textAlign, qDimensionType, isDim),
  };
}
/**
 * Returns the column order for visible columns only.
 * Also returns an array of visible column indexes. where the measures have an independent column count,
 * so both first measure and dimension has index 0.
 * THis is used for selections for dimensions and total values for measures
 */
const getVisibleColumnOrder = (
  columnOrder: number[],
  qDimensionInfo: ExtendedNxDimensionInfo[],
  qMeasureInfo: ExtendedNxMeasureInfo[]
) => {
  const numDims = qDimensionInfo.length;
  const visibleColumnIndexes: number[] = [];
  let hiddenDimCounter = 0;
  let hiddenMsrCounter = 0;

  const visibleColumnsOrder = columnOrder.filter((colIdx) => {
    const isDim = colIdx < numDims;
    const { qError } = isDim ? qDimensionInfo[colIdx] : qMeasureInfo[colIdx - numDims];
    const isHidden = qError?.qErrorCode === HIDDEN_ERROR_CODE;

    if (isHidden) {
      isDim ? hiddenDimCounter++ : hiddenMsrCounter++;
    } else {
      visibleColumnIndexes[colIdx] = isDim ? colIdx - hiddenDimCounter : colIdx - numDims - hiddenMsrCounter;
    }

    return !isHidden;
  });

  return { visibleColumnsOrder, visibleColumnIndexes };
};

/**
 * Gets the column order and generates the column info for visible columns.
 */
export const getColumns = (layout: TableLayout) => {
  const {
    qHyperCube: { qColumnOrder, qDimensionInfo, qMeasureInfo },
  } = layout;
  const columnsLength = qDimensionInfo.length + qMeasureInfo.length;
  const columnOrder = qColumnOrder?.length === columnsLength ? qColumnOrder : Array.from(Array(columnsLength).keys());

  const { visibleColumnsOrder, visibleColumnIndexes } = getVisibleColumnOrder(
    columnOrder,
    qDimensionInfo,
    qMeasureInfo
  );

  return visibleColumnsOrder.map((colIdx, pageColIdx) =>
    getColumnInfo(layout, colIdx, pageColIdx, visibleColumnIndexes[colIdx])
  );
};
/**
 * Fetches the data for the given pageInfo. Returns rows and columns, sorted in the order they will be displayed,
 * and meta data for size etc. The column/row indexes used in engine are stored as col/rowIdx, while the index within
 * the displayed page is stored as pageRow/ColIdx.
 * For dimension cells, there is a selectionColIdx used for calling the selection API
 */
export default async function manageData(
  model: EngineAPI.IGenericObject,
  layout: TableLayout,
  pageInfo: PageInfo,
  setPageInfo: SetPageInfo,
  viewService: ViewService
): Promise<TableData | null> {
  const { page, rowsPerPage, rowsPerPageOptions } = pageInfo;
  const totalColumnCount = layout.qHyperCube.qSize.qcx;
  const totalRowCount = layout.qHyperCube.qSize.qcy;
  const totalPages = Math.ceil(totalRowCount / rowsPerPage);

  const top = viewService.visibleTop ?? page * rowsPerPage;
  const height = viewService.visibleHeight ?? Math.min(rowsPerPage, totalRowCount - top);
  // When the number of rows is reduced (e.g. confirming selections),
  // you can end up still being on a page that doesn't exist anymore, then go back to the first page and rerender
  if (page > 0 && top >= totalRowCount) {
    setPageInfo({ ...pageInfo, page: 0 });
    return null;
  }
  // If the number of cells exceeds 10k then we need to lower the rows per page to the maximum possible value and rerender
  if (height * totalColumnCount > MAX_CELLS) {
    setPageInfo({ ...pageInfo, rowsPerPage: getHighestPossibleRpp(totalColumnCount, rowsPerPageOptions), page: 0 });
    return null;
  }

  const paginationNeeded = totalRowCount > 10; // TODO: This might not be true if you have > 1000 columns
  const totalsPosition = getTotalPosition(layout, viewService);
  const columns = getColumns(layout);

  const isSnapshot = !!layout.snapshotData;
  const dataPages = isSnapshot
    ? layout.qHyperCube.qDataPages
    : await model.getHyperCubeData("/qHyperCubeDef", [
        { qTop: top, qLeft: 0, qHeight: height, qWidth: totalColumnCount },
      ]);
  if (viewService && !isSnapshot) {
    viewService.qTop = top;
    viewService.qHeight = height;
    viewService.rowsPerPage = pageInfo.rowsPerPage;
    viewService.page = pageInfo.page;
  }

  const rows =
    dataPages?.[0].qMatrix.map((r, pageRowIdx) => {
      const row: Row = { id: `row-${pageRowIdx}` };
      columns.forEach((c, pageColIdx) => {
        row[c.id] = {
          ...r[pageColIdx],
          align: getBodyCellAlign(r[pageColIdx], c.bodyTextAlign),
          rowIdx: pageRowIdx + top,
          colIdx: c.colIdx,
          pageRowIdx,
          pageColIdx,
          selectionColIdx: c.selectionColIdx,
          isSelectable: c.isDim && !c.isLocked,
          isLastRow: pageRowIdx === height - 1,
        };
      });
      return row;
    }) || [];

  return { totalColumnCount, totalRowCount, totalPages, paginationNeeded, totalsPosition, columns, rows };
}
