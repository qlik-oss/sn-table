import { useMemo } from '@nebula.js/stardust';
import createViewService from '../../services/view-service';
import type { TableLayout, ViewService } from '../../types';

const useViewService = (layout: TableLayout): ViewService => useMemo(() => createViewService(layout), [layout]);

export default useViewService;
