import { TotalsPosition } from '../../types';

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
  return -2;
};

const findVisibleRows = (rootElement: HTMLElement, totalsPosition: TotalsPosition) => {
  const tableContainer = rootElement.getElementsByClassName('sn-table-container')[0];
  if (!tableContainer) return {};
  const tableContainerRect = tableContainer?.getBoundingClientRect() || {};
  const headRow = rootElement.getElementsByClassName('sn-table-head-row')[0];
  const headRowRect = headRow?.getBoundingClientRect() || { height: 0 };
  const hasTotalsRow = totalsPosition.atTop || totalsPosition.atBottom;
  const totalsRow = hasTotalsRow ? rootElement.getElementsByClassName('sn-table-totals-row')[0] : undefined;
  const totalsRowRec = totalsRow?.getBoundingClientRect() || { height: 0 };
  const dataRows = rootElement.getElementsByClassName('sn-table-data-row');
  const yMin = tableContainerRect.y + headRowRect.height + (totalsPosition.atTop ? totalsRowRec.height : 0);
  const yMax = tableContainerRect.y + tableContainerRect.height - (totalsPosition.atBottom ? totalsRowRec.height : 0);
  const visibleRowStartIndex = findStartIndex(dataRows, yMin, yMax);
  const visibleRowEndIndex = findEndIndex(dataRows, yMin, yMax);
  return { visibleRowStartIndex, visibleRowEndIndex };
};

export default findVisibleRows;
