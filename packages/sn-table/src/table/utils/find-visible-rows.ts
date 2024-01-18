import { TotalsPosition, ViewService } from "../../types";

const EPSILON = 0.001;

export const getPartialTopScrollHeight = (
  rows: HTMLCollectionOf<Element> | undefined,
  tableBodyRect: { top: number; bottom: number },
  index: number,
): number => {
  if (!rows || rows.length === 0 || index < 0) return 0;
  const rowRect = rows[index].getBoundingClientRect();
  return Math.max(tableBodyRect.top - rowRect.top, 0);
};

const findStartIndex = (
  rows: HTMLCollectionOf<Element> | undefined,
  tableBodyRect: { top: number; bottom: number },
): number => {
  if (!rows) return -1;
  for (let i = 0; i < rows.length; i++) {
    const rowRect = rows[i].getBoundingClientRect();
    if (rowRect.bottom > tableBodyRect.top) return i;
  }
  return -1;
};

const findEndIndex = (
  rows: HTMLCollectionOf<Element> | undefined,
  tableBodyRect: { top: number; bottom: number },
): number => {
  if (!rows) return -1;
  for (let i = rows.length - 1; i > -1; i--) {
    const rowRect = rows[i].getBoundingClientRect();
    if (tableBodyRect.bottom > rowRect.top) return i;
  }
  return -1;
};

export function findPaginationVisibleRows(rootElement: HTMLElement, totalsPosition: TotalsPosition) {
  const tableContainer = rootElement.getElementsByClassName("sn-table-container")[0];
  if (!tableContainer) return {};
  const tableContainerRect = tableContainer?.getBoundingClientRect() || {};
  const headRow = rootElement.getElementsByClassName("sn-table-head-row")[0];
  const headRowRect = headRow?.getBoundingClientRect() || { height: 0 };
  const totalsRow = rootElement.getElementsByClassName("sn-table-totals-row")[0];
  const totalsRowRec = totalsRow?.getBoundingClientRect() || { height: 0 };
  const dataRows = rootElement.getElementsByClassName("sn-table-data-row");
  const tableBodyMinY = tableContainerRect.y + headRowRect.height + (totalsPosition.atTop ? totalsRowRec.height : 0);
  const tableBodyMaxY =
    tableContainerRect.y + tableContainerRect.height - (totalsPosition.atBottom ? totalsRowRec.height : 0);
  const tableBodyRect = {
    top: tableBodyMinY,
    bottom: tableBodyMaxY,
  };
  const visibleRowStartIndex = findStartIndex(dataRows, tableBodyRect);
  const visibleRowEndIndex = findEndIndex(dataRows, tableBodyRect);
  const rowPartialHeight = getPartialTopScrollHeight(dataRows, tableBodyRect, visibleRowStartIndex);
  return { visibleRowStartIndex, visibleRowEndIndex, rowPartialHeight };
}

const getFirstCellOfRow = (rowIndex: number, cells?: NodeListOf<Element>) => {
  if (!cells) return undefined;
  for (let i = 0; i < cells.length; i++) {
    const strIdx = cells[i].getAttribute("rowindex");
    if (strIdx && parseInt(strIdx, 10) === rowIndex) return cells[i];
  }
  return undefined;
};

const shouldIncludeRowWithCell = (cellRect: DOMRect, min: number, max: number) => {
  if (!cellRect) return false;
  const center = cellRect.y + cellRect.height / 2;
  return center >= min && center <= max;
};

export function findVirtualizedVisibleRows(rootElement: HTMLElement, viewService: ViewService) {
  const tableBody = rootElement.querySelector(".sn-table-body");
  const bodyRect = tableBody?.getBoundingClientRect();
  const cells = tableBody?.querySelectorAll(".sn-table-body .sn-table-cell");
  if (!cells || !bodyRect) return {};
  const { scrollTopRatio = 0, visibleTop = 0, visibleHeight = 0, page = 0, rowsPerPage = 0 } = viewService;
  const offset = page * rowsPerPage;
  const visibleTopInPage = visibleTop - offset;
  const visibleBottomInPage = visibleTopInPage + visibleHeight - 1;
  const topLeftCell = getFirstCellOfRow(visibleTopInPage, cells);
  const topLeftCellRect = topLeftCell?.getBoundingClientRect();
  if (!topLeftCell || !topLeftCellRect) return {};
  const bodyYMin = bodyRect.y;
  if (1 - scrollTopRatio < EPSILON) {
    // The last data row is visible, then the priority start from the bottom row
    const shouldIncludeTopRow = topLeftCellRect.y >= bodyYMin - 4;
    return {
      visibleRowStartIndex: visibleTopInPage + (shouldIncludeTopRow ? 0 : 1) + offset,
      visibleRowEndIndex: visibleBottomInPage + offset,
    };
  }
  const bodyYMax = bodyRect.y + bodyRect.height;
  const visibleRowStartIndex =
    (shouldIncludeRowWithCell(topLeftCellRect, bodyYMin, bodyYMax) ? visibleTopInPage : visibleTopInPage + 1) + offset;
  let visibleRowEndIndex = visibleBottomInPage + offset;
  const bottomLeftCell = getFirstCellOfRow(visibleBottomInPage, cells);
  const bottomLeftCellRect = bottomLeftCell?.getBoundingClientRect();
  if (bottomLeftCell && bottomLeftCellRect) {
    if (!shouldIncludeRowWithCell(bottomLeftCellRect, bodyYMin, bodyYMax))
      visibleRowEndIndex = visibleBottomInPage - 1 + offset;
  }
  return { visibleRowStartIndex, visibleRowEndIndex };
}
