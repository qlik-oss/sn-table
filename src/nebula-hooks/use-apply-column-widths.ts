import { useMemo } from '@nebula.js/stardust';
import { HyperCube, ApplyColumnWidths } from '../types';

export const applyColumnWidthsFactory =
  (model: EngineAPI.IGenericObject | undefined, qHyperCube: HyperCube): ApplyColumnWidths =>
  (newColumnWidth, column) => {
    const { isDim, colIdx } = column;
    let qPath;
    let oldColumnWidth;

    if (isDim) {
      qPath = `/qHyperCubeDef/qDimension/${colIdx}/qDef/columnWidth`;
      oldColumnWidth = qHyperCube.qDimensionInfo[colIdx].columnWidth;
    } else {
      const index = colIdx - qHyperCube.qDimensionInfo.length;
      qPath = `/qHyperCubeDef/qMeasures/${index}/qDef/columnWidth`;
      oldColumnWidth = qHyperCube.qMeasureInfo[index].columnWidth;
    }

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
