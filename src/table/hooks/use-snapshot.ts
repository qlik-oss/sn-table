// @ts-ignore ignore useImperativeHandle
import { onTakeSnapshot, useImperativeHandle, stardust } from '@nebula.js/stardust';
import type { TableLayout, ViewService, SnapshotLayout, HyperCube } from '../../types';
import { findPaginationVisibleRows, findVirtualizedVisibleRows } from '../utils/find-visible-rows';
import { getTotalPosition } from '../../handle-data';
import { initialPageInfo } from '../../nebula-hooks/use-pagination-table';

interface UseSnapshotProps {
  layout: TableLayout;
  viewService: ViewService;
  model: EngineAPI.IGenericObject | undefined;
  rootElement: HTMLElement;
  contentRect: stardust.Rect;
}

const useSnapshot = ({ layout, viewService, model, rootElement, contentRect }: UseSnapshotProps) => {
  const totalRowCount = layout.qHyperCube.qSize.qcy;
  const paginationNeeded = totalRowCount > 10;
  const visualRowsPerPage = viewService.rowsPerPage || initialPageInfo.rowsPerPage;
  const getVisibleHeight = (visibleRowEndIndex: any, visibleRowStartIndex: any) => {
    const rowsRendered = visibleRowEndIndex - visibleRowStartIndex + 1;

    return paginationNeeded && rowsRendered < visualRowsPerPage
      ? visibleRowEndIndex - visibleRowStartIndex + 4
      : rowsRendered;
  };

  const getViewState = () => {
    if (viewService.viewState) return viewService.viewState;
    if (layout.usePagination) {
      const totalsPosition = getTotalPosition(layout);
      const { visibleRowStartIndex = -1, visibleRowEndIndex = -1 } = findPaginationVisibleRows(
        rootElement,
        totalsPosition
      );

      return {
        scrollLeft: viewService.scrollLeft,
        visibleTop: viewService.qTop + visibleRowStartIndex,
        visibleHeight: visibleRowEndIndex < 0 ? 0 : getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex),
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
      visibleHeight: visibleRowEndIndex < 0 ? 0 : getVisibleHeight(visibleRowEndIndex, visibleRowStartIndex),
      scrollTopRatio: viewService.scrollTopRatio,
      rowsPerPage: viewService.rowsPerPage,
      page: viewService.page,
    };
  };

  onTakeSnapshot(async (snapshotLayout: SnapshotLayout) => {
    if (!snapshotLayout.snapshotData || !model || snapshotLayout.snapshotData.content) {
      return snapshotLayout;
    }

    if ((model as EngineAPI.IGenericObject).getHyperCubeData) {
      if (!snapshotLayout.qHyperCube) {
        snapshotLayout.qHyperCube = {} as HyperCube;
      }
      const { scrollLeft, scrollTopRatio, visibleLeft, visibleWidth, visibleTop, visibleHeight, rowsPerPage, page } =
        getViewState();
      snapshotLayout.qHyperCube.qDataPages = await (model as EngineAPI.IGenericObject).getHyperCubeData(
        '/qHyperCubeDef',
        [
          {
            qLeft: 0,
            qTop: visibleTop ?? 0,
            qWidth: layout.qHyperCube.qSize.qcx,
            qHeight: visibleHeight ?? 0,
          },
        ]
      );
      snapshotLayout.snapshotData.content = {
        scrollLeft,
        scrollTopRatio,
        visibleLeft,
        visibleWidth,
        visibleTop,
        visibleHeight,
        rowsPerPage,
        page,
        size: { width: contentRect.width, height: contentRect.height },
      };
    }
    return snapshotLayout;
  });
  useImperativeHandle(
    () => ({
      getViewState,
    }),
    []
  );
};

export default useSnapshot;
