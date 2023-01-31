import { useMemo } from '@nebula.js/stardust';
import { HyperCube, ApplyColumnWidths } from '../types';

const applyColumnWidthsFactory =
  (model: EngineAPI.IGenericObject | undefined, qHyperCube: HyperCube): ApplyColumnWidths =>
  (newColumnSize, column) => {
    const { isDim, colIdx } = column;
    const index = isDim ? colIdx : colIdx - qHyperCube.qDimensionInfo.length;
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

const useApplyColumnWidths = (model: EngineAPI.IGenericObject | undefined, hyperCube: HyperCube) =>
  useMemo(() => applyColumnWidthsFactory(model, hyperCube), [model, hyperCube]);

export default useApplyColumnWidths;
