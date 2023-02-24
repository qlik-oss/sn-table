import { stardust } from '@nebula.js/stardust';
import { getTotalPosition, getColumns } from '../../../handle-data';
import { TableData, TableLayout } from '../../../types';
import { MAX_PAGE_SIZE } from '../constants';

export default function getVirtualScrollTableData(layout: TableLayout, constraints: stardust.Constraints): TableData {
  const totalsPosition = getTotalPosition(layout);
  const columns = getColumns(layout);
  columns.forEach((col) => {
    col.totalInfo = 'this is a long string with words';
  });
  const totalRowCount = layout.qHyperCube.qSize.qcy;
  const pageSize = Math.min(MAX_PAGE_SIZE, totalRowCount);
  const paginationNeeded = totalRowCount > MAX_PAGE_SIZE && !constraints.active;

  return {
    totalsPosition,
    columns,
    rows: [], // Not used by the virtual scroll table
    totalRowCount,
    totalColumnCount: layout.qHyperCube.qSize.qcx,
    totalPages: Math.ceil(totalRowCount / pageSize),
    paginationNeeded,
  };
}
