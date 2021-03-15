export default function sortingFactory(model, layout) {
  return (isDim, sortIdx) => {
    const sortOrder = [].concat(layout.qHyperCube.qEffectiveInterColumnSortOrder);
    const topSortIdx = sortOrder[0];
    let reversed;

    if (sortIdx !== topSortIdx) {
      sortOrder.splice(sortOrder.indexOf(sortIdx), 1);
      sortOrder.unshift(sortIdx);
    }

    const patches = [
      {
        qPath: '/qHyperCubeDef/qInterColumnSortOrder',
        qOp: 'replace',
        qValue: `[${sortOrder.join(',')}]`,
      },
    ];

    // reverse
    if (sortIdx === topSortIdx) {
      const { qDimensionInfo, qMeasureInfo } = layout.qHyperCube;
      const idx = isDim ? sortIdx : sortIdx - qDimensionInfo.length;
      const { qReverseSort } = isDim ? qDimensionInfo[idx] : qMeasureInfo[idx];
      const qPath = `/qHyperCubeDef/${isDim ? 'qDimensions' : 'qMeasures'}/${idx}/qDef/qReverseSort`;
      reversed = !qReverseSort;

      patches.push({
        qPath,
        qOp: 'replace',
        qValue: reversed.toString(),
      });
    }

    model.applyPatches(patches, true);

    return { sortIdx, reversed };
  };
}
