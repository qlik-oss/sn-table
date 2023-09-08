import { TableLayout, ViewService } from './types';
import isPrinting from './is-printing';

const renderAsPagination = (layout: TableLayout, viewService: ViewService) => {
  // For multi-page download, viewService.viewState?.usePagination will override layout.usePagination
  if (viewService.viewState?.usePagination === true) return true;
  if (viewService.viewState?.usePagination === false) return false;
  return layout.usePagination !== false || isPrinting(layout, viewService);
}

export default renderAsPagination;
