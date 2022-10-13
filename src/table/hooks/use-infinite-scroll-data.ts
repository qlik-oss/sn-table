import { useCallback, useMemo, useRef, useState } from 'react';
import { debouncer } from 'qlik-chart-modules';
import { Row, TableLayout } from '../../types';

interface UseInfiniteScrollData {
  data: Row[];
  loadData: (left: number, top: number, width: number, height: number) => void;
  debouncedLoadData: (left: number, top: number, width: number, height: number) => void;
}

const createNewRow = (matrixRow: EngineAPI.INxCellRows, prevRows: Row[], matrixRowIdx: number, top: number) => {
  const rowIdx = matrixRowIdx + top;
  const row: Row = prevRows[rowIdx] || { key: `row-${rowIdx}` };

  matrixRow.forEach((cell, matrixColIdx: number) => {
    row[`col-${matrixColIdx + 0}`] = {
      ...cell,
      rowIdx,
      colIdx: matrixColIdx + 0,
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
  const [data, setData] = useState<Row[]>([]);
  const [area, setArea] = useState<EngineAPI.IRect>({ qLeft: 0, qTop: 0, qWidth: 0, qHeight: 0 } as EngineAPI.IRect);

  const loadRow = useCallback(
    async (start: number, rowCount: number) => {
      if (!model || !layout) return;

      const [dataPage] = await model.getHyperCubeData('/qHyperCubeDef', [
        {
          qTop: start,
          qLeft: 0,
          qHeight: rowCount,
          qWidth: area.qWidth,
        },
      ]);

      setData((prevRows) => {
        const newRows = [...prevRows];
        dataPage.qMatrix.forEach((matrixRow, matrixRowIdx: number) => {
          const { row } = createNewRow(matrixRow, newRows, matrixRowIdx, dataPage.qArea.qTop);

          newRows[dataPage.qArea.qTop + matrixRowIdx] = row;
        });

        return newRows;
      });

      setArea(dataPage.qArea);
    },
    [model, layout, area]
  );

  const loadData = useCallback(
    async (left: number, top: number, width: number, height: number) => {
      if (!model || !layout) return;

      const [dataPage] = await model.getHyperCubeData('/qHyperCubeDef', [
        { qTop: top, qLeft: left, qHeight: height, qWidth: width },
      ]);

      setData((prevRows) => {
        dataPage.qMatrix.forEach((matrixRow, matrixRowIdx: number) => {
          const { row, rowIdx } = createNewRow(matrixRow, prevRows, matrixRowIdx, top);

          prevRows[rowIdx] = row;
        });

        return [...prevRows];
      });

      setArea(dataPage.qArea);
    },
    [model, layout]
  );

  const memoizedLoadData = useMemo(() => debouncer(loadData, 50), [loadData]);

  const debouncedLoadData = useCallback(memoizedLoadData, [memoizedLoadData]);

  return {
    data,
    loadRow,
    loadData,
    debouncedLoadData,
  };
};

export default useInfiniteScrollData;
