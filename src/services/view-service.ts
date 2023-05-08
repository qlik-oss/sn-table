import type { ViewService } from '../types';

const createViewService = (): ViewService => ({
  gridColumnStartIndex: 0,
  gridRowStartIndex: 0,
  gridWidth: 0,
  gridHeight: 0,
});

export default createViewService;
