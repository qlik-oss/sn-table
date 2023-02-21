import { useCallback, useEffect, useRef, useState } from 'react';
import { PageInfo, Row, Column, TableLayout } from '../../../../types';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../../constants';
import { SetCellSize } from '../../types';
import useGetHyperCubeDataQueue from '../use-get-hypercube-data-queue';
import { createRow, isColumnMissingData, isRowMissingData } from './utils';

export type LoadData = (left: number, top: number, width: number, height: number) => void;

export interface UseData {
  rowsInPage: Row[];
  loadRows: LoadData;
  loadColumns: LoadData;
  deferredRowCount: number;
}

const useData = (
  layout: TableLayout,
  model: EngineAPI.IGenericObject,
  pageInfo: PageInfo,
  rowCount: number,
  visibleRowCount: number,
  visibleColumnCount: number,
  columns: Column[],
  setCellSize: SetCellSize
): UseData => {
  const [rowsInPage, setRowsInPage] = useState<Row[]>(Array(rowCount).fill(undefined));
  const mutableRowsInPage = useRef(rowsInPage);

  const getDataPages = useCallback(
    async (pages: EngineAPI.INxPage[]) => model.getHyperCubeData('/qHyperCubeDef', pages),
    [model]
  );

  const handleDataPages = useCallback(
    (dataPages: EngineAPI.INxDataPage[]) =>
      setRowsInPage((prevRows) => {
        const nextRows = [...prevRows];
        mutableRowsInPage.current = nextRows;

        dataPages.forEach((dataPage) => {
          dataPage.qMatrix.forEach((matrixRow, matrixRowIdx) => {
            const pageRowStartIdx = dataPage.qArea.qTop - pageInfo.page * pageInfo.rowsPerPage;
            const { row, pageRowIdx } = createRow(
              nextRows,
              matrixRow,
              matrixRowIdx,
              dataPage.qArea,
              pageRowStartIdx,
              columns,
              layout.qHyperCube.qSize,
              setCellSize
            );

            nextRows[pageRowIdx] = row;
          });
        });

        return nextRows;
      }),
    [pageInfo, columns, layout, setCellSize, mutableRowsInPage]
  );

  // The queue takes a EngineAPI.INxPage object as items and adds them to a queue and
  // exists to prevent the same page from being fetched more than once.
  const queue = useGetHyperCubeDataQueue(getDataPages, handleDataPages);

  const loadColumns: LoadData = useCallback(
    (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      for (let left = qLeft; left < qLeft + qWidth; left++) {
        if (isColumnMissingData(mutableRowsInPage.current, left, qTop, qHeight)) {
          const page = {
            qLeft: left,
            qTop,
            qHeight,
            qWidth: 1,
          };

          queue.enqueue(page);
        }
      }
    },
    [mutableRowsInPage, queue]
  );

  const loadRows: LoadData = useCallback(
    (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      for (let top = qTop; top < qTop + qHeight; top++) {
        const pageTop = Math.max(0, top - pageInfo.page * pageInfo.rowsPerPage);
        if (isRowMissingData(mutableRowsInPage.current, qLeft, pageTop, qWidth)) {
          const page = {
            qLeft,
            qTop: top,
            qHeight: 1,
            qWidth,
          };
          queue.enqueue(page);
        }
      }
    },
    [mutableRowsInPage, queue, pageInfo]
  );

  useEffect(() => {
    // Run this hook everytime "rowsInPage" becomes stale
    const qTop = pageInfo.page * pageInfo.rowsPerPage;

    // Ensure that the data request size is never over 10 000
    const qWidth = Math.min(100, layout.qHyperCube.qSize.qcx, visibleColumnCount + COLUMN_DATA_BUFFER_SIZE);
    const qHeight = Math.min(100, layout.qHyperCube.qSize.qcy, visibleRowCount + ROW_DATA_BUFFER_SIZE);

    const onBeforeHandlePages = () => {
      setRowsInPage(Array(rowCount).fill(undefined)); // Reset rows to initial value
    };

    queue.enqueue({ qLeft: 0, qTop, qHeight, qWidth }, onBeforeHandlePages);

    return () => {
      queue.clear();
    };
  }, [layout, visibleRowCount, visibleColumnCount, pageInfo, queue, rowCount]);

  return {
    rowsInPage,
    loadRows,
    loadColumns,
    deferredRowCount: rowsInPage.length,
  };
};

export default useData;
