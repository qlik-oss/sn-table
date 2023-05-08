import { useMemo } from '@nebula.js/stardust';
import createLayoutService from '../../services/layout-service';
import { TableLayout, LayoutService } from '../../types';

const useLayoutService = (layout: TableLayout): LayoutService => useMemo(() => createLayoutService(layout), [layout]);

export default useLayoutService;
