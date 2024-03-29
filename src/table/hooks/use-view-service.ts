import { useMemo, useOptions } from "@nebula.js/stardust";
import type { SnapshotData, TableLayout, UseOptions, ViewService, ViewState } from "../../types";

const createViewService = (viewState: ViewState, snapshotData?: SnapshotData): ViewService => ({
  qTop: 0,
  qHeight: 0,
  rowPartialHeight: snapshotData?.content?.rowPartialHeight ?? 0,
  visibleTop: snapshotData?.content?.visibleTop ?? viewState?.visibleTop,
  visibleHeight: snapshotData?.content?.visibleHeight ?? viewState?.visibleHeight,
  scrollLeft: snapshotData?.content?.scrollLeft ?? viewState?.scrollLeft ?? 0,
  scrollTopRatio: snapshotData?.content?.scrollTopRatio ?? viewState?.scrollTopRatio,
  rowsPerPage: snapshotData?.content?.rowsPerPage ?? viewState?.rowsPerPage,
  page: snapshotData?.content?.page ?? viewState?.page,
  viewState,
  estimatedRowHeight: snapshotData?.content?.estimatedRowHeight ?? 0,
});

const useViewService = (layout: TableLayout): ViewService => {
  const { viewState } = useOptions() as UseOptions;
  return useMemo(
    () => createViewService(viewState, layout.snapshotData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewState, layout.snapshotData, layout.usePagination],
  );
};

export default useViewService;
