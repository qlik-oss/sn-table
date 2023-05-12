import { TableLayout, LayoutService } from '../types';

const MAX_COLUMN_COUNT = 1000;

const createLayoutService = (layout: TableLayout): LayoutService => {
  const { snapshotData } = layout;
  const isSnapshot = !!snapshotData;
  const snapshotDataPage = isSnapshot ? layout.qHyperCube.qDataPages?.[0]?.qArea : undefined;
  const size = {
    x: snapshotDataPage?.qWidth ?? Math.min(layout.qHyperCube.qSize.qcx, MAX_COLUMN_COUNT),
    y: snapshotDataPage?.qHeight ?? layout.qHyperCube.qSize.qcy,
  };

  return {
    layout,
    size,
    isSnapshot,
  };
};

export default createLayoutService;
