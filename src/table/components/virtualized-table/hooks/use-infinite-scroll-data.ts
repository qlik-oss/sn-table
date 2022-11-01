import { useCallback, useEffect, useMemo, useState } from 'react';
import { debouncer } from 'qlik-chart-modules';
import { PageInfo, Row, TableLayout } from '../../../../types';

interface UseInfiniteScrollData {
  rows: Row[];
  loadData: (left: number, top: number, width: number, height: number) => void;
  debouncedLoadData: (left: number, top: number, width: number, height: number) => void;
}

const createNewRow = (
  matrixRow: EngineAPI.INxCellRows,
  prevRows: Row[],
  matrixRowIdx: number,
  qTop: number,
  qLeft: number,
  pageRowStartIdx: number
) => {
  const rowIdx = matrixRowIdx + qTop;
  const pageRowIdx = pageRowStartIdx + matrixRowIdx;
  const row: Row = prevRows[pageRowIdx] || { key: `row-${pageRowIdx}` };

  matrixRow.forEach((cell, matrixColIdx: number) => {
    const colIdx = matrixColIdx + qLeft;
    row[`col-${colIdx}`] = {
      ...cell,
      rowIdx,
      colIdx,
      isSelectable: false, // TODO
      pageRowIdx,
      pageColIdx: colIdx,
      isLastRow: false, // TODO
    };
  });

  return {
    row,
    pageRowIdx,
  };
};

const useInfiniteScrollData = (
  model: EngineAPI.IGenericObject | undefined,
  layout: TableLayout,
  pageInfo: PageInfo
): UseInfiniteScrollData => {
  const [rowsInPage, setRowsInPage] = useState<Row[]>([]);

  useEffect(() => setRowsInPage([]), [layout, pageInfo]);

  const loadData = useCallback(
    async (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      if (!model) return;

      const pageRowStartIdx = qTop - pageInfo.page * pageInfo.rowsPerPage;

      console.log('LOADING DATA', qLeft, qTop, qTop + qHeight);

      const [dataPage] = await model.getHyperCubeData('/qHyperCubeDef', [
        {
          qTop,
          qLeft,
          qHeight,
          qWidth,
        },
      ]);

      setRowsInPage((prevRows) => {
        dataPage.qMatrix.forEach((matrixRow, matrixRowIdx: number) => {
          const { row, pageRowIdx } = createNewRow(matrixRow, prevRows, matrixRowIdx, qTop, qLeft, pageRowStartIdx);

          prevRows[pageRowIdx] = row;
        });

        return [...prevRows];
      });
    },
    [model, pageInfo]
  );

  const memoizedLoadData = useMemo(() => debouncer(loadData, 50), [loadData]);

  const debouncedLoadData = useCallback(memoizedLoadData, [memoizedLoadData]);

  return {
    rows: rowsInPage,
    loadData,
    debouncedLoadData,
  };
};

export default useInfiniteScrollData;
