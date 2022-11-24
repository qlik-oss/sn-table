import { useCallback, useEffect, useMemo, useState } from 'react';
import { debouncer } from 'qlik-chart-modules';
import { Column, PageInfo, Row, TableLayout } from '../../../../types';

type LoadData = (left: number, top: number, width: number, height: number) => void;

interface UseInfiniteScrollData {
  rowsInPage: Row[];
  loadData: LoadData;
  debouncedLoadData: LoadData;
}

const createNewRow = (
  matrixRow: EngineAPI.INxCellRows,
  prevRows: Row[],
  matrixRowIdx: number,
  qTop: number,
  qLeft: number,
  pageRowStartIdx: number,
  columns: Column[]
) => {
  const rowIdx = qTop + matrixRowIdx;
  const pageRowIdx = pageRowStartIdx + matrixRowIdx;
  const row: Row = prevRows[pageRowIdx] ?? { key: `row-${pageRowIdx}` };

  matrixRow.forEach((cell, matrixColIdx: number) => {
    const colIdx = matrixColIdx + qLeft;
    row[`col-${colIdx}`] = {
      ...cell,
      rowIdx,
      colIdx,
      isSelectable: columns[colIdx].isDim && !columns[colIdx].isLocked,
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
  model: EngineAPI.IGenericObject,
  layout: TableLayout,
  pageInfo: PageInfo,
  columns: Column[]
): UseInfiniteScrollData => {
  const [rowsInPage, setRowsInPage] = useState<Row[]>([]);

  useEffect(() => setRowsInPage([]), [layout, pageInfo]);

  const loadData: LoadData = useCallback(
    async (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      const pageRowStartIdx = qTop - pageInfo.page * pageInfo.rowsPerPage;

      const [dataPage] = await model.getHyperCubeData('/qHyperCubeDef', [{ qTop, qLeft, qHeight, qWidth }]);

      setRowsInPage((prevRows) => {
        dataPage.qMatrix.forEach((matrixRow, matrixRowIdx: number) => {
          const { row, pageRowIdx } = createNewRow(
            matrixRow,
            prevRows,
            matrixRowIdx,
            qTop,
            qLeft,
            pageRowStartIdx,
            columns
          );

          prevRows[pageRowIdx] = row;
        });

        return [...prevRows];
      });
    },
    [model, pageInfo, columns]
  );

  const memoizedLoadData = useMemo<LoadData>(() => debouncer(loadData, 150), [loadData]);

  const debouncedLoadData = useCallback(memoizedLoadData, [memoizedLoadData]);

  return {
    rowsInPage,
    loadData,
    debouncedLoadData,
  };
};

export default useInfiniteScrollData;
