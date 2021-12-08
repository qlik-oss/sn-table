export default function sortingFactory(model, columnOrder) {
  return (layout, isDim, columnIndex) => {
    const sortIdx = columnOrder[columnIndex];
    const sortOrder = [...layout.qHyperCube.qEffectiveInterColumnSortOrder];
    const topSortIdx = sortOrder[0];

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

      patches.push({
        qPath,
        qOp: 'replace',
        qValue: (!qReverseSort).toString(),
      });
    }

    model.applyPatches(patches, true);
  };
}
