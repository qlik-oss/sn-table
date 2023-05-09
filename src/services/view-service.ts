import type { TableLayout, ViewService } from '../types';

const createViewService = (layout: TableLayout): ViewService => {
  const { snapshotData } = layout;
  const isSnapshot = !!snapshotData;

  return {
    qLeft: isSnapshot ? snapshotData?.content?.qLeft || 0 : 0,
    qTop: isSnapshot ? snapshotData?.content?.qTop || 0 : 0,
    qWidth: isSnapshot ? snapshotData?.content?.qWidth || 0 : 0,
    qHeight: isSnapshot ? snapshotData?.content?.qHeight || 0 : 0,
    scrollLeft: isSnapshot ? snapshotData?.content?.scrollLeft || 0 : 0,
    scrollTop: isSnapshot ? snapshotData?.content?.scrollTop || 0 : 0,
  };
};

export default createViewService;
