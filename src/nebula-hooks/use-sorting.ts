import { useMemo } from "@nebula.js/stardust";
import { Column, HyperCube } from "../types";

export const sortingFactory = (dimensionsLength: number, model: EngineAPI.IGenericObject | undefined) => {
  if (!model) return undefined;

  return async (column: Column) => {
    const { isDim, colIdx, qReverseSort } = column;
    const idx = isDim ? colIdx : colIdx - dimensionsLength;

    // The sort order from the properties is needed since it contains hidden columns
    const properties = await model.getEffectiveProperties();
    const sortOrder = properties.qHyperCubeDef.qInterColumnSortOrder;
    const patches: EngineAPI.INxPatch[] = [];

    if (colIdx !== sortOrder[0]) {
      // Reorder
      sortOrder.splice(sortOrder.indexOf(colIdx), 1);
      sortOrder.unshift(colIdx);

      patches.push({
        qPath: "/qHyperCubeDef/qInterColumnSortOrder",
        qOp: "Replace",
        qValue: `[${sortOrder.join(",")}]`,
      });
    } else {
      // Reverse
      patches.push({
        qPath: `/qHyperCubeDef/${isDim ? "qDimensions" : "qMeasures"}/${idx}/qDef/qReverseSort`,
        qOp: "Replace",
        qValue: (!qReverseSort).toString(),
      });
    }

    model.applyPatches(patches, true);
  };
};

const useSorting = (hyperCube: HyperCube, model: EngineAPI.IGenericObject | undefined) =>
  useMemo(() => sortingFactory(hyperCube.qDimensionInfo.length, model), [hyperCube.qDimensionInfo.length, model]);

export default useSorting;
