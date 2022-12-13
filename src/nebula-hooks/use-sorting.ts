import { useMemo } from '@nebula.js/stardust';
import { Column, HyperCube, SortDirection } from '../types';

export const sortingFactory = (model: EngineAPI.IGenericObject | undefined, hyperCube: HyperCube) => {
  if (!model) return undefined;

  return async (column: Column, sortDirection?: SortDirection) => {
    const { isDim, colIdx } = column;
    const { qDimensionInfo, qMeasureInfo } = hyperCube;
    const idx = isDim ? colIdx : colIdx - qDimensionInfo.length;
    const { qReverseSort, qSortIndicator } = isDim ? qDimensionInfo[idx] : qMeasureInfo[idx];

    // The sort order from the properties is needed since it contains hidden columns
    const properties = await model.getEffectiveProperties();
    const sortOrder = properties.qHyperCubeDef.qInterColumnSortOrder;
    const topSortIdx = sortOrder[0];

    if (colIdx !== topSortIdx) {
      sortOrder.splice(sortOrder.indexOf(colIdx), 1);
      sortOrder.unshift(colIdx);
    }

    const patches = [
      {
        qPath: '/qHyperCubeDef/qInterColumnSortOrder',
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        qValue: `[${sortOrder.join(',')}]`,
      },
    ];

    // Revers
    if (
      (sortDirection && sortDirection?.charAt(0).toUpperCase() !== qSortIndicator) ||
      (!sortDirection && colIdx === topSortIdx)
    ) {
      const qPath = `/qHyperCubeDef/${isDim ? 'qDimensions' : 'qMeasures'}/${idx}/qDef/qReverseSort`;

      patches.push({
        qPath,
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        qValue: (!qReverseSort).toString(),
      });
    }
    model.applyPatches(patches, true);
  };
};

const useSorting = (model: EngineAPI.IGenericObject | undefined, hyperCube: HyperCube) =>
  useMemo(() => sortingFactory(model, hyperCube), [model, hyperCube]);
export default useSorting;
