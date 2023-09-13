import { getTotalPosition } from "../../handle-data";
import renderAsPagination from "../../render-as-pagination";
import { TableLayout, ViewService } from "../../types";
import { findPaginationVisibleRows, findVirtualizedVisibleRows } from "./find-visible-rows";
import getVisibleHeight from "./get-visible-height";

const getViewState = (layout: TableLayout, viewService: ViewService, rootElement: HTMLElement) => {
  if (viewService.viewState && !viewService.viewState.isMultiPage) return viewService.viewState;

  if (renderAsPagination(layout, viewService)) {
    const totalsPosition = getTotalPosition(layout, viewService);
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
  };
};

export default getViewState;
