import { TotalsPosition, ViewService } from '../../types';

const EPSILON = 0.001;

const findStartIndex = (rows: HTMLCollectionOf<Element>, min: number, max: number): number => {
  for (let i = 0; i < rows.length; i++) {
    const rowRect = rows[i].getBoundingClientRect();
    const center = rowRect.y + rowRect.height / 2;
    if (center >= min && center <= max) {
      return i;
    }
  }
  return -1;
};

const findEndIndex = (rows: HTMLCollectionOf<Element>, min: number, max: number): number => {
  for (let i = rows.length - 1; i > -1; i--) {
    const rowRect = rows[i].getBoundingClientRect();
    const center = rowRect.y + rowRect.height / 2;
    if (center >= min && center <= max) {
      return i;
    }
  }
  return -1;
};

export function findPaginationVisibleRows(rootElement: HTMLElement, totalsPosition: TotalsPosition) {
  const tableContainer = rootElement.getElementsByClassName('sn-table-container')[0];
  if (!tableContainer) return {};
  const tableContainerRect = tableContainer?.getBoundingClientRect() || {};
  const headRow = rootElement.getElementsByClassName('sn-table-head-row')[0];
  const headRowRect = headRow?.getBoundingClientRect() || { height: 0 };
  const totalsRow = rootElement.getElementsByClassName('sn-table-totals-row')[0];
  const totalsRowRec = totalsRow?.getBoundingClientRect() || { height: 0 };
  const dataRows = rootElement.getElementsByClassName('sn-table-data-row');
  const yMin = tableContainerRect.y + headRowRect.height + (totalsPosition.atTop ? totalsRowRec.height : 0);
  const yMax = tableContainerRect.y + tableContainerRect.height - (totalsPosition.atBottom ? totalsRowRec.height : 0);
  const visibleRowStartIndex = findStartIndex(dataRows, yMin, yMax);
  const visibleRowEndIndex = findEndIndex(dataRows, yMin, yMax);
  return { visibleRowStartIndex, visibleRowEndIndex };
}

const getFristCellOfRow = (rowIndex: number, cells?: NodeListOf<Element>) => {
  if (!cells) return undefined;
  for (let i = 0; i < cells.length; i++) {
    const strIdx = cells[i].getAttribute('rowindex');
    if (strIdx && parseInt(strIdx, 10) === rowIndex) return cells[i];
  }
  return undefined;
};

const shouldCellBeIn = (cellRect: DOMRect, min: number, max: number) => {
  if (!cellRect) return false;
  const center = cellRect.y + cellRect.height / 2;
  return center >= min && center <= max;
};

export function findVirtualizedVisibleRows(rootElement: HTMLElement, viewService: ViewService) {
  const tableBody = rootElement.querySelector('.sn-table-body');
  const bodyRect = tableBody?.getBoundingClientRect();
  const cells = tableBody?.querySelectorAll('.sn-table-body .sn-table-cell');
  if (!cells || !bodyRect) return {};
  const { scrollTopRatio = 0, visibleTop = 0, visibleHeight = 0, page = 0, rowsPerPage = 0 } = viewService;
  const offset = page * rowsPerPage;
  const visibleTopInPage = visibleTop - offset;
  const visibleBottomInPage = visibleTopInPage + visibleHeight - 1;
  const r0c0Cell = getFristCellOfRow(visibleTopInPage, cells);
  const r0c0CellRect = r0c0Cell?.getBoundingClientRect();
  if (!r0c0Cell || !r0c0CellRect) return {};
  const bodyYMin = bodyRect.y;
  if (1 - scrollTopRatio < EPSILON) {
    // The last data row is visible, then the priority start from the bottom row
    const r0c0CellShouldBeIn = r0c0CellRect.y >= bodyYMin - 4;
    return {
      visibleRowStartIndex: visibleTopInPage + (r0c0CellShouldBeIn ? 0 : 1) + offset,
      visibleRowEndIndex: visibleBottomInPage + offset,
    };
  }
  const bodyYMax = bodyRect.y + bodyRect.height;
  const visibleRowStartIndex =
    (shouldCellBeIn(r0c0CellRect, bodyYMin, bodyYMax) ? visibleTopInPage : visibleTopInPage + 1) + offset;
  let visibleRowEndIndex = visibleBottomInPage + offset;
  const rNc0Cell = getFristCellOfRow(visibleBottomInPage, cells);
  const rNc0CellRect = rNc0Cell?.getBoundingClientRect();
  if (rNc0Cell && rNc0CellRect) {
    if (!shouldCellBeIn(rNc0CellRect, bodyYMin, bodyYMax)) visibleRowEndIndex = visibleBottomInPage - 1 + offset;
  }
  return { visibleRowStartIndex, visibleRowEndIndex };
}
