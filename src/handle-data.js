const directionMap = {
  A: 'asc',
  D: 'desc',
};

export function getColumnOrder(layout) {
  const { qColumnOrder, qDimensionInfo, qMeasureInfo } = layout.qHyperCube;
  if (qColumnOrder?.length === qDimensionInfo.length + qMeasureInfo.length) return qColumnOrder;
  return [...Array(qDimensionInfo.length + qMeasureInfo.length).keys()];
}

export function getColumnInfo(layout, colIndex) {
  const { qDimensionInfo, qMeasureInfo } = layout.qHyperCube;
  const numDims = qDimensionInfo.length;
  const isDim = colIndex < numDims;
  const info = isDim ? qDimensionInfo[colIndex] : qMeasureInfo[colIndex - numDims];
  const isHidden = info.qError?.qErrorCode === 7005;
  return (
    !isHidden && {
      isDim,
      width: 200,
      label: info.qFallbackTitle,
      id: `col-${colIndex}`,
      align: !info.textAlign || info.textAlign.auto ? (isDim ? 'left' : 'right') : info.textAlign.align,
      stylingInfo: info.qAttrExprInfo.map((expr) => expr.id),
      sortDirection: directionMap[info.qSortIndicator],
    }
  );
}

export default async function manageData(model, layout, pageInfo, setPageInfo) {
  const { page, rowsPerPage } = pageInfo;
  const top = page * rowsPerPage;
  const size = layout.qHyperCube.qSize;
  const allRowsLength = size.qcy;
  // When the number of rows is reduced (e.g. confirming selections),
  // you can end up still being on a page that doesn't exist anymore, then go back to the first page and return null
  if (page > 0 && top >= allRowsLength) {
    setPageInfo({ rowsPerPage, page: 0 });
    return null;
  }

  const columnOrder = getColumnOrder(layout);
  const dataPages = await model.getHyperCubeData('/qHyperCubeDef', [
    { qTop: top, qLeft: 0, qHeight: rowsPerPage, qWidth: columnOrder.length },
  ]);

  // using filter to remove hidden columns (represented with false)
  const columns = columnOrder.map((colIndex) => getColumnInfo(layout, colIndex)).filter(Boolean);
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

  return { size, rows, columns, columnOrder };
}
