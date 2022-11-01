import { useMemo } from '@nebula.js/stardust';
import { HyperCube, UpdateColumnWidth } from '../types';

const updateColumnWidthFactory = (
  model: EngineAPI.IGenericObject | undefined,
  qHyperCube: HyperCube
): UpdateColumnWidth => {
  return (newColumnSize, column) => {
    const { isDim, dataColIdx } = column;
    const index = isDim ? dataColIdx : dataColIdx - qHyperCube.qDimensionInfo.length;
    const qPath = `/qHyperCubeDef/${isDim ? 'qDimensions' : 'qMeasures'}/${index}/qDef/columnSize`;
    const oldColumnSize = qHyperCube[isDim ? 'qDimensionInfo' : 'qMeasureInfo'][index].columnSize;
    const patch = oldColumnSize
      ? {
          qPath,
          qOp: 'Replace' as EngineAPI.NxPatchOpType,
          qValue: JSON.stringify({ ...oldColumnSize, ...newColumnSize }),
        }
      : {
          qPath,
          qOp: 'Add' as EngineAPI.NxPatchOpType,
          qValue: JSON.stringify(newColumnSize),
        };

    model?.applyPatches([patch], true);
  };
};

const useColumnResize = (model: EngineAPI.IGenericObject | undefined, hyperCube: HyperCube) =>
  useMemo(() => updateColumnWidthFactory(model, hyperCube), [model, hyperCube]);

export default useColumnResize;
