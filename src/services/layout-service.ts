import { TableLayout, LayoutService } from '../types';

const MAX_COLUMN_COUNT = 1000;

const createLayoutService = (layout: TableLayout): LayoutService => {
  const { snapshotData } = layout;
  const isSnapshot = !!snapshotData;
  const snapshotDataPage = snapshotData?.content?.qDataPages?.[0]?.qArea ?? { qWidth: 0, qHeight: 0 };
  const size = {
    x: isSnapshot ? snapshotDataPage.qWidth : Math.min(layout.qHyperCube.qSize.qcx, MAX_COLUMN_COUNT),
    y: isSnapshot ? snapshotDataPage.qHeight : layout.qHyperCube.qSize.qcy,
  };

  return {
    layout,
    size,
    isSnapshot,
  };
};

export default createLayoutService;
