import { initialPageInfo } from '../../nebula-hooks/use-pagination-table';
import { TableLayout, ViewService } from '../../types';

const getVisibleHeight = (
    visibleRowEndIndex: number,
    visibleRowStartIndex: number,
    layout: TableLayout,
    viewService: ViewService
  ) => {
    if (visibleRowEndIndex < 0) return 0;
  
    const totalRowCount = layout.qHyperCube.qSize.qcy;
    const visualRowsPerPage = viewService.rowsPerPage || initialPageInfo.rowsPerPage;
    // EXTRA_ROWS will be added to the visualHeight when the pagination footer is displayed and the table can be scrolled
    const EXTRA_ROWS = viewService.viewState?.isMultiPage ? 0 : 3;
    return Math.min(totalRowCount, visualRowsPerPage, visibleRowEndIndex - visibleRowStartIndex + 1 + EXTRA_ROWS);
};
  
export default getVisibleHeight;