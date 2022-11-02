import {
  TableLayout,
  PageInfo,
  SetPageInfo,
  HyperCube,
  Row,
  ExtendedNxMeasureInfo,
  ExtendedNxDimensionInfo,
  Column,
  TableData,
} from './types';

enum DirectionMap {
  A = 'asc',
  D = 'desc',
  N = 'asc',
}

const MAX_CELLS = 10000;

export function getHighestPossibleRpp(width: number, rowsPerPageOptions: number[]) {
  const highestPossibleOption = [...rowsPerPageOptions].reverse().find((opt) => opt * width <= MAX_CELLS);
  return highestPossibleOption || Math.floor(MAX_CELLS / width); // covering corner case of lowest option being too high
}

/**
 * Gets columns order, if it does not exist, create a new default one, [1, 2, ... nCols]
 */
export function getColumnOrder({ qColumnOrder, qDimensionInfo, qMeasureInfo }: HyperCube): number[] {
  const columnsLength = qDimensionInfo.length + qMeasureInfo.length;
  return qColumnOrder?.length === columnsLength ? qColumnOrder : Array.from(Array(columnsLength).keys());
}

/**
 * Gets the totals text for a column
 */
export function getTotalInfo(layout: TableLayout, colIdx: number, pageColIdx: number, numDims: number) {
  if (colIdx >= numDims) return layout.qHyperCube.qGrandTotalRow[colIdx - numDims]?.qText;
  if (colIdx === 0 && pageColIdx === 0) return layout.totals.label;
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
  const isHidden = info.qError?.qErrorCode === 7005;
  const isLocked = isDim && (info as ExtendedNxDimensionInfo).qLocked;
  const autoAlign = isDim ? 'left' : 'right';

  return (
    !isHidden && {
      isDim,
      isLocked,
      colIdx,
      pageColIdx,
      id: `col-${pageColIdx}`,
      label: info.qFallbackTitle,
      align: !info.textAlign || info.textAlign.auto ? autoAlign : info.textAlign.align,
      stylingIDs: info.qAttrExprInfo.map((expr) => expr.id),
      sortDirection: info.qSortIndicator ? DirectionMap[info.qSortIndicator] : DirectionMap.A,
      totalInfo: getTotalInfo(layout, colIdx, pageColIdx, numDims),
    }
  );
}
/**
 * Get the position of the totals
 */
export function getTotalPosition(layout: TableLayout) {
  const [hasDimension, hasMeasure, hasGrandTotal, isTotalModeAuto, position] = [
    layout.qHyperCube.qDimensionInfo.length > 0,
    layout.qHyperCube.qMeasureInfo.length > 0,
    layout.qHyperCube.qGrandTotalRow.length > 0,
    layout.totals?.show,
    layout.totals.position,
  ];

  if (hasGrandTotal && ((hasDimension && hasMeasure) || (!isTotalModeAuto && !hasDimension))) {
    if (isTotalModeAuto || position === 'top') return 'top';
    if (!isTotalModeAuto && position === 'bottom') return 'bottom';
  }
  return 'noTotals';
}

/**
 * Fetches the data for the given pageInfo. Returns rows and columns, sorted in the order they will be displayed,
 * and meta data for size etc. The column/row indexes used in engine are stored as col/rowIdx, while the index within
 * the displayed page is stored as pageRow/ColIdx
 */
export default async function manageData(
  model: EngineAPI.IGenericObject,
  layout: TableLayout,
  pageInfo: PageInfo,
  setPageInfo: SetPageInfo
): Promise<TableData | null> {
  const { page, rowsPerPage, rowsPerPageOptions } = pageInfo;
  const { qHyperCube } = layout;
  const totalColumnCount = qHyperCube.qSize.qcx;
  const totalRowCount = qHyperCube.qSize.qcy;
  const totalPages = Math.ceil(totalRowCount / rowsPerPage);

  const paginationNeeded = totalRowCount > 10; // TODO: This might not be true if you have > 1000 columns
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

  const columnOrder = getColumnOrder(qHyperCube);
  // using filter to remove hidden columns (represented with false)
  const columns = columnOrder
    .map((colIdx, pageColIdx) => getColumnInfo(layout, colIdx, pageColIdx))
    .filter(Boolean) as Column[];
  const dataPages = await model.getHyperCubeData('/qHyperCubeDef', [
    { qTop: top, qLeft: 0, qHeight: height, qWidth: totalColumnCount },
  ]);

  const rows = dataPages[0].qMatrix.map((r, pageRowIdx) => {
    const row: Row = { id: `row-${pageRowIdx}` };
    columns.forEach((c, pageColIdx) => {
      row[c.id] = {
        ...r[pageColIdx],
        rowIdx: pageRowIdx + top,
        colIdx: columnOrder[pageColIdx],
        pageRowIdx,
        pageColIdx,
        isSelectable: c.isDim && !c.isLocked,
        isLastRow: pageRowIdx === height - 1,
      };
    });
    return row;
  });

  const totalsPosition = getTotalPosition(layout);

  return { totalColumnCount, totalRowCount, totalPages, paginationNeeded, rows, columns, totalsPosition };
}
