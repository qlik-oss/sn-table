import isPrinting from "./is-printing";
import { TableLayout, ViewService } from "./types";

const renderAsPagination = (layout: TableLayout, viewService: ViewService) => {
  // For multi-page download, viewService.viewState?.usePagination will override layout.usePagination
  if (viewService.viewState?.usePagination !== undefined) return viewService.viewState.usePagination;
  return layout.usePagination !== false || isPrinting(layout, viewService);
};

export default renderAsPagination;
