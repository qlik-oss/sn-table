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
      id: info.cId,
      align: !info.textAlign || info.textAlign.auto ? (isDim ? 'left' : 'right') : info.textAlign.align,
      stylingInfo: info.qAttrExprInfo.map((expr) => expr.id),
      sortDirection: directionMap[info.qSortIndicator],
    }
  );
}

export default async function manageData(model, layout, pageInfo) {
  const columnOrder = getColumnOrder(layout);
  const dataPages = await model.getHyperCubeData('/qHyperCubeDef', [
    { qTop: pageInfo.top, qLeft: 0, qHeight: pageInfo.height, qWidth: columnOrder.length },
  ]);
  const matrix = dataPages[0].qMatrix;

  // using filter to remove hidden columns (represented with false)
  const columns = columnOrder.map((c) => getColumnInfo(layout, c)).filter(Boolean);
  const rows = matrix.map((r, rowIdx) => {
    const row = { key: rowIdx };
    columns.forEach((c, colIdx) => {
      row[c.id] = {
        ...r[colIdx],
        rowIdx: rowIdx + pageInfo.top,
        colIdx: columnOrder[colIdx],
        isDim: c.isDim,
        rawRowIdx: rowIdx,
        rawColIdx: colIdx,
      };
    });
    return row;
  });

  return { size: layout.qHyperCube.qSize, rows, columns, columnOrder };
}
