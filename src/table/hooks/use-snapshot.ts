// @ts-ignore ignore useImperativeHandle
import { onTakeSnapshot, useImperativeHandle, stardust } from '@nebula.js/stardust';
import type { TableLayout, ViewService, SnapshotLayout, HyperCube } from '../../types';
import findVisibleRows from '../utils/find-visible-rows';
import { getTotalPosition } from '../../handle-data';

interface UseSnapshotProps {
  layout: TableLayout;
  viewService: ViewService;
  model: EngineAPI.IGenericObject | undefined;
  rootElement: HTMLElement;
  contentRect: stardust.Rect;
}

const useSnapshot = ({ layout, viewService, model, rootElement, contentRect }: UseSnapshotProps) => {
  const getViewState = () => {
    if (layout.usePagination) {
      const totalsPosition = getTotalPosition(layout);
      const { visibleRowStartIndex = -1, visibleRowEndIndex = -1 } = findVisibleRows(rootElement, totalsPosition);
      return {
        scrollLeft: viewService.scrollLeft,
        visibleTop: viewService.qTop + visibleRowStartIndex,
        visibleHeight: visibleRowEndIndex < 0 ? 0 : visibleRowEndIndex - visibleRowStartIndex + 1,
        rowsPerPage: viewService.rowsPerPage,
        page: viewService.page,
      };
    }
    return {
      scrollLeft: viewService.scrollLeft,
      visibleLeft: viewService.visibleLeft,
      visibleWidth: viewService.visibleWidth,
      visibleTop: viewService.visibleTop,
      visibleHeight: viewService.visibleHeight,
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
