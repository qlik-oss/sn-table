import { useMemo, useOptions } from '@nebula.js/stardust';
import type { SnapshotData, ViewService, ViewState, UseOptions, TableLayout } from '../../types';

const createViewService = (viewState: ViewState, snapshotData?: SnapshotData): ViewService => {
  return {
    qLeft: 0,
    qTop: 0,
    qWidth: 0,
    qHeight: 0,
    visibleTop: viewState?.visibleTop,
    visibleHeight: viewState?.visibleHeight,
    scrollLeft: snapshotData?.content?.scrollLeft ?? viewState?.scrollLeft ?? 0,
    scrollTopRatio: snapshotData?.content?.scrollTopRatio ?? viewState?.scrollTopRatio,
    rowsPerPage: snapshotData?.content?.rowsPerPage ?? viewState?.rowsPerPage,
    page: snapshotData?.content?.page ?? viewState?.page,
    viewState,
  };
};

const useViewService = (layout: TableLayout): ViewService => {
  const { viewState } = useOptions() as UseOptions;
  return useMemo(
    () => createViewService(viewState, layout.snapshotData),
    [viewState, layout.snapshotData, layout.usePagination]
  );
};

export default useViewService;
