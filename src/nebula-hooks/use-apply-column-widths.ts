import { useMemo } from '@nebula.js/stardust';
import { HyperCube, ApplyColumnWidths } from '../types';

export const applyColumnWidthsFactory =
  (model: EngineAPI.IGenericObject | undefined, qHyperCube: HyperCube): ApplyColumnWidths =>
  (newColumnWidth, { isDim, colIdx }) => {
    const index = isDim ? colIdx : colIdx - qHyperCube.qDimensionInfo.length;
    const qPath = `/qHyperCubeDef/${isDim ? 'qDimensions' : 'qMeasures'}/${index}/qDef/columnWidth`;
    const oldColumnWidth = qHyperCube[isDim ? 'qDimensionInfo' : 'qMeasureInfo'][index].columnWidth;

    const patch = oldColumnWidth
      ? {
          qPath,
          qOp: 'Replace' as EngineAPI.NxPatchOpType,
          qValue: JSON.stringify({ ...oldColumnWidth, ...newColumnWidth }),
        }
      : {
          qPath,
          qOp: 'Add' as EngineAPI.NxPatchOpType,
          qValue: JSON.stringify(newColumnWidth),
        };

    model?.applyPatches([patch], true);
  };

const useApplyColumnWidths = (model: EngineAPI.IGenericObject | undefined, hyperCube: HyperCube) =>
  useMemo(() => applyColumnWidthsFactory(model, hyperCube), [model, hyperCube]);

export default useApplyColumnWidths;
