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

export function getColumnOrder({ qColumnOrder, qDimensionInfo, qMeasureInfo }: HyperCube): number[] {
  const columnsLength = qDimensionInfo.length + qMeasureInfo.length;
  return qColumnOrder?.length === columnsLength ? qColumnOrder : Array.from(Array(columnsLength).keys());
}

// Get total cell info
export function getTotalInfo(
  isDim: boolean,
  layout: TableLayout,
  colIndex: number,
  numDims: number,
  columnOrder: number[]
) {
  if (!isDim) return layout.qHyperCube.qGrandTotalRow[colIndex - numDims]?.qText;
  if (colIndex === 0 && columnOrder[0] === 0) return layout.totals.label;
  return '';
}

export function getColumnInfo(layout: TableLayout, colIndex: number, columnOrder: number[]): false | Column {
  const { qDimensionInfo, qMeasureInfo } = layout.qHyperCube;
  const numDims = qDimensionInfo.length;
  const isDim = colIndex < numDims;
  const info = (isDim ? qDimensionInfo[colIndex] : qMeasureInfo[colIndex - numDims]) as
    | ExtendedNxMeasureInfo
    | ExtendedNxDimensionInfo;
  const isHidden = info.qError?.qErrorCode === 7005;
  const isLocked = isDim && (info as ExtendedNxDimensionInfo).qLocked;
  const autoAlign = isDim ? 'left' : 'right';

  return (
    !isHidden && {
      isDim,
      isLocked,
      width: 200,
      label: info.qFallbackTitle,
      id: `col-${colIndex}`,
      align: !info.textAlign || info.textAlign.auto ? autoAlign : info.textAlign.align,
      stylingIDs: info.qAttrExprInfo.map((expr) => expr.id),
      sortDirection: info.qSortIndicator ? DirectionMap[info.qSortIndicator] : DirectionMap.A,
      dataColIdx: colIndex,
      totalInfo: getTotalInfo(isDim, layout, colIndex, numDims, columnOrder),
    }
  );
}

// Get the position of the totals
export function getTotalPosition(layout: TableLayout) {
  const [hasOnlyMeasure, hasDimension, hasGrandTotal, hasMeasure, isTotalModeAuto] = [
    layout.qHyperCube.qDimensionInfo.length === 0,
    layout.qHyperCube.qDimensionInfo.length > 0,
    layout.qHyperCube.qGrandTotalRow.length > 0,
    layout.qHyperCube.qMeasureInfo.length > 0,
    layout.totals?.show,
  ];

  if (hasGrandTotal && ((hasDimension && hasMeasure) || (!isTotalModeAuto && hasOnlyMeasure))) {
    if (isTotalModeAuto || (!isTotalModeAuto && layout.totals.position === 'top')) return 'top';
    if (!isTotalModeAuto && layout.totals.position === 'bottom') return 'bottom';
  }
  return 'noTotals';
}

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
  // you can end up still being on a page that doesn't exist anymore, then go back to the first page and return null
  if (page > 0 && top >= totalRowCount && pageInfo) {
    setPageInfo({ ...pageInfo, page: 0 });
    return null;
  }
  // If the number of cells exceeds 10k then we need to lower the rows per page to the maximum possible value
  if (height * totalColumnCount > MAX_CELLS && pageInfo) {
    setPageInfo({ ...pageInfo, rowsPerPage: getHighestPossibleRpp(totalColumnCount, rowsPerPageOptions), page: 0 });
    return null;
  }

  const columnOrder = getColumnOrder(qHyperCube);
  // using filter to remove hidden columns (represented with false)
  const columns = columnOrder
    .map((colIndex) => getColumnInfo(layout, colIndex, columnOrder))
    .filter(Boolean) as Column[];
  const dataPages = await model.getHyperCubeData('/qHyperCubeDef', [
    { qTop: top, qLeft: 0, qHeight: height, qWidth: totalColumnCount },
  ]);

  const rows = dataPages[0].qMatrix.map((r, rowIdx) => {
    const row: Row = { key: `row-${rowIdx}` };
    columns.forEach((c, colIdx) => {
      row[c.id] = {
        ...r[colIdx],
        rowIdx: rowIdx + top,
        colIdx: columnOrder[colIdx],
        isSelectable: c.isDim && !c.isLocked,
        rawRowIdx: rowIdx,
        rawColIdx: colIdx,
        isLastRow: rowIdx === height - 1,
      };
    });
    return row;
  });
  const totalsPosition = getTotalPosition(layout);
  return { totalColumnCount, totalRowCount, totalPages, paginationNeeded, rows, columns, totalsPosition };
}
