import { useMemo } from '@nebula.js/stardust';
import type { ViewService } from '../../types';

const createViewService = (): ViewService => {
  return {
    qLeft: 0,
    qTop: 0,
    qWidth: 0,
    qHeight: 0,
    scrollLeft: 0,
  };
};

const useViewService = (): ViewService => useMemo(() => createViewService(), []);

export default useViewService;
