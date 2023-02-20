/* eslint-disable react-hooks/rules-of-hooks */
import {
  useElement,
  useStaleLayout,
  useEffect,
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
import { teardown } from './table/Root';
import useReactRoot from './nebula-hooks/use-react-root';
import useSorting from './nebula-hooks/use-sorting';
import useExtendedTheme from './nebula-hooks/use-extended-theme';
import useContextMenu from './nebula-hooks/use-context-menu';
import { Galaxy, TableLayout, ExtendedTranslator, ExtendedSelectionAPI } from './types';
import useVirtualizedTable from './nebula-hooks/use-virtualized-table';
import usePaginationTable from './nebula-hooks/use-pagination-table';
import useCarbonTable from './nebula-hooks/use-carbon-table';
import useApplyColumnWidths from './nebula-hooks/use-apply-column-widths';

export default function supernova(env: Galaxy) {
  const areBasicFeaturesEnabled = env.flags.isEnabled('PS_18291_SN_TABLE_BASIC_FEATURES');
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
      if (layout)
        layout.presentation = {
          usePagination: false,
        };
      const app = useApp();
      const model = useModel();
      const constraints = useConstraints();
      const translator = useTranslator() as ExtendedTranslator;
      const selectionsAPI = useSelections() as ExtendedSelectionAPI;
      const keyboard = useKeyboard();
      const rect = useRect();
      const theme = useExtendedTheme(rootElement);
      const embed = useEmbed();
      const changeSortOrder = useSorting(model, layout.qHyperCube);
      const applyColumnWidths = useApplyColumnWidths(model, layout.qHyperCube);

      useContextMenu(areBasicFeaturesEnabled);

      useVirtualizedTable({
        areBasicFeaturesEnabled,
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
      });

      usePaginationTable({
        env,
        areBasicFeaturesEnabled,
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

      useEffect(
        () => () => {
          reactRoot && teardown(reactRoot);
        },
        [reactRoot]
      );
    },
  };
}
