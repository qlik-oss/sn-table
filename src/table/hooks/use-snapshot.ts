import { onTakeSnapshot, stardust, useImperativeHandle } from "@nebula.js/stardust";
import type { HyperCube, SnapshotLayout, TableLayout, ViewService } from "../../types";
import getViewState from "../utils/get-view-state";

interface UseSnapshotProps {
  layout: TableLayout;
  viewService: ViewService;
  model: EngineAPI.IGenericObject | undefined;
  rootElement: HTMLElement;
  contentRect: stardust.Rect;
}

const useSnapshot = ({ layout, viewService, model, rootElement, contentRect }: UseSnapshotProps) => {
  onTakeSnapshot(async (snapshotLayout: SnapshotLayout) => {
    if (!snapshotLayout.snapshotData || !model || snapshotLayout.snapshotData.content) {
      return snapshotLayout;
    }

    if (model.getHyperCubeData) {
      if (!snapshotLayout.qHyperCube) {
        snapshotLayout.qHyperCube = {} as HyperCube;
      }
      const {
        rowPartialHeight,
        scrollLeft,
        scrollTopRatio,
        visibleLeft,
        visibleWidth,
        visibleTop,
        visibleHeight,
        rowsPerPage,
        page,
      } = getViewState(layout, viewService, rootElement);
      snapshotLayout.qHyperCube.qDataPages = await model.getHyperCubeData("/qHyperCubeDef", [
        {
          qLeft: 0,
          qTop: visibleTop ?? 0,
          qWidth: layout.qHyperCube.qSize.qcx,
          qHeight: visibleHeight ?? 0,
        },
      ]);
      snapshotLayout.snapshotData.content = {
        rowPartialHeight,
        scrollLeft,
        scrollTopRatio,
        visibleLeft,
        visibleWidth,
        visibleTop,
        visibleHeight,
        rowsPerPage,
        page,
        size: { width: contentRect.width, height: contentRect.height },
        estimatedRowHeight: viewService.estimatedRowHeight,
      };
    }
    return snapshotLayout;
  });

  useImperativeHandle(
    () => ({
      getViewState: () => getViewState(layout, viewService, rootElement),
    }),
    [layout, viewService, rootElement]
  );
};

export default useSnapshot;
