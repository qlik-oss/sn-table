import { stardust } from '@nebula.js/stardust';
import { getTotalPosition, getColumns } from '../../../handle-data';
import { TableData, TableLayout } from '../../../types';
import { INITIAL_DATA_FETCH_HEIGHT, INITIAL_DATA_FETCH_WIDTH } from '../../constants';
import { MAX_PAGE_SIZE } from '../constants';

type TableDataResult = {
  tableData: TableData;
  derivedFrom: {
    layout: TableLayout;
    page: number;
  };
};

export default async function getVirtualScrollTableData(
  model: EngineAPI.IGenericObject,
  layout: TableLayout,
  constraints: stardust.Constraints,
  page: number
): Promise<TableDataResult> {
  const totalsPosition = getTotalPosition(layout);
  const columns = getColumns(layout);
  const totalRowCount = layout.qHyperCube.qSize.qcy;
  const pageSize = Math.min(MAX_PAGE_SIZE, totalRowCount);
  const paginationNeeded = totalRowCount > MAX_PAGE_SIZE && !constraints.active;

  let { qDataPages } = layout.qHyperCube;
  if (page !== 0 || qDataPages === undefined || qDataPages.length === 0) {
    const qTop = page * pageSize;
    qDataPages = await model.getHyperCubeData('/qHyperCubeDef', [
      {
        qLeft: 0,
        qTop,
        qWidth: INITIAL_DATA_FETCH_WIDTH,
        qHeight: INITIAL_DATA_FETCH_HEIGHT,
      },
    ]);
  }

  const tableData = {
    totalsPosition,
    columns,
    rows: [], // Cannot be created here as it depends on data that is only available in the react components
    totalRowCount,
    totalColumnCount: layout.qHyperCube.qSize.qcx,
    totalPages: Math.ceil(totalRowCount / pageSize),
    paginationNeeded,
    initialDataPages: qDataPages,
  };

  return {
    tableData,
    derivedFrom: {
      layout,
      page,
    },
  };
}
