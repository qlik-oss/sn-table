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

export function generateLayout(nDims, nMeas, nRows, qColumnOrder = [], qGrandTotalRow = []) {
  const createField = (idx) => ({
    qFallbackTitle: `title-${idx}`,
    qAttrExprInfo: [],
    qSortIndicator: 'A',
    qReverseSort: false,
  });
  const qDimensionInfo = [];
  const qMeasureInfo = [];
  const totals = {
    show: false,
    position: 'noTotals',
    label: 'Totals',
  };

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
      qGrandTotalRow,
      qColumnOrder,
      qSize: { qcx: nDims + nMeas, qcy: nRows },
    },
    totals,
  };
}
