import { useCallback, useEffect, useRef, useState } from 'react';
import { PageInfo, Row, Column, TableLayout } from '../../../../types';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../../constants';
import { GridState, SetCellSize } from '../../types';
import useGetHyperCubeDataQueue from '../use-get-hypercube-data-queue';
import useMutableProp from '../use-mutable-prop';
import useOnPropsChange from '../use-on-props-change';
import { createEmptyState, isColumnMissingData, isRowMissingData, toRows } from './utils';

export type LoadData = (
  left: number,
  top: number,
  width: number,
  height: number,
  onBeforeHandlePages?: () => void
) => void;

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
  setCellSize: SetCellSize,
  gridState: React.MutableRefObject<GridState>
): UseData => {
  const mutableRowsInPage = useRef<Row[]>([]);
  const mutableSetCellSize = useMutableProp<SetCellSize>(setCellSize);
  const memoizedToRows = useCallback(
    (qDataPages: EngineAPI.INxDataPage[], prevState?: Row[]) => {
      const nextState = Array.isArray(prevState) ? prevState.slice(0, rowCount) : createEmptyState(rowCount);

      toRows(qDataPages, pageInfo, nextState, columns, layout, mutableSetCellSize.current);

      mutableRowsInPage.current = nextState;

      return nextState;
    },
    [rowCount, pageInfo, columns, layout, mutableSetCellSize]
  );
  const [rowsInPage, setRowsInPage] = useState<Row[]>(() => memoizedToRows(layout.qHyperCube.qDataPages));

  useOnPropsChange(() => {
    // Derive state (rowsInPage) from prop (layout)
    setRowsInPage(memoizedToRows(pageInfo.page === 0 ? layout.qHyperCube.qDataPages : []));
  }, [layout]);

  const getDataPages = (pages: EngineAPI.INxPage[]) => model.getHyperCubeData('/qHyperCubeDef', pages);

  const handleDataPages = (dataPages: EngineAPI.INxDataPage[]) =>
    setRowsInPage((prevState) => memoizedToRows(dataPages, prevState));

  // The queue takes a EngineAPI.INxPage object as items and adds them to a queue and
  // exists to prevent the same page from being fetched more than once.
  const queue = useGetHyperCubeDataQueue(getDataPages, handleDataPages);

  const loadColumns: LoadData = useCallback(
    (qLeft, qTop, qWidth, qHeight, onBeforeHandlePages) => {
      for (let left = qLeft; left < qLeft + qWidth; left++) {
        if (isColumnMissingData(mutableRowsInPage.current, left, qTop, qHeight)) {
          const page = {
            qLeft: left,
            qTop,
            qHeight,
            qWidth: 1,
          };

          queue.enqueue(page, onBeforeHandlePages);
        }
      }
    },
    [mutableRowsInPage, queue]
  );

  const loadRows: LoadData = useCallback(
    (qLeft, qTop, qWidth, qHeight, onBeforeHandlePages) => {
      for (let top = qTop; top < qTop + qHeight; top++) {
        const pageTop = Math.max(0, top - pageInfo.page * pageInfo.rowsPerPage);
        if (isRowMissingData(mutableRowsInPage.current, qLeft, pageTop, qWidth, top)) {
          const page = {
            qLeft,
            qTop: top,
            qHeight: 1,
            qWidth,
          };

          queue.enqueue(page, onBeforeHandlePages);
        }
      }
    },
    [mutableRowsInPage, queue, pageInfo]
  );

  useEffect(() => {
    // Run this hook everytime "rowsInPage" becomes stale
    const { qcx, qcy } = layout.qHyperCube.qSize;
    const rowStart = 0;
    const qLeft = gridState.current.overscanColumnStartIndex;
    const qTop = rowStart + pageInfo.page * pageInfo.rowsPerPage;

    // Ensure that the data request size is never over 10 000
    const remainingColumns = qcx - qLeft;
    const remainingRowsOnPage = pageInfo.rowsPerPage - rowStart;
    const qWidth = Math.min(100, remainingColumns, qcx, visibleColumnCount + COLUMN_DATA_BUFFER_SIZE);
    const qHeight = Math.min(100, remainingRowsOnPage, qcy, visibleRowCount + ROW_DATA_BUFFER_SIZE);

    const onBeforeHandlePages = () => {
      setRowsInPage(memoizedToRows(pageInfo.page === 0 ? layout.qHyperCube.qDataPages : []));
    };

    loadRows(qLeft, qTop, qWidth, qHeight, onBeforeHandlePages);

    return () => {
      queue.clear();
    };
  }, [layout, visibleRowCount, visibleColumnCount, pageInfo, queue, loadRows, memoizedToRows, gridState, rowCount]);

  return {
    rowsInPage,
    loadRows,
    loadColumns,
    deferredRowCount: rowsInPage.length,
  };
};

export default useData;
