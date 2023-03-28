import { getBodyCellAlign } from '../../../../../handle-data';
import { Cell, Column, PageInfo, Row, TableLayout } from '../../../../../types';
import { SetCellSize } from '../../../types';

const createRow = (
  rows: Row[],
  cells: EngineAPI.INxCellRows,
  cellRowIdx: number,
  qArea: EngineAPI.IRect,
  pageRowStartIdx: number,
  columns: Column[],
  qSize: EngineAPI.ISize,
  setCellSize: SetCellSize
) => {
  const rowIdx = qArea.qTop + cellRowIdx;
  const pageRowIdx = pageRowStartIdx + cellRowIdx;
  const row: Row = rows[pageRowIdx] ?? { key: `row-${pageRowIdx}` };

  cells.forEach((cell, cellColIdx: number) => {
    const pageColIdx = cellColIdx + qArea.qLeft;
    const { colIdx, isDim, isLocked, id, bodyTextAlign, selectionColIdx } = columns[pageColIdx];

    row[id] = {
      ...cell,
      align: getBodyCellAlign(cell, bodyTextAlign),
      rowIdx,
      colIdx,
      isSelectable: isDim && !isLocked,
      pageRowIdx,
      pageColIdx,
      selectionColIdx,
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

const isRowMissingData = (rows: Row[], x: number, pageRowIdx: number, width: number, rowIdx: number) => {
  const row = rows[pageRowIdx] as Row | undefined;

  if (!row) {
    return true; // Row is not cached
  }

  for (let colIndex = x; colIndex < x + width; colIndex++) {
    const cell = row[`col-${colIndex}`] as Cell | undefined;
    if (cell?.rowIdx !== rowIdx) {
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

const toRows = (
  qDataPages: EngineAPI.INxDataPage[],
  pageInfo: PageInfo,
  rows: Row[],
  columns: Column[],
  layout: TableLayout,
  setCellSize: SetCellSize
) => {
  qDataPages.forEach((dataPage) => {
    dataPage.qMatrix.forEach((cells, cellRowIdx) => {
      const pageRowStartIdx = dataPage.qArea.qTop - pageInfo.page * pageInfo.rowsPerPage;
      const { row, pageRowIdx } = createRow(
        rows,
        cells,
        cellRowIdx,
        dataPage.qArea,
        pageRowStartIdx,
        columns,
        layout.qHyperCube.qSize,
        setCellSize
      );

      rows[pageRowIdx] = row;
    });
  });
};

const createEmptyState = (rowCount: number) => Array(rowCount).fill(undefined);

export { createRow, isRowMissingData, isColumnMissingData, toRows, createEmptyState };
