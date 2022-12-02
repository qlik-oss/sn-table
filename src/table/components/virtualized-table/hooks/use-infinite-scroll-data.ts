import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debouncer } from 'qlik-chart-modules';
import { PageInfo, Row, TableLayout } from '../../../../types';
import useOnPropsChange from './use-on-props-change';
import { ROW_DATA_BUFFER_SIZE } from '../constants';

type LoadData = (left: number, top: number, width: number, height: number) => void;

type LoadDataByRows = (left: number, top: number, width: number, height: number) => Promise<void>;

interface UseInfiniteScrollData {
  rowsInPage: Row[];
  loadData: LoadData;
  debouncedLoadData: LoadData;
  loadDataByRows: LoadDataByRows;
  loadDataByColumns: LoadDataByRows;
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

const useInfiniteScrollData = (
  model: EngineAPI.IGenericObject,
  layout: TableLayout,
  pageInfo: PageInfo,
  visibleRowCount: number,
  visibleColumnCount: number
): UseInfiniteScrollData => {
  const [rowsInPage, setRowsInPage] = useState<Row[]>([]);
  useOnPropsChange(() => setRowsInPage([]), [layout, pageInfo.page]);

  const loadData: LoadData = useCallback(
    async (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      const pageRowStartIdx = qTop - pageInfo.page * pageInfo.rowsPerPage;
      // console.log('loadData', qLeft, qTop, qWidth, qHeight);

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

  const loadDataByColumns: LoadDataByRows = useCallback(
    async (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      const pages = [];

      for (let left = qLeft; left < qLeft + qWidth; left++) {
        if (isColumnMissingData(rowsInPage, left, qTop, qHeight)) {
          pages.push({ qLeft: left, qTop, qHeight, qWidth: 1 });
        }
      }

      if (pages.length === 0) {
        console.log('no data to lload', rowsInPage);
        return Promise.resolve();
      }

      console.log('loadDataByColumns', qLeft, qWidth);

      const dataPages = await model.getHyperCubeData('/qHyperCubeDef', pages);

      setRowsInPage((prevRows) => {
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
      });

      return Promise.resolve();
    },
    [model, rowsInPage, pageInfo.page, pageInfo.rowsPerPage]
  );

  const loadDataByRows: LoadDataByRows = useCallback(
    async (qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
      const pages = [];

      for (let top = qTop; top < qTop + qHeight; top++) {
        const pageTop = Math.max(0, top - pageInfo.page * pageInfo.rowsPerPage);
        if (isRowMissingData(rowsInPage, qLeft, pageTop, qWidth)) {
          pages.push({ qLeft, qTop: top, qHeight: 1, qWidth });
        }
      }

      if (pages.length === 0) {
        // console.log('no data to lload', rowsInPage);
        return Promise.resolve();
      }

      // console.log('loadDataByRows', qLeft, qTop, qWidth, qHeight, rowsInPage);

      const dataPages = await model.getHyperCubeData('/qHyperCubeDef', pages);

      setRowsInPage((prevRows) => {
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
      });

      return Promise.resolve();
    },
    [model, rowsInPage, pageInfo.page, pageInfo.rowsPerPage]
  );

  const memoizedLoadData = useMemo<LoadData>(() => debouncer(loadData, 150), [loadData]);

  const debouncedLoadData = useCallback(memoizedLoadData, [memoizedLoadData]);

  useEffect(() => {
    // Initial data load
    const top = pageInfo.page * pageInfo.rowsPerPage;
    console.log('init load', layout.qHyperCube.qSize);
    // Ensure that the data request size is never over 10 000
    const width = Math.min(100, layout.qHyperCube.qSize.qcx, visibleColumnCount + 0); // TODO replace 0 with col buffer size
    const height = Math.min(100, layout.qHyperCube.qSize.qcy, visibleRowCount + ROW_DATA_BUFFER_SIZE);

    loadData(0, top, width, height);
  }, [layout, visibleRowCount, visibleColumnCount, loadData, pageInfo]);

  return {
    rowsInPage,
    loadData,
    debouncedLoadData,
    loadDataByRows,
    loadDataByColumns,
  };
};

export default useInfiniteScrollData;
