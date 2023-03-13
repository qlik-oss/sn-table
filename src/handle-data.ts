import { autoAlign } from './table/utils/styling-utils';
import {
  TableLayout,
  PageInfo,
  SetPageInfo,
  Row,
  ExtendedNxMeasureInfo,
  ExtendedNxDimensionInfo,
  Column,
  TableData,
} from './types';

const MAX_CELLS = 10000;

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
export function getTotalPosition(layout: TableLayout, areBasicFeaturesEnabled = true) {
  const [hasDimension, hasMeasure, hasGrandTotal, isTotalModeAuto, position] = [
    layout.qHyperCube.qDimensionInfo.length > 0,
    layout.qHyperCube.qMeasureInfo.length > 0,
    layout.qHyperCube.qGrandTotalRow.length > 0,
    layout.totals?.show,
    layout.totals.position,
  ];

  if (
    areBasicFeaturesEnabled &&
    hasGrandTotal &&
    ((hasDimension && hasMeasure) || (!isTotalModeAuto && !hasDimension))
  ) {
    if (isTotalModeAuto || position === 'top') {
      return { atTop: true, atBottom: false };
    }
    if (!isTotalModeAuto && position === 'bottom') {
      return { atTop: false, atBottom: true };
    }
  }

  return { atTop: false, atBottom: false };
}

/**
 * Gets the totals label in the first column
 * Gets the qText for each of the rest of columns
 */
export function getTotalInfo(layout: TableLayout, colIdx: number, pageColIdx: number, numDims: number) {
  if (colIdx >= numDims) return layout.qHyperCube.qGrandTotalRow[colIdx - numDims]?.qText ?? '';
  if (pageColIdx === 0) return layout.totals.label;
  return '';
}

/**
 * Gets all column info, returns false if hidden
 */
export function getColumnInfo(layout: TableLayout, colIdx: number, pageColIdx: number): false | Column {
  const { qDimensionInfo, qMeasureInfo } = layout.qHyperCube;
  const numDims = qDimensionInfo.length;
  const isDim = colIdx < numDims;
  const info = (isDim ? qDimensionInfo[colIdx] : qMeasureInfo[colIdx - numDims]) as
    | ExtendedNxMeasureInfo
    | ExtendedNxDimensionInfo;
  const {
    qError,
    qFallbackTitle,
    textAlign,
    qAttrExprInfo,
    qSortIndicator,
    qReverseSort,
    qApprMaxGlyphCount,
    columnWidth,
    qLibraryId,
  } = info;
  const isHidden = qError?.qErrorCode === 7005;
  const isLocked = isDim && (info as ExtendedNxDimensionInfo).qLocked;
  const { qDimensionType } = info as ExtendedNxDimensionInfo;
  const autoHeadCellTextAlign = qDimensionType === 'N' || qDimensionType === undefined ? 'right' : 'left';
  const headCellTextAlign = !textAlign || textAlign.auto ? autoHeadCellTextAlign : textAlign.align;
  const autoTotalsCellTextAlign = isDim ? 'left' : 'right';
  const totalsCellTextAlign = !textAlign || textAlign.auto ? autoTotalsCellTextAlign : textAlign.align;

  let fieldIndex = 0;
  let fieldId = '';
  if (isDim) {
    fieldIndex = (info as ExtendedNxDimensionInfo).qGroupPos;
    fieldId = (info as ExtendedNxDimensionInfo).qGroupFieldDefs[fieldIndex];
  }

  return (
    !isHidden && {
      isDim,
      isLocked,
      fieldId,
      colIdx,
      qLibraryId,
      pageColIdx,
      qApprMaxGlyphCount,
      qReverseSort,
      columnWidth,
      id: `col-${pageColIdx}`,
      label: qFallbackTitle,
      headCellTextAlign,
      totalsCellTextAlign,
      textAlign: !textAlign || textAlign.auto ? 'auto' : textAlign.align,
      stylingIDs: qAttrExprInfo.map((expr) => expr.id),
      // making sure that qSortIndicator is either A or D
      sortDirection: qSortIndicator && qSortIndicator !== 'N' ? qSortIndicator : 'A',
      totalInfo: getTotalInfo(layout, colIdx, pageColIdx, numDims),
    }
  );
}

/**
 * Gets the column order and generates the column info.
 * Hidden columns are filtered out.
 */
export const getColumns = (layout: TableLayout) => {
  const {
    qHyperCube: { qColumnOrder, qDimensionInfo, qMeasureInfo },
  } = layout;
  const columnsLength = qDimensionInfo.length + qMeasureInfo.length;
  const columnOrder = qColumnOrder?.length === columnsLength ? qColumnOrder : Array.from(Array(columnsLength).keys());

  return columnOrder.map((colIdx, pageColIdx) => getColumnInfo(layout, colIdx, pageColIdx)).filter(Boolean) as Column[];
};

/**
 * Fetches the data for the given pageInfo. Returns rows and columns, sorted in the order they will be displayed,
 * and meta data for size etc. The column/row indexes used in engine are stored as col/rowIdx, while the index within
 * the displayed page is stored as pageRow/ColIdx
 */
export default async function manageData(
  model: EngineAPI.IGenericObject,
  layout: TableLayout,
  pageInfo: PageInfo,
  setPageInfo: SetPageInfo,
  areBasicFeaturesEnabled: boolean
): Promise<TableData | null> {
  const { page, rowsPerPage, rowsPerPageOptions } = pageInfo;
  const totalColumnCount = layout.qHyperCube.qSize.qcx;
  const totalRowCount = layout.qHyperCube.qSize.qcy;
  const totalPages = Math.ceil(totalRowCount / rowsPerPage);

  const top = page * rowsPerPage;
  const height = Math.min(rowsPerPage, totalRowCount - top);
  // When the number of rows is reduced (e.g. confirming selections),
  // you can end up still being on a page that doesn't exist anymore, then go back to the first page and rerender
  if (page > 0 && top >= totalRowCount && pageInfo) {
    setPageInfo({ ...pageInfo, page: 0 });
    return null;
  }
  // If the number of cells exceeds 10k then we need to lower the rows per page to the maximum possible value and rerender
  if (height * totalColumnCount > MAX_CELLS && pageInfo) {
    setPageInfo({ ...pageInfo, rowsPerPage: getHighestPossibleRpp(totalColumnCount, rowsPerPageOptions), page: 0 });
    return null;
  }

  const paginationNeeded = totalRowCount > 10; // TODO: This might not be true if you have > 1000 columns
  const totalsPosition = getTotalPosition(layout, areBasicFeaturesEnabled);
  const columns = getColumns(layout);

  const dataPages = await model.getHyperCubeData('/qHyperCubeDef', [
    { qTop: top, qLeft: 0, qHeight: height, qWidth: totalColumnCount },
  ]);

  const getBodyCellAlign = (c: Column, r: EngineAPI.INxCellRows, pageColIdx: number) =>
    c.textAlign === 'auto' ? autoAlign(r[pageColIdx]) : c.textAlign;

  const rows = dataPages[0].qMatrix.map((r, pageRowIdx) => {
    const row: Row = { id: `row-${pageRowIdx}` };
    columns.forEach((c, pageColIdx) => {
      row[c.id] = {
        ...r[pageColIdx],
        align: getBodyCellAlign(c, r, pageColIdx),
        rowIdx: pageRowIdx + top,
        colIdx: c.colIdx,
        pageRowIdx,
        pageColIdx,
        isSelectable: c.isDim && !c.isLocked,
        isLastRow: pageRowIdx === height - 1,
      };
    });
    return row;
  });

  return { totalColumnCount, totalRowCount, totalPages, paginationNeeded, totalsPosition, columns, rows };
}
