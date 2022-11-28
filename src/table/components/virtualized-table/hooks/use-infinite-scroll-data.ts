import { useCallback, useMemo, useState } from 'react';
import { debouncer } from 'qlik-chart-modules';
import { PageInfo, Row, TableLayout } from '../../../../types';
import useOnPropsChange from './use-on-props-change';

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
  pageRowStartIdx: number
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
  model: EngineAPI.IGenericObject,
  layout: TableLayout,
  pageInfo: PageInfo
): UseInfiniteScrollData => {
  const [rowsInPage, setRowsInPage] = useState<Row[]>([]);
  useOnPropsChange(() => setRowsInPage([]), [layout, pageInfo]);

  const loadData: LoadData = useCallback(
    async (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      const pageRowStartIdx = qTop - pageInfo.page * pageInfo.rowsPerPage;

      const [dataPage] = await model.getHyperCubeData('/qHyperCubeDef', [{ qTop, qLeft, qHeight, qWidth }]);

      setRowsInPage((prevRows) => {
        const nextRows = [...prevRows];
        dataPage.qMatrix.forEach((matrixRow, matrixRowIdx: number) => {
          const { row, pageRowIdx } = createNewRow(matrixRow, nextRows, matrixRowIdx, qTop, qLeft, pageRowStartIdx);

          nextRows[pageRowIdx] = row;
        });

        return nextRows;
      });
    },
    [model, pageInfo]
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
