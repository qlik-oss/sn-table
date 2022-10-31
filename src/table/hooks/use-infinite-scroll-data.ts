import { useCallback, useEffect, useMemo, useState } from 'react';
import { debouncer } from 'qlik-chart-modules';
import { Row, TableLayout } from '../../types';

interface UseInfiniteScrollData {
  rows: Row[];
  loadData: (left: number, top: number, width: number, height: number) => void;
  debouncedLoadData: (left: number, top: number, width: number, height: number) => void;
}

const createNewRow = (
  matrixRow: EngineAPI.INxCellRows,
  prevRows: Row[],
  matrixRowIdx: number,
  top: number,
  left: number
) => {
  const rowIdx = matrixRowIdx + top;
  const row: Row = prevRows[rowIdx] || { key: `row-${rowIdx}` };

  matrixRow.forEach((cell, matrixColIdx: number) => {
    const colIdx = matrixColIdx + left;
    row[`col-${colIdx}`] = {
      ...cell,
      rowIdx,
      colIdx,
      isSelectable: false, // TODO
      rawRowIdx: matrixRowIdx,
      rawColIdx: matrixColIdx,
      isLastRow: false, // TODO
    };
  });

  return {
    row,
    rowIdx,
  };
};

const useInfiniteScrollData = (
  model: EngineAPI.IGenericObject | undefined,
  layout: TableLayout
): UseInfiniteScrollData => {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => setRows([]), [layout]);

  const loadData = useCallback(
    async (left: number, top: number, width: number, height: number) => {
      if (!model) return;

      console.log('LOADING DATA', left, top);

      const [dataPage] = await model.getHyperCubeData('/qHyperCubeDef', [
        { qTop: top, qLeft: left, qHeight: height, qWidth: width },
      ]);

      setRows((prevRows) => {
        dataPage.qMatrix.forEach((matrixRow, matrixRowIdx: number) => {
          const { row, rowIdx } = createNewRow(matrixRow, prevRows, matrixRowIdx, top, left);

          prevRows[rowIdx] = row;
        });

        return [...prevRows];
      });
    },
    [model]
  );

  const memoizedLoadData = useMemo(() => debouncer(loadData, 50), [loadData]);

  const debouncedLoadData = useCallback(memoizedLoadData, [memoizedLoadData]);

  return {
    rows,
    loadData,
    debouncedLoadData,
  };
};

export default useInfiniteScrollData;
