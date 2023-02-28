import { Column, Row } from '../../../../../types';
import { SetCellSize } from '../../../types';

const createRow = (
  prevRows: Row[],
  matrixRow: EngineAPI.INxCellRows,
  matrixRowIdx: number,
  qArea: EngineAPI.IRect,
  pageRowStartIdx: number,
  columns: Column[],
  qSize: EngineAPI.ISize,
  setCellSize: SetCellSize
) => {
  const rowIdx = qArea.qTop + matrixRowIdx;
  const pageRowIdx = pageRowStartIdx + matrixRowIdx;
  const row: Row = prevRows[pageRowIdx] ?? { key: `row-${pageRowIdx}` };

  matrixRow.forEach((cell, matrixColIdx: number) => {
    const pageColIdx = matrixColIdx + qArea.qLeft;
    const { colIdx, isDim, isLocked, id } = columns[pageColIdx];
    row[id] = {
      ...cell,
      rowIdx,
      colIdx,
      isSelectable: isDim && !isLocked,
      pageRowIdx,
      pageColIdx,
      isLastRow: rowIdx === qSize.qcy - 1,
      isLastColumn: pageColIdx === qSize.qcx - 1,
    };

    setCellSize(cell.qText ?? '', pageRowIdx, pageColIdx);
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

export { createRow, isRowMissingData, isColumnMissingData };
