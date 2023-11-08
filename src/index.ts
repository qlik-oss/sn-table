/* eslint-disable react-hooks/rules-of-hooks */
import {
  useApp,
  useElement,
  useEmbed,
  useInteractionState,
  useKeyboard,
  useModel,
  useOptions,
  useRect,
  useSelections,
  useStaleLayout,
  useTranslator,
} from "@nebula.js/stardust";
import { useExtendedTheme } from "@qlik/nebula-table-utils/lib/hooks";
import ext from "./ext";
import extendContextMenu from "./extend-context-menu";
import useApplyColumnWidths from "./nebula-hooks/use-apply-column-widths";
import usePaginationTable from "./nebula-hooks/use-pagination-table";
import useReactRoot from "./nebula-hooks/use-react-root";
import useSorting from "./nebula-hooks/use-sorting";
import useVirtualizedTable from "./nebula-hooks/use-virtualized-table";
import useWaitForFonts from "./nebula-hooks/use-wait-for-fonts";
import data from "./qae/data";
import properties from "./qae/object-properties";
import useSnapshot from "./table/hooks/use-snapshot";
import useViewService from "./table/hooks/use-view-service";
import { ExtendedSelectionAPI, Galaxy, TableLayout, UseOptions } from "./types";
import { chartBackgroundResolver, objectBackgroundResolver } from "./utils/theme-background-resolver";

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
      const translator = useTranslator();
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
      const isNewHeadCellMenuEnabled = env.flags.isEnabled("HEAD_CELL_MENU_TEST_FLAG");
      const changeSortOrder = useSorting(layout.qHyperCube, model, isNewHeadCellMenuEnabled); // undefined when taking snapshot
      const applyColumnWidths = useApplyColumnWidths(layout.qHyperCube, model);
      const isFontLoaded = useWaitForFonts(theme, layout);

      extendContextMenu();

      if (env.flags.isEnabled("PS_20907_TABLE_DOWNLOAD")) {
        useSnapshot({ layout, viewService, model, rootElement, contentRect });
      }

      useVirtualizedTable({
        isNewHeadCellMenuEnabled,
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
        isNewHeadCellMenuEnabled,
        env, // TODO: this is not used!
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
