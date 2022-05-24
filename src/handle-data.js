const directionMap = {
  A: 'asc',
  D: 'desc',
};

const MAX_CELLS = 10000;

export function getHighestPossibleRpp(width, rowsPerPageOptions) {
  const highestPossibleOption = [...rowsPerPageOptions].reverse().find((opt) => opt * width <= MAX_CELLS);
  return highestPossibleOption || Math.floor(MAX_CELLS / width); // covering corner case of lowest option being too high
}

export function getColumnOrder({ qColumnOrder, qDimensionInfo, qMeasureInfo }) {
  const columnsLength = qDimensionInfo.length + qMeasureInfo.length;
  return qColumnOrder?.length === columnsLength ? qColumnOrder : [...Array(columnsLength).keys()];
}

export function getColumnInfo(qHyperCube, colIndex, layout, translator) {
  const { qDimensionInfo, qMeasureInfo } = qHyperCube;
  const numDims = qDimensionInfo.length;
  const isDim = colIndex < numDims;
  const info = isDim ? qDimensionInfo[colIndex] : qMeasureInfo[colIndex - numDims];
  const isHidden = info.qError?.qErrorCode === 7005;
  const totalInfo = isDim
    ? colIndex === 0
      ? layout.totals.label !== undefined
        ? layout.totals.label
        : translator.get('Object.Table.Totals')
      : '\u00A0'
    : layout.qHyperCube.qGrandTotalRow[colIndex - numDims].qText;

  return (
    !isHidden && {
      isDim,
      width: 200,
      label: info.qFallbackTitle,
      id: `col-${colIndex}`,
      align: !info.textAlign || info.textAlign.auto ? (isDim ? 'left' : 'right') : info.textAlign.align,
      stylingInfo: info.qAttrExprInfo.map((expr) => expr.id),
      sortDirection: directionMap[info.qSortIndicator],
      dataColIdx: colIndex,
      totalInfo,
    }
  );
}

export function isTotalModeAuto(layout) {
  return layout.totals?.show === true;
}

export function getColTotalStatus(layout) {
  const hasOnlyMeasure = () => layout.qHyperCube.qDimensionInfo.length === 0;
  const hasOnlyDimension = () => layout.qHyperCube.qMeasureInfo.length === 0;
  const hasTotalsMeasures = () =>
    layout.qHyperCube.qMeasureInfo.length > 0 && layout.qHyperCube.qGrandTotalRow.length > 0;

  if (
    hasOnlyMeasure() ||
    hasOnlyDimension() ||
    !hasTotalsMeasures() ||
    (!isTotalModeAuto() && layout.totals.position === 'noTotals')
  )
    return 'none';
  if (isTotalModeAuto() || (!isTotalModeAuto() && layout.totals.position === 'top')) return 'top';
  if (!isTotalModeAuto() && layout.totals.position === 'bottom') return 'bottom';
  return 'none';
}

export default async function manageData(model, layout, pageInfo, setPageInfo, translator) {
  const { page, rowsPerPage, rowsPerPageOptions } = pageInfo;
  const { qHyperCube } = layout;
  const totalColumnCount = qHyperCube.qSize.qcx;
  const totalRowCount = qHyperCube.qSize.qcy;
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
    .map((colIndex) => getColumnInfo(qHyperCube, colIndex, layout, translator))
    .filter(Boolean);
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
        isDim: c.isDim,
        rawRowIdx: rowIdx,
        rawColIdx: colIdx,
      };
    });
    return row;
  });

  return { totalColumnCount, totalRowCount, paginationNeeded, rows, columns, translator };
}
