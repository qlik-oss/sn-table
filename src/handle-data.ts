import { stardust } from '@nebula.js/stardust';

import { TableLayout, HyperCube, ExtendedNxDimensionInfo, ExtendedNxMeasureInfo, Column } from './types';

const directionMap = {
  A: 'asc',
  D: 'desc',
  N: 'asc',
};

const MAX_CELLS = 10000;

export function getHighestPossibleRpp(width: number, rowsPerPageOptions: number[]) {
  const highestPossibleOption = [...rowsPerPageOptions].reverse().find((opt) => opt * width <= MAX_CELLS);
  return highestPossibleOption || Math.floor(MAX_CELLS / width); // covering corner case of lowest option being too high
}

export function getColumnOrder({ qColumnOrder, qDimensionInfo, qMeasureInfo }: HyperCube) {
  const columnsLength = qDimensionInfo.length + qMeasureInfo.length;
  return qColumnOrder?.length === columnsLength ? qColumnOrder : [...Array(columnsLength).keys()];
}

export function getColumnInfo(qHyperCube: HyperCube, colIndex: number) {
  const { qDimensionInfo, qMeasureInfo } = qHyperCube;
  const numDims = qDimensionInfo.length;
  const isDim = colIndex < numDims;
  const info = (isDim ? qDimensionInfo[colIndex] : qMeasureInfo[colIndex - numDims]) as
    | ExtendedNxMeasureInfo
    | ExtendedNxDimensionInfo;
  const isHidden = info.qError?.qErrorCode === 7005;
  const isLocked = isDim && qDimensionInfo[colIndex].qLocked;
  const align = () => (isDim ? 'left' : 'right');

  return (
    !isHidden && {
      isDim,
      isLocked,
      width: 200,
      label: info.qFallbackTitle,
      id: `col-${colIndex}`,
      align: !info.textAlign || info.textAlign.auto ? align() : info.textAlign.align,
      stylingInfo: info.qAttrExprInfo.map((expr) => expr.id),
      sortDirection: info.qSortIndicator ? directionMap[info.qSortIndicator] : directionMap.A,
      dataColIdx: colIndex,
    }
  );
}

interface ManageData {
  model: EngineAPI.IGenericObject;
  layout: TableLayout;
  pageInfo: {
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
  };
  setPageInfo: stardust.SetStateFn<{
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
  }>;
}

export default async function manageData({ model, layout, pageInfo, setPageInfo }: ManageData) {
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
    .map((colIndex: number) => getColumnInfo(qHyperCube, colIndex))
    .filter(Boolean) as Column[];
  const dataPages = await model.getHyperCubeData('/qHyperCubeDef', [
    { qTop: top, qLeft: 0, qHeight: height, qWidth: totalColumnCount },
  ]);

  const rows = dataPages[0].qMatrix.map((r, rowIdx) => {
    const row = { key: `row-${rowIdx}` };
    columns.forEach((c, colIdx) => {
      row[c.id] = {
        ...r[colIdx],
        rowIdx: rowIdx + top,
        colIdx: columnOrder[colIdx],
        isSelectable: c.isDim && !c.isLocked,
        rawRowIdx: rowIdx,
        rawColIdx: colIdx,
      };
    });
    return row;
  });

  return { totalColumnCount, totalRowCount, totalPages, paginationNeeded, rows, columns };
}
