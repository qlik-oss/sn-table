import { useMemo } from "@nebula.js/stardust";
import { ApplyColumnWidths, HyperCube } from "../types";

export const applyColumnWidthsFactory =
  (qHyperCube: HyperCube, model: EngineAPI.IGenericObject | undefined): ApplyColumnWidths =>
  (newColumnWidth, { isDim, colIdx }) => {
    const index = isDim ? colIdx : colIdx - qHyperCube.qDimensionInfo.length;
    const qPath = `/qHyperCubeDef/${isDim ? "qDimensions" : "qMeasures"}/${index}/qDef/columnWidth`;
    const oldColumnWidth = qHyperCube[isDim ? "qDimensionInfo" : "qMeasureInfo"][index].columnWidth;

    const patch = oldColumnWidth
      ? {
          qPath,
          qOp: "Replace" as EngineAPI.NxPatchOpType,
          qValue: JSON.stringify({ ...oldColumnWidth, ...newColumnWidth }),
        }
      : {
          qPath,
          qOp: "Add" as EngineAPI.NxPatchOpType,
          qValue: JSON.stringify(newColumnWidth),
        };

    model?.applyPatches([patch], true);
  };

const useApplyColumnWidths = (hyperCube: HyperCube, model: EngineAPI.IGenericObject | undefined) =>
  useMemo(() => applyColumnWidthsFactory(hyperCube, model), [hyperCube, model]);

export default useApplyColumnWidths;
