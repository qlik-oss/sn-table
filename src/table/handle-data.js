function getColumnOrder(layout) {
  const { qColumnOrder, qDimensionInfo, qMeasureInfo } = layout.qHyperCube;
  if (qColumnOrder && qColumnOrder.length === qDimensionInfo.length + qMeasureInfo.length) {
    return qColumnOrder;
  }
  return [...Array(qDimensionInfo.length + qMeasureInfo.length).keys()];
}

function getColumnInfo(layout, colIndex) {
  const { qDimensionInfo, qMeasureInfo } = layout.qHyperCube;
  const numDims = qDimensionInfo.length;
  if (colIndex >= numDims) {
    const m = qMeasureInfo[colIndex - numDims];
    return {
      isDim: false,
      width: 200,
      label: m.qFallbackTitle,
      dataKey: m.cId,
      id: m.cId,
      align: 'right',
    };
  }
  const d = qDimensionInfo[colIndex];
  return {
    isDim: true,
    width: 200,
    label: d.qFallbackTitle,
    dataKey: d.cId,
    id: d.cId,
    align: 'left',
  };
}

export default async function manageData(model, layout, pageInfo) {
  const columnorder = getColumnOrder(layout);

  const columns = columnorder.map((c) => {
    return getColumnInfo(layout, c);
  });
  const dataPages = await model.getHyperCubeData('/qHyperCubeDef', [
    { qTop: pageInfo.top, qLeft: 0, qHeight: pageInfo.height, qWidth: columnorder.length },
  ]);

  const matrix = dataPages[0].qMatrix;
  const rows = matrix.map((r) => {
    const row = {};
    columns.forEach((c, i) => {
      row[c.id] = r[i];
    });
    return row;
  });

  return { size: layout.qHyperCube.qSize, rows, columns };
}
