export function getColumnOrder(layout) {
  const { qColumnOrder, qDimensionInfo, qMeasureInfo } = layout.qHyperCube;
  if (qColumnOrder?.length === qDimensionInfo.length + qMeasureInfo.length) {
    return qColumnOrder;
  }
  return [...Array(qDimensionInfo.length + qMeasureInfo.length).keys()];
}

export function getColumnInfo(layout, colIndex) {
  const { qDimensionInfo, qMeasureInfo } = layout.qHyperCube;
  const numDims = qDimensionInfo.length;
  const isDim = colIndex < numDims;
  const info = isDim ? qDimensionInfo[colIndex] : qMeasureInfo[colIndex - numDims];
  return {
    isDim,
    width: 200,
    label: info.qFallbackTitle,
    dataKey: info.cId,
    id: info.cId,
    align: isDim ? 'left' : 'right',
  };
}

export default async function manageData(model, layout, pageInfo) {
  const columnorder = getColumnOrder(layout);
  const dataPages = await model.getHyperCubeData('/qHyperCubeDef', [
    { qTop: pageInfo.top, qLeft: 0, qHeight: pageInfo.height, qWidth: columnorder.length },
  ]);
  const matrix = dataPages[0].qMatrix;

  const columns = columnorder.map((c) => getColumnInfo(layout, c));
  const rows = matrix.map((r, rowIdx) => {
    const row = {};
    columns.forEach((c, colIdx) => {
      row[c.id] = { ...r[colIdx], rowIdx: rowIdx + pageInfo.top, colIdx, isDim: c.isDim };
    });
    return row;
  });

  return { size: layout.qHyperCube.qSize, rows, columns };
}
