import { TableLayout, ViewService } from './types';

const renderAsPagination = (layout: TableLayout, viewService: ViewService) => {
  // For multi-page download
  if (viewService.viewState?.tableType === 0) return true;
  if (viewService.viewState?.tableType === 1) return false;
  return layout.usePagination !== false;
}

export default renderAsPagination;
