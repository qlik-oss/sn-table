/* eslint-disable react-hooks/rules-of-hooks */
import {
  useElement,
  useStaleLayout,
  useModel,
  useTranslator,
  useSelections,
  useKeyboard,
  useRect,
  useApp,
  useEmbed,
  useOptions,
  useInteractionState,
  stardust,
} from '@nebula.js/stardust';
import { useExtendedTheme } from '@qlik/nebula-table-utils/lib/hooks';
import properties from './qae/object-properties';
import data from './qae/data';
import ext from './ext';
import useReactRoot from './nebula-hooks/use-react-root';
import useSorting from './nebula-hooks/use-sorting';
import { Galaxy, TableLayout, ExtendedTranslator, ExtendedSelectionAPI, UseOptions } from './types';
import useVirtualizedTable from './nebula-hooks/use-virtualized-table';
import usePaginationTable from './nebula-hooks/use-pagination-table';
import useApplyColumnWidths from './nebula-hooks/use-apply-column-widths';
import useWaitForFonts from './nebula-hooks/use-wait-for-fonts';
import extendContextMenu from './extend-context-menu';
import useViewService from './table/hooks/use-view-service';
import useSnapshot from './table/hooks/use-snapshot';

const chartBackgroundResolver = (theme: stardust.Theme) =>
  theme.getStyle('', '', 'object.straightTableV2.backgroundColor');
const objectBackgroundResolver = (theme: stardust.Theme) =>
  theme.getStyle('object', 'straightTableV2', 'backgroundColor');

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
      const app = useApp(); // undefined when taking snapshot
      const model = useModel(); // undefined when taking snapshot
      const interactions = useInteractionState();
      const translator = useTranslator() as ExtendedTranslator;
      const selectionsAPI = useSelections() as ExtendedSelectionAPI | undefined; // undefined when taking snapshot
      const keyboard = useKeyboard();
      const { freeResize } = useOptions() as UseOptions;
      const contentRect = useRect();
      const rect =
        layout?.snapshotData?.content && !freeResize
          ? { ...contentRect, ...layout.snapshotData.content.size }
          : contentRect;
      const viewService = useViewService(layout);
      const embed = useEmbed();
      const theme = useExtendedTheme(rootElement, chartBackgroundResolver, objectBackgroundResolver);
      const changeSortOrder = useSorting(layout.qHyperCube, model); // undefined when taking snapshot
      const applyColumnWidths = useApplyColumnWidths(layout.qHyperCube, model);
      const isFontLoaded = useWaitForFonts(theme, layout);

      extendContextMenu();

      if (env.flags.isEnabled('PS_20907_TABLE_DOWNLOAD')) {
        useSnapshot({ layout, viewService, model, rootElement, contentRect });
      }

      useVirtualizedTable({
        app,
        layout,
        model,
        rect,
        theme,
        keyboard,
        translator,
        interactions,
        selectionsAPI,
        changeSortOrder,
        rootElement,
        embed,
        reactRoot,
        applyColumnWidths,
        isFontLoaded,
        viewService,
      });

      usePaginationTable({
        env,
        app,
        model,
        rootElement,
        layout,
        interactions,
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
      });
    },
  };
}
