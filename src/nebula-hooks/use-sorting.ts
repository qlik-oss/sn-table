import { useMemo } from '@nebula.js/stardust';
import { Column, HyperCube } from '../types';

export const sortingFactory = (model: EngineAPI.IGenericObject | undefined, hyperCube: HyperCube) => {
  if (!model) return undefined;

  return async (column: Column) => {
    const { isDim, dataColIdx } = column;
    // The sort order from the properties is needed since it contains hidden columns
    const properties = await model.getEffectiveProperties();
    const sortOrder = properties.qHyperCubeDef.qInterColumnSortOrder;
    const topSortIdx = sortOrder[0];

    if (dataColIdx !== topSortIdx) {
      sortOrder.splice(sortOrder.indexOf(dataColIdx), 1);
      sortOrder.unshift(dataColIdx);
    }

    const patches = [
      {
        qPath: '/qHyperCubeDef/qInterColumnSortOrder',
        qOp: 'Replace' as EngineAPI.NxPatchOpType,
        qValue: `[${sortOrder.join(',')}]`,
      },
    ];

    // reverse
    if (dataColIdx === topSortIdx) {
      const { qDimensionInfo, qMeasureInfo } = hyperCube;
      const idx = isDim ? dataColIdx : dataColIdx - qDimensionInfo.length;
      const { qReverseSort } = isDim ? qDimensionInfo[idx] : qMeasureInfo[idx];
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
