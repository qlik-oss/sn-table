/* eslint-disable react-hooks/rules-of-hooks */
import {
  useElement,
  useStaleLayout,
  useModel,
  useConstraints,
  useTranslator,
  useSelections,
  useKeyboard,
  useRect,
  useApp,
  useEmbed,
} from '@nebula.js/stardust';

import properties from './qae/object-properties';
import data from './qae/data';
import ext from './ext';
import useReactRoot from './nebula-hooks/use-react-root';
import useSorting from './nebula-hooks/use-sorting';
import useExtendedTheme from './nebula-hooks/use-extended-theme';
import { Galaxy, TableLayout, ExtendedTranslator, ExtendedSelectionAPI } from './types';
import useVirtualizedTable from './nebula-hooks/use-virtualized-table';
import usePaginationTable from './nebula-hooks/use-pagination-table';
import useCarbonTable from './nebula-hooks/use-carbon-table';
import useApplyColumnWidths from './nebula-hooks/use-apply-column-widths';
import useWaitForFonts from './nebula-hooks/use-wait-for-fonts';
import extendContextMenu from './extend-context-menu';
import useViewService from './table/hooks/use-view-service';
import useLayoutService from './table/hooks/use-layout-service';
import useSnapshot from './table/hooks/use-snapshot';

export default function supernova(env: Galaxy) {
  return {
    qae: {
      properties: { initial: properties },
      data: data(),
    },
    ext: ext(env),
    component() {
      const rootElement = useElement();
      const reactRoot = useReactRoot(rootElement);
      const layout = useStaleLayout() as TableLayout;
      const app = useApp();
      const model = useModel();
      const constraints = useConstraints();
      const translator = useTranslator() as ExtendedTranslator;
      const selectionsAPI = useSelections() as ExtendedSelectionAPI;
      const keyboard = useKeyboard();
      let rect = useRect();
      const viewService = useViewService(layout);
      const layoutService = useLayoutService(layout);
      const embed = useEmbed();
      const theme = useExtendedTheme(rootElement);
      const changeSortOrder = useSorting(model, layout.qHyperCube);
      const applyColumnWidths = useApplyColumnWidths(model, layout.qHyperCube);
      const isFontLoaded = useWaitForFonts(theme, layout);

      extendContextMenu();

      useVirtualizedTable({
        app,
        layout,
        model,
        rect,
        theme,
        keyboard,
        translator,
        constraints,
        selectionsAPI,
        changeSortOrder,
        rootElement,
        embed,
        reactRoot,
        applyColumnWidths,
        isFontLoaded,
      });

      usePaginationTable({
        env,
        app,
        model,
        rootElement,
        layout,
        constraints,
        translator,
        selectionsAPI,
        theme,
        changeSortOrder,
        keyboard,
        rect,
        embed,
        reactRoot,
        applyColumnWidths,
        isFontLoaded,
        viewService,
        layoutService,
      });

      useCarbonTable({
        env,
        rootElement,
        model,
        theme,
        selectionsAPI,
        app,
        rect,
        layout,
        changeSortOrder,
        translator,
      });
      rect = useSnapshot({ layoutService, viewService, rect, model });
    },
  };
}
