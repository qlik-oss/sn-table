import { useMemo, useOptions } from '@nebula.js/stardust';
import type { SnapshotData, ViewService, ViewState, UseOptions } from '../../types';

const createViewService = (viewState: ViewState, snapshotData?: SnapshotData): ViewService => {
  return {
    qLeft: 0,
    qTop: 0,
    qWidth: 0,
    qHeight: 0,
    visibleTop: viewState?.visibleTop,
    visibleHeight: viewState?.visibleHeight,
    scrollLeft: snapshotData?.content?.scrollLeft ?? viewState?.scrollLeft ?? 0,
    rowsPerPage: snapshotData?.content?.rowsPerPage ?? viewState?.rowsPerPage,
    page: snapshotData?.content?.page ?? viewState?.page,
  };
};

const useViewService = (snapshotData?: SnapshotData): ViewService => {
  const { viewState } = useOptions() as UseOptions;
  return useMemo(() => createViewService(viewState, snapshotData), [viewState, snapshotData]);
};

export default useViewService;
