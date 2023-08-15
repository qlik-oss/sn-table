import { stardust } from "@nebula.js/stardust";
import { getColumns, getTotalPosition } from "../../../handle-data";
import { TableData, TableLayout } from "../../../types";
import { MAX_PAGE_SIZE } from "../constants";

export default function getVirtualScrollTableData(layout: TableLayout, interactions: stardust.Interactions): TableData {
  const totalsPosition = getTotalPosition(layout);
  const columns = getColumns(layout);
  const totalRowCount = layout.qHyperCube.qSize.qcy;
  const pageSize = Math.min(MAX_PAGE_SIZE, totalRowCount);
  const paginationNeeded = totalRowCount > MAX_PAGE_SIZE && !!interactions.active;

  return {
    totalsPosition,
    columns,
    rows: [], // Cannot be created here as it depends on data that is only available in the react components
    totalRowCount,
    totalColumnCount: layout.qHyperCube.qSize.qcx,
    totalPages: Math.ceil(totalRowCount / pageSize),
    paginationNeeded,
  };
}
