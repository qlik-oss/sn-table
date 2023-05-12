/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { onTakeSnapshot } from '@nebula.js/stardust';
import type { LayoutService, ViewService, SnapshotLayout, HyperCube } from '../../types';
import findVisibleRows from '../utils/find-visible-rows';
import { getTotalPosition } from '../../handle-data';

interface UseSnapshotProps {
  layoutService: LayoutService;
  viewService: ViewService;
  model: EngineAPI.IGenericObject | undefined;
  rootElement: HTMLElement;
}

const useSnapshot = ({ layoutService, viewService, model, rootElement }: UseSnapshotProps) => {
  onTakeSnapshot(async (snapshotLayout: SnapshotLayout) => {
    if (!snapshotLayout.snapshotData) {
      return snapshotLayout;
    }

    if (!model) {
      return snapshotLayout;
    }

    if (!snapshotLayout.snapshotData.content) {
      if ((model as EngineAPI.IGenericObject)?.getHyperCubeData) {
        if (!snapshotLayout.qHyperCube) {
          snapshotLayout.qHyperCube = {} as HyperCube;
        }
        const totalsPosition = getTotalPosition(layoutService.layout);
        const { visibleRowStartIndex = -1, visibleRowEndIndex = -2 } = findVisibleRows(rootElement, totalsPosition);
        snapshotLayout.qHyperCube.qDataPages = await (model as EngineAPI.IGenericObject).getHyperCubeData(
          '/qHyperCubeDef',
          [
            {
              qLeft: viewService.qLeft,
              qTop: viewService.qTop + visibleRowStartIndex,
              qWidth: viewService.qWidth,
              qHeight: visibleRowEndIndex - visibleRowStartIndex + 1,
            },
          ]
        );
        snapshotLayout.snapshotData.content = {
          scrollLeft: viewService.scrollLeft,
        };
      }
      return snapshotLayout;
    }

    return snapshotLayout;
  });
};

export default useSnapshot;
