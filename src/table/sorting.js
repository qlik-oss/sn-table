export default function sortingFactory(model) {
  return (layout, isDim, label) => {
    const { qDimensionInfo, qMeasureInfo } = layout.qHyperCube;
    const index = isDim
      ? qDimensionInfo.findIndex((dimensionInfo) => dimensionInfo.qFallbackTitle === label)
      : qMeasureInfo.findIndex((measureInfo) => measureInfo.qFallbackTitle === label);
    const idx = isDim ? index : index + qDimensionInfo.length;

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
      const { qReverseSort } = isDim
        ? qDimensionInfo.filter((dimensionInfo) => dimensionInfo.qFallbackTitle === label)[0]
        : qMeasureInfo.filter((measureInfo) => measureInfo.qFallbackTitle === label)[0];
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
