import { HyperCube, TableLayout, TotalsPosition, Cell, Row } from '../types';

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
  qColumnOrder: number[] = [],
  qGrandTotalRow: Record<string, string>[] = []
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

export const createCell = (rowIdx: number, colIdx = 0) =>
  ({
    qElemNumber: rowIdx,
    rowIdx,
    colIdx,
    pageRowIdx: rowIdx,
    pageColIdx: colIdx,
  } as Cell);

/**
 * creates a simplified Rows[] with one column. Used to create the pageRows that is in the selection state
 */
export const createPageRows = (rows: number, colIdx = 0) => {
  const pageRows: Row[] = [];
  for (let idx = 0; idx <= rows; idx++) {
    pageRows.push({ [`col-${colIdx}`]: createCell(idx, colIdx) });
  }
  return pageRows;
};
