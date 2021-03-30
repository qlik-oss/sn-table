export default function sortingFactory(model, columnOrder) {
  return (layout, isDim, columnIndex) => {
    const idx = columnOrder[columnIndex];
    const sortOrder = [].concat(layout.qHyperCube.qEffectiveInterColumnSortOrder);
    const topSortIdx = sortOrder[0];

    if (idx !== topSortIdx) {
      sortOrder.splice(sortOrder.indexOf(idx), 1);
      sortOrder.unshift(idx);
    }

    const patches = [
      {
        qPath: '/qHyperCubeDef/qInterColumnSortOrder',
        qOp: 'replace',
        qValue: `[${sortOrder.join(',')}]`,
      },
    ];

    // reverse
    if (idx === topSortIdx) {
      const { qDimensionInfo, qMeasureInfo } = layout.qHyperCube;
      const index = isDim ? idx : idx - qDimensionInfo.length;
      const { qReverseSort } = isDim ? qDimensionInfo[index] : qMeasureInfo[index];
      const qPath = `/qHyperCubeDef/${isDim ? 'qDimensions' : 'qMeasures'}/${index}/qDef/qReverseSort`;
      patches.push({
        qPath,
        qOp: 'replace',
        qValue: (!qReverseSort).toString(),
      });
    }

    model.applyPatches(patches, true);
  };
}
