import { useCallback, useEffect, useState } from 'react';
import { PageInfo, Row, TableLayout } from '../../../../types';
import useOnPropsChange from './use-on-props-change';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../constants';
import useGetHyperCubeDataQueue from './use-get-hypercube-data-queue';

type LoadData = (left: number, top: number, width: number, height: number) => void;

export type LoadBy = (left: number, top: number, width: number, height: number) => void;

interface UseInfiniteScrollData {
  rowsInPage: Row[];
  loadRows: LoadBy;
  loadColumns: LoadBy;
}

const createRow = (
  prevRows: Row[],
  matrixRow: EngineAPI.INxCellRows,
  matrixRowIdx: number,
  qArea: EngineAPI.IRect,
  pageRowStartIdx: number
) => {
  const rowIdx = qArea.qTop + matrixRowIdx;
  const pageRowIdx = pageRowStartIdx + matrixRowIdx;
  const row: Row = prevRows[pageRowIdx] ?? { key: `row-${pageRowIdx}` };

  matrixRow.forEach((cell, matrixColIdx: number) => {
    const colIdx = matrixColIdx + qArea.qLeft;
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

const isRowMissingData = (rows: Row[], x: number, y: number, width: number) => {
  const targetRow = rows[y] as Row | undefined;

  if (!targetRow) {
    return true; // Row is not cached
  }

  for (let colIndex = x; colIndex < x + width; colIndex++) {
    if (!targetRow[`col-${colIndex}`]) {
      return true; // Column is not cached
    }
  }

  return false;
};

const isColumnMissingData = (rows: Row[], x: number, y: number, height: number) => {
  const targetRows = rows.slice(y, height);

  if (targetRows.length === 0) {
    return true; // Rows are not cached
  }

  return targetRows.some((row) => !row[`col-${x}`]);
};

const pageToKey = ({ qLeft, qTop, qWidth, qHeight }: EngineAPI.INxPage) => `${qLeft}-${qTop}-${qWidth}-${qHeight}`;

const useInfiniteScrollData = (
  model: EngineAPI.IGenericObject,
  layout: TableLayout,
  pageInfo: PageInfo,
  visibleRowCount: number,
  visibleColumnCount: number
): UseInfiniteScrollData => {
  const [rowsInPage, setRowsInPage] = useState<Row[]>([]);

  useOnPropsChange(() => {
    setRowsInPage([]);
  }, [layout, pageInfo.page]);

  const fetchHandler = useCallback(
    async (pages: EngineAPI.INxPage[]) => model.getHyperCubeData('/qHyperCubeDef', pages),
    [model]
  );

  const resolvedHandler = useCallback(
    (dataPages: EngineAPI.INxDataPage[]) =>
      setRowsInPage((prevRows) => {
        const nextRows = [...prevRows];

        dataPages.forEach((dataPage) => {
          dataPage.qMatrix.forEach((matrixRow, matrixRowIdx) => {
            const pageRowStartIdx = dataPage.qArea.qTop - pageInfo.page * pageInfo.rowsPerPage;
            const { row, pageRowIdx } = createRow(nextRows, matrixRow, matrixRowIdx, dataPage.qArea, pageRowStartIdx);

            nextRows[pageRowIdx] = row;
          });
        });

        return nextRows;
      }),
    [pageInfo]
  );

  // The queue takes a EngineAPI.INxPage object as items and adds them to a queue and
  // exists to prevent the same page from being fetched more than once.
  const queue = useGetHyperCubeDataQueue(fetchHandler, resolvedHandler, [layout, pageInfo]);

  const loadData: LoadData = useCallback(
    async (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      const dataPages = await model.getHyperCubeData('/qHyperCubeDef', [{ qTop, qLeft, qHeight, qWidth }]);

      resolvedHandler(dataPages);
    },
    [model, resolvedHandler]
  );

  const loadColumns: LoadBy = useCallback(
    (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      for (let left = qLeft; left < qLeft + qWidth; left++) {
        if (isColumnMissingData(rowsInPage, left, qTop, qHeight)) {
          const page = {
            qLeft: left,
            qTop,
            qHeight,
            qWidth: 1,
          };
          const key = pageToKey(page);
          queue.enqueue(key, page);
        }
      }
    },
    [rowsInPage, queue]
  );

  const loadRows: LoadBy = useCallback(
    (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      for (let top = qTop; top < qTop + qHeight; top++) {
        const pageTop = Math.max(0, top - pageInfo.page * pageInfo.rowsPerPage);
        if (isRowMissingData(rowsInPage, qLeft, pageTop, qWidth)) {
          const page = {
            qLeft,
            qTop: top,
            qHeight: 1,
            qWidth,
          };
          const key = pageToKey(page);
          queue.enqueue(key, page);
        }
      }
    },
    [rowsInPage, queue, pageInfo]
  );

  useEffect(() => {
    // Initial data load
    const top = pageInfo.page * pageInfo.rowsPerPage;

    // Ensure that the data request size is never over 10 000
    const width = Math.min(100, layout.qHyperCube.qSize.qcx, visibleColumnCount + COLUMN_DATA_BUFFER_SIZE);
    const height = Math.min(100, layout.qHyperCube.qSize.qcy, visibleRowCount + ROW_DATA_BUFFER_SIZE);

    loadData(0, top, width, height);
  }, [layout, visibleRowCount, visibleColumnCount, loadData, pageInfo]);

  return {
    rowsInPage,
    loadRows,
    loadColumns,
  };
};

export default useInfiniteScrollData;
