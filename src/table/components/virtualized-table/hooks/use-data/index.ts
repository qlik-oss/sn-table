import { useCallback, useEffect, useState } from 'react';
import { PageInfo, Row, Column } from '../../../../../types';
import useOnPropsChange from '../use-on-props-change';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../../constants';
import useGetHyperCubeDataQueue from '../use-get-hypercube-data-queue';
import { createRow, isColumnMissingData, isRowMissingData } from './utils';
import { useContextSelector, TableContext } from '../../../../context';

export type LoadData = (left: number, top: number, width: number, height: number) => void;

export interface UseData {
  rowsInPage: Row[];
  loadRows: LoadData;
  loadColumns: LoadData;
}

const useData = (
  pageInfo: PageInfo,
  visibleRowCount: number,
  visibleColumnCount: number,
  columns: Column[]
): UseData => {
  const { layout, model } = useContextSelector(TableContext, (value) => value.baseProps);
  const [rowsInPage, setRowsInPage] = useState<Row[]>([]);

  const getDataPages = useCallback(
    async (pages: EngineAPI.INxPage[]) => (model as EngineAPI.IGenericObject).getHyperCubeData('/qHyperCubeDef', pages),
    [model]
  );

  const handleDataPages = useCallback(
    (dataPages: EngineAPI.INxDataPage[]) =>
      setRowsInPage((prevRows) => {
        const nextRows = [...prevRows];

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
              layout.qHyperCube.qSize
            );

            nextRows[pageRowIdx] = row;
          });
        });

        return nextRows;
      }),
    [pageInfo, columns, layout]
  );

  // The queue takes a EngineAPI.INxPage object as items and adds them to a queue and
  // exists to prevent the same page from being fetched more than once.
  const queue = useGetHyperCubeDataQueue(getDataPages, handleDataPages);

  useOnPropsChange(() => {
    queue.clear();
    setRowsInPage([]);
  }, [layout, pageInfo.page]);

  const loadColumns: LoadData = useCallback(
    (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      for (let left = qLeft; left < qLeft + qWidth; left++) {
        if (isColumnMissingData(rowsInPage, left, qTop, qHeight)) {
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
    [rowsInPage, queue]
  );

  const loadRows: LoadData = useCallback(
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
          queue.enqueue(page);
        }
      }
    },
    [rowsInPage, queue, pageInfo]
  );

  useEffect(() => {
    // Initial data load
    const qTop = pageInfo.page * pageInfo.rowsPerPage;

    // Ensure that the data request size is never over 10 000
    const qWidth = Math.min(100, layout.qHyperCube.qSize.qcx, visibleColumnCount + COLUMN_DATA_BUFFER_SIZE);
    const qHeight = Math.min(100, layout.qHyperCube.qSize.qcy, visibleRowCount + ROW_DATA_BUFFER_SIZE);

    getDataPages([{ qLeft: 0, qTop, qHeight, qWidth }]).then(handleDataPages);
  }, [getDataPages, handleDataPages, layout, visibleRowCount, visibleColumnCount, pageInfo]);

  return {
    rowsInPage,
    loadRows,
    loadColumns,
  };
};

export default useData;
