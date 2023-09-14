import { findPaginationVisibleRows, findVirtualizedVisibleRows } from './find-visible-rows';
import getVisibleHeight from './get-visible-height';
import { getTotalPosition } from '../../handle-data';
import renderAsPagination from '../../render-as-pagination';
import { TableLayout, TotalsPosition, ViewService } from '../../types';

const getViewState = (layout: TableLayout, viewService: ViewService, rootElement: HTMLElement) => {
  if (viewService.viewState && !viewService.viewState.isMultiPage) return viewService.viewState;
    const isPagination = renderAsPagination(layout, viewService);
    const totalsPosition = (isPagination || viewService.viewState?.isMultiPage) ? getTotalPosition(layout, viewService) : undefined;
    if (isPagination) {
      const {
        visibleRowStartIndex = -1,
        visibleRowEndIndex = -1,
        rowPartialHeight,
      } = findPaginationVisibleRows(rootElement, totalsPosition as TotalsPosition);
  
      return {
        rowPartialHeight,
        scrollLeft: viewService.scrollLeft,
        visibleTop: viewService.qTop + visibleRowStartIndex,
        visibleHeight: getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService),
        rowsPerPage: viewService.rowsPerPage,
        page: viewService.page,
        totalsPosition,
      };
    }
    const { visibleRowStartIndex = -1, visibleRowEndIndex = -1 } = findVirtualizedVisibleRows(rootElement, viewService);
    return {
      scrollLeft: viewService.scrollLeft,
      visibleLeft: viewService.visibleLeft,
      visibleWidth: viewService.visibleWidth,
      visibleTop: visibleRowStartIndex,
      visibleHeight: getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService),
      scrollTopRatio: viewService.scrollTopRatio,
      rowsPerPage: viewService.rowsPerPage,
      page: viewService.page,
      totalsPosition,
    };
};
  
export default getViewState;