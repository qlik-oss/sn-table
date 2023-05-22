// @ts-ignore ignore useImperativeHandle
import { onTakeSnapshot, useImperativeHandle } from '@nebula.js/stardust';
import type { TableLayout, ViewService, SnapshotLayout, HyperCube } from '../../types';
import findVisibleRows from '../utils/find-visible-rows';
import { getTotalPosition } from '../../handle-data';

interface UseSnapshotProps {
  layout: TableLayout;
  viewService: ViewService;
  model: EngineAPI.IGenericObject | undefined;
  rootElement: HTMLElement;
}

const useSnapshot = ({ layout, viewService, model, rootElement }: UseSnapshotProps) => {
  onTakeSnapshot(async (snapshotLayout: SnapshotLayout) => {
    if (!snapshotLayout.snapshotData || !model || snapshotLayout.snapshotData.content) {
      return snapshotLayout;
    }

    if ((model as EngineAPI.IGenericObject).getHyperCubeData) {
      if (!snapshotLayout.qHyperCube) {
        snapshotLayout.qHyperCube = {} as HyperCube;
      }
      const totalsPosition = getTotalPosition(layout);
      const { visibleRowStartIndex = -1, visibleRowEndIndex = -1 } = findVisibleRows(rootElement, totalsPosition);
      snapshotLayout.qHyperCube.qDataPages = await (model as EngineAPI.IGenericObject).getHyperCubeData(
        '/qHyperCubeDef',
        [
          {
            qLeft: viewService.qLeft,
            qTop: viewService.qTop + visibleRowStartIndex,
            qWidth: viewService.qWidth,
            qHeight: visibleRowEndIndex < 0 ? 0 : visibleRowEndIndex - visibleRowStartIndex + 1,
          },
        ]
      );
      snapshotLayout.snapshotData.content = {
        scrollLeft: viewService.scrollLeft,
        rowsPerPage: viewService.rowsPerPage,
        page: viewService.page,
      };
    }
    return snapshotLayout;
  });
  useImperativeHandle(
    () => ({
      getViewState() {
        const totalsPosition = getTotalPosition(layout);
        const { visibleRowStartIndex = -1, visibleRowEndIndex = -1 } = findVisibleRows(rootElement, totalsPosition);
        return {
          scrollLeft: viewService.scrollLeft,
          visibleTop: viewService.qTop + visibleRowStartIndex,
          visibleHeight: visibleRowEndIndex < 0 ? 0 : visibleRowEndIndex - visibleRowStartIndex + 1,
          rowsPerPage: viewService.rowsPerPage,
          page: viewService.page,
        };
      },
    }),
    []
  );
};

export default useSnapshot;
