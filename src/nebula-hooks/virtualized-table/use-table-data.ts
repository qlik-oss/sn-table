import { stardust, usePromise } from '@nebula.js/stardust';
import getVirtualScrollTableData from '../../table/virtualized-table/utils/get-table-data';
import { TableLayout, PageInfo } from '../../types';

interface UseTableDataProps {
  model: EngineAPI.IGenericObject | undefined;
  layout: TableLayout;
  shouldRender: boolean;
  pageInfo: PageInfo;
  constraints: stardust.Constraints;
}

const useTableData = ({ model, layout, shouldRender, pageInfo, constraints }: UseTableDataProps) => {
  /**
   * Initial data fetch should happen on layout changes or page changes. This enables the table
   * to always be populated with data on the first render. So that no empty cells are rendered,
   * given that the initial data fetch is large enough to fill rendered cells.
   */
  const [result] = usePromise(async () => {
    if (shouldRender && model) {
      return getVirtualScrollTableData(model, layout, constraints, pageInfo.page);
    }

    return undefined;
  }, [model, layout, constraints, shouldRender, pageInfo]);

  // Table data is loaded either from a new layout or if a page has changed. Add a loading safe guard
  // to avoid rending with stale data when either a layout or a page change occured.
  const isLoading = result?.derivedFrom.layout !== layout || result?.derivedFrom.page !== pageInfo.page;

  return {
    tableData: result?.tableData,
    isLoading,
  };
};

export default useTableData;
