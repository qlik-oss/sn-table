import { useMemo } from "@nebula.js/stardust";
import { Column, HyperCube, SortDirection } from "../types";

export const sortingFactory = (
  dimensionsLength: number,
  model: EngineAPI.IGenericObject | undefined,
  isNewHeadCellMenuEnabled: boolean
) => {
  if (!model) return undefined;

  return async (column: Column, newSortDirection?: SortDirection) => {
    const { isDim, colIdx, qReverseSort, sortDirection, isActivelySorted } = column;
    const idx = isDim ? colIdx : colIdx - dimensionsLength;

    // The sort order from the properties is needed since it contains hidden columns
    const properties = await model.getEffectiveProperties();
    const sortOrder = properties.qHyperCubeDef.qInterColumnSortOrder;
    const patches: EngineAPI.INxPatch[] = [];
    const shouldReverseSortOrder =
      (newSortDirection && newSortDirection !== sortDirection) || (!newSortDirection && isActivelySorted);

    // Reorder
    if (!isActivelySorted) {
      sortOrder.splice(sortOrder.indexOf(colIdx), 1);
      sortOrder.unshift(colIdx);

      patches.push({
        qPath: "/qHyperCubeDef/qInterColumnSortOrder",
        qOp: "Replace",
        qValue: `[${sortOrder.join(",")}]`,
      });
    }

    // Reverse
    // if flag is not enabled -> we only want to reverse column if it is the ActivelySortedColumn
    if ((isNewHeadCellMenuEnabled && shouldReverseSortOrder) || (!isNewHeadCellMenuEnabled && isActivelySorted)) {
      patches.push({
        qPath: `/qHyperCubeDef/${isDim ? "qDimensions" : "qMeasures"}/${idx}/qDef/qReverseSort`,
        qOp: "Replace",
        qValue: (!qReverseSort).toString(),
      });
    }

    model.applyPatches(patches, true);
  };
};

const useSorting = (
  hyperCube: HyperCube,
  model: EngineAPI.IGenericObject | undefined,
  isNewHeadCellMenuEnabled: boolean
) =>
  useMemo(
    () => sortingFactory(hyperCube.qDimensionInfo.length, model, isNewHeadCellMenuEnabled),
    [hyperCube.qDimensionInfo.length, model, isNewHeadCellMenuEnabled]
  );

export default useSorting;
