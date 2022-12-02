import { useCallback, useEffect, useState } from 'react';
import { PageInfo, Row, TableLayout } from '../../../../types';
import useOnPropsChange from './use-on-props-change';
import { ROW_DATA_BUFFER_SIZE } from '../constants';
import useQueue from './use-queue';

type LoadData = (left: number, top: number, width: number, height: number) => void;

export type LoadBy = (left: number, top: number, width: number, height: number) => void;

interface UseInfiniteScrollData {
  rowsInPage: Row[];
  loadRows: LoadBy;
  loadColumns: LoadBy;
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

const curriedSetRowsInPageCallback = (dataPages: EngineAPI.INxDataPage[], pageInfo: PageInfo) => (prevRows: Row[]) => {
  const nextRows = [...prevRows];

  dataPages.forEach((dataPage) => {
    dataPage.qMatrix.forEach((matrixRow) => {
      const pageRowStartIdx = dataPage.qArea.qTop - pageInfo.page * pageInfo.rowsPerPage;
      const { row, pageRowIdx } = createNewRow(
        matrixRow,
        nextRows,
        0,
        dataPage.qArea.qTop,
        dataPage.qArea.qLeft,
        pageRowStartIdx
      );

      nextRows[pageRowIdx] = row;
    });
  });

  return nextRows;
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

const pageToKey = ({ qLeft, qTop, qWidth, qHeight }: EngineAPI.INxPage) => `${qLeft}-${qTop}-${qWidth}-${qHeight}-`;

const useInfiniteScrollData = (
  model: EngineAPI.IGenericObject,
  layout: TableLayout,
  pageInfo: PageInfo,
  visibleRowCount: number,
  visibleColumnCount: number
): UseInfiniteScrollData => {
  const [rowsInPage, setRowsInPage] = useState<Row[]>([]);

  useEffect(() => console.log(rowsInPage), [rowsInPage]);

  useOnPropsChange(() => setRowsInPage([]), [layout, pageInfo.page]);

  const onLoad = useCallback(
    async (pages: EngineAPI.INxPage[]) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 5000);
      }).then(() => {
        return model.getHyperCubeData('/qHyperCubeDef', pages).then((dataPages) => {
          setRowsInPage(curriedSetRowsInPageCallback(dataPages, pageInfo));
        });
      });
    },
    [model, pageInfo]
  );

  // The queue takes a EngineAPI.INxPage object as items and adds them to a queue and
  // exists to prevent the same page from being fetched more than once.
  const queue = useQueue<EngineAPI.INxPage>(onLoad, [layout, pageInfo]);

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

      queue.load();
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

      queue.load();
    },
    [rowsInPage, queue, pageInfo]
  );

  useEffect(() => {
    // Initial data load
    const top = pageInfo.page * pageInfo.rowsPerPage;

    // Ensure that the data request size is never over 10 000
    const width = Math.min(100, layout.qHyperCube.qSize.qcx, visibleColumnCount + 0); // TODO replace 0 with col buffer size
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
