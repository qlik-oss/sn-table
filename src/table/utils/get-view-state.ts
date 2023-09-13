import { findPaginationVisibleRows, findVirtualizedVisibleRows } from './find-visible-rows';
import getVisibleHeight from './get-visible-height';
import { getTotalPosition } from '../../handle-data';
import renderAsPagination from '../../render-as-pagination';
import { TableLayout, ViewService } from '../../types';

const getViewState = (layout: TableLayout, viewService: ViewService, rootElement: HTMLElement) => {
    if (viewService.viewState && !viewService.viewState.isMultiPage) return viewService.viewState;
    let totalsPosition;
    if (renderAsPagination(layout, viewService)) {
      totalsPosition = getTotalPosition(layout, viewService);
      const {
        visibleRowStartIndex = -1,
        visibleRowEndIndex = -1,
        rowPartialHeight,
      } = findPaginationVisibleRows(rootElement, totalsPosition);
  
      return {
        rowPartialHeight,
        scrollLeft: viewService.scrollLeft,
        visibleTop: viewService.qTop + visibleRowStartIndex,
        visibleHeight: getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService),
        rowsPerPage: viewService.rowsPerPage,
        page: viewService.page,
        totalsPosition: viewService.viewState?.isMultiPage ? totalsPosition : undefined,
      };
    }
    const { visibleRowStartIndex = -1, visibleRowEndIndex = -1 } = findVirtualizedVisibleRows(rootElement, viewService);
    if (viewService.viewState?.isMultiPage) {
      totalsPosition = getTotalPosition(layout, viewService);
    }
    return {
      scrollLeft: viewService.scrollLeft,
      visibleLeft: viewService.visibleLeft,
      visibleWidth: viewService.visibleWidth,
      visibleTop: visibleRowStartIndex,
      visibleHeight: getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex, layout, viewService),
      scrollTopRatio: viewService.scrollTopRatio,
      rowsPerPage: viewService.rowsPerPage,
      page: viewService.page,
      totalsPosition: viewService.viewState?.isMultiPage ? totalsPosition : undefined,
    };
};
  
export default getViewState;