import { useMemo } from "@nebula.js/stardust";
import { Column, HyperCube, SortDirection } from "../types";

export const sortingFactory = (dimensionsLength: number, model: EngineAPI.IGenericObject | undefined) => {
  if (!model) return undefined;

  return async (column: Column, newSortDirection: SortDirection) => {
    const { isDim, colIdx, qReverseSort, sortDirection } = column;
    const idx = isDim ? colIdx : colIdx - dimensionsLength;

    // The sort order from the properties is needed since it contains hidden columns
    const properties = await model.getEffectiveProperties();
    const sortOrder = properties.qHyperCubeDef.qInterColumnSortOrder;
    const patches: EngineAPI.INxPatch[] = [];
    const topSortIdx = sortOrder[0];

    if (colIdx !== topSortIdx) {
      // Reorder
      sortOrder.splice(sortOrder.indexOf(colIdx), 1);
      sortOrder.unshift(colIdx);
    }

    patches.push({
      qPath: "/qHyperCubeDef/qInterColumnSortOrder",
      qOp: "Replace",
      qValue: `[${sortOrder.join(",")}]`,
    });

    // Reverse
    if ((newSortDirection && newSortDirection !== sortDirection) || (!newSortDirection && colIdx === topSortIdx)) {
      const qPath = `/qHyperCubeDef/${isDim ? "qDimensions" : "qMeasures"}/${idx}/qDef/qReverseSort`;

      patches.push({
        qPath,
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
