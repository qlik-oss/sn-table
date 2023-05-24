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
  const getViewState = () => {
    const totalsPosition = getTotalPosition(layout);
    const { visibleRowStartIndex = -1, visibleRowEndIndex = -1 } = findVisibleRows(rootElement, totalsPosition);
    return {
      scrollLeft: viewService.scrollLeft,
      visibleTop: viewService.qTop + visibleRowStartIndex,
      visibleHeight: visibleRowEndIndex < 0 ? 0 : visibleRowEndIndex - visibleRowStartIndex + 1,
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
      const { scrollLeft, visibleTop, visibleHeight, rowsPerPage, page } = getViewState();
      snapshotLayout.qHyperCube.qDataPages = await (model as EngineAPI.IGenericObject).getHyperCubeData(
        '/qHyperCubeDef',
        [
          {
            qLeft: viewService.qLeft,
            qTop: visibleTop,
            qWidth: viewService.qWidth,
            qHeight: visibleHeight,
          },
        ]
      );
      snapshotLayout.snapshotData.content = {
        scrollLeft,
        rowsPerPage,
        page,
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
