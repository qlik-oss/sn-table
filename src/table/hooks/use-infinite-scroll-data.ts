import { useCallback, useMemo, useState } from 'react';
import { getColumnInfo, getColumnOrder } from '../../handle-data';
import { Column, Row, TableLayout } from '../../types';

interface UseInfiniteScrollData {
  data: Row[];
  columns: Column[];
  loadData: (left: number, top: number, width: number, height: number) => void;
  debouncedLoadData: (left: number, top: number, width: number, height: number) => void;
}

function createDebouncer(fn, wait = 50) {
  let timer: string | number | NodeJS.Timeout | undefined;

  return function debounced(...args) {
    const execute = () => fn.apply(this, args);

    clearTimeout(timer);
    timer = setTimeout(execute, wait);
  };
}

const useInfiniteScrollData = (
  model: EngineAPI.IGenericObject | undefined,
  layout: TableLayout
): UseInfiniteScrollData => {
  const [data, setData] = useState<Row[]>([]);

  const columns = useMemo(() => {
    const { qHyperCube } = layout;
    const columnOrder = getColumnOrder(qHyperCube);
    // using filter to remove hidden columns (represented with false)
    const cols = columnOrder
      .map((colIndex) => getColumnInfo(layout, colIndex, columnOrder))
      .filter(Boolean) as Column[];

    console.log('columns', cols);

    return cols;
  }, [layout]);

  const loadData = useCallback(
    async (left: number, top: number, width: number, height: number) => {
      if (!model) return;
      console.log('loading data', left, top, width, height);
      const [dataPage] = await model.getHyperCubeData('/qHyperCubeDef', [
        { qTop: top, qLeft: left, qHeight: height, qWidth: width },
      ]);

      setData((prevRows) => {
        dataPage.qMatrix.forEach((matrixRow, matrixRowIdx: number) => {
          const rowIdx = matrixRowIdx + top;
          const row: Row = prevRows[rowIdx] || { key: `row-${rowIdx}` };

          matrixRow.forEach((cell, matrixColIdx: number) => {
            row[`col-${matrixColIdx + left}`] = {
              ...cell,
              rowIdx,
              colIdx: null,
              // isSelectable: c.isDim && !c.isLocked,
              rawRowIdx: matrixRowIdx,
              rawColIdx: matrixColIdx,
              prevQElemNumber: dataPage.qMatrix[matrixRowIdx - 1]?.[matrixColIdx]?.qElemNumber,
              nextQElemNumber: dataPage.qMatrix[matrixRowIdx + 1]?.[matrixColIdx]?.qElemNumber,
            };
          });

          prevRows[rowIdx] = row;
        });

        return [...prevRows];
      });
    },
    [model, layout]
  );

  const debouncedLoadData = useCallback(
    createDebouncer(async (left: number, top: number, width: number, height: number) => {
      loadData(left, top, width, height);
    }, 100),
    [loadData]
  );

  return {
    data,
    columns,
    loadData,
    debouncedLoadData,
  };
};

export default useInfiniteScrollData;
