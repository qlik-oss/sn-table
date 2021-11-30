export function generateDataPages(height, width) {
  const qMatrix = [];

  for (let row = 0; row < height; row++) {
    qMatrix.push([]);

    for (let col = 0; col < width; col++) {
      qMatrix[row].push({
        qText: (row * width + col).toString(),
      });
    }
  }

  return [{ qMatrix }];
}

export function generateLayout(nDims, nMeas, nRows, qColumnOrder = []) {
  const createField = (idx) => ({
    qFallbackTitle: `title-${idx}`,
    qAttrExprInfo: [],
    qSortIndicator: 'A',
    qReverseSort: false,
  });
  const qDimensionInfo = [];
  const qMeasureInfo = [];

  for (let dim = 0; dim < nDims; dim++) {
    qDimensionInfo.push(createField(dim));
  }
  for (let mea = 0; mea < nMeas; mea++) {
    qMeasureInfo.push(createField(nDims + mea));
  }

  return {
    qHyperCube: {
      qDimensionInfo,
      qMeasureInfo,
      qColumnOrder,
      qEffectiveInterColumnSortOrder: qColumnOrder, // little hack, assuming the column order is the same as the sort order
      qSize: { qcx: nDims + nMeas, qcy: nRows },
    },
  };
}
