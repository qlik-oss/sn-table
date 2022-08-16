import { HyperCube, TableLayout, TotalsPosition } from '../types';

export function generateDataPages(height: number, width: number) {
  const qMatrix: Record<string, string>[][] = [];

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

export function generateLayout(
  nDims: number,
  nMeas: number,
  nRows: number,
  qColumnOrder = [] as number[],
  qGrandTotalRow = [] as Record<string, string>[]
): TableLayout {
  const createField = (idx: number) => ({
    qFallbackTitle: `title-${idx}`,
    qAttrExprInfo: [],
    qSortIndicator: 'A',
    qReverseSort: false,
  });
  const qDimensionInfo = [];
  const qMeasureInfo = [];
  const totals = {
    show: false,
    position: 'noTotals' as TotalsPosition,
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
      qDimensionInfo: qDimensionInfo as unknown as EngineAPI.INxDimensionInfo[],
      qMeasureInfo: qMeasureInfo as unknown as EngineAPI.INxMeasureInfo[],
      qGrandTotalRow,
      qColumnOrder,
      qSize: { qcx: nDims + nMeas, qcy: nRows },
    } as unknown as HyperCube,
    totals,
  } as TableLayout;
}
