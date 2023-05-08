/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { onTakeSnapshot, type stardust } from '@nebula.js/stardust';
import type { LayoutService, ViewService, SnapshotLayout } from '../../types';

interface UseSnapshotProps {
  layoutService: LayoutService;
  viewService: ViewService;
  rect: stardust.Rect;
  model: EngineAPI.IGenericObject | undefined;
}

const useSnapshot = ({ layoutService, viewService, rect, model }: UseSnapshotProps): stardust.Rect => {
  onTakeSnapshot(async (copyOfLayout: SnapshotLayout) => {
    if (!copyOfLayout.snapshotData) {
      return copyOfLayout;
    }

    if (!model) {
      return copyOfLayout;
    }

    if (!copyOfLayout.snapshotData.content) {
      if ((model as EngineAPI.IGenericObject)?.getHyperCubeData) {
        const dataPages = await (model as EngineAPI.IGenericObject).getHyperCubeData('/qHyperCubeDef', [
          {
            qLeft: viewService.gridColumnStartIndex,
            qTop: viewService.gridRowStartIndex,
            qWidth: viewService.gridWidth,
            qHeight: viewService.gridHeight,
          },
        ]);

        copyOfLayout.snapshotData.content = {
          qDataPages: dataPages,
        };
      }

      copyOfLayout.snapshotData.object.size.w = rect.width;
      copyOfLayout.snapshotData.object.size.h = rect.height;

      return copyOfLayout;
    }

    return copyOfLayout;
  });

  if (layoutService.layout.snapshotData?.content) {
    return {
      left: rect.left,
      top: rect.top,
      width: layoutService.layout.snapshotData.object.size.w,
      height: layoutService.layout.snapshotData.object.size.h,
    };
  }

  return rect;
};

export default useSnapshot;
