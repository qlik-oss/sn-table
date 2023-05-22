import { useMemo } from '@nebula.js/stardust';
import type { SnapshotData, ViewService, ViewState } from '../../types';

const createViewService = (viewState: ViewState, snapshotData?: SnapshotData): ViewService => {
  return {
    qLeft: 0,
    qTop: 0,
    qWidth: 0,
    qHeight: 0,
    visibleTop: viewState?.visibleTop,
    visibleHeight: viewState?.visibleHeight,
    scrollLeft: snapshotData?.content?.scrollLeft ?? (viewState?.scrollLeft || 0),
    rowsPerPage: snapshotData?.content?.rowsPerPage ?? viewState?.rowsPerPage,
    page: snapshotData?.content?.page ?? viewState?.page,
  };
};

const useViewService = (viewState: ViewState, snapshotData?: SnapshotData): ViewService =>
  useMemo(() => createViewService(viewState, snapshotData), [viewState, snapshotData]);

export default useViewService;
