/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  useElement,
  useStaleLayout,
  useEffect,
  useOptions,
  useModel,
  useState,
  useConstraints,
  useTranslator,
  useSelections,
  usePromise,
  useKeyboard,
  useRect,
  useApp,
  useEmbed,
} from '@nebula.js/stardust';

import properties from './qae/object-properties';
import data from './qae/data';
import ext from './ext';
import manageData from './handle-data';
import { render, renderVirtualizedTable, teardown } from './table/Root';
import useReactRoot from './nebula-hooks/use-react-root';
import useAnnounceAndTranslations from './nebula-hooks/use-announce-and-translations';
import useSorting from './nebula-hooks/use-sorting';
import useExtendedTheme from './nebula-hooks/use-extended-theme';
import useContextMenu from './nebula-hooks/use-context-menu';
import useColumnResize from './nebula-hooks/use-column-resize';
import {
  RenderWithCarbonArguments,
  Galaxy,
  TableLayout,
  UseOptions,
  ExtendedTranslator,
  ExtendedSelectionAPI,
} from './types';
import { RenderProps } from './table/types';

const initialPageInfo = {
  page: 0,
  rowsPerPage: 100,
  rowsPerPageOptions: [10, 25, 100],
};
const nothing = async () => undefined;
const renderWithCarbon = ({
  env,
  rootElement,
  model,
  theme,
  selectionsAPI,
  app,
  rect,
  layout,
  changeSortOrder,
}: RenderWithCarbonArguments) => {
  if (env.carbon && changeSortOrder && theme && selectionsAPI) {
    render({ rootElement, layout, model, manageData, theme, selectionsAPI, changeSortOrder, app, rect } as RenderProps); // Does not pass in all required props so force type check to pass
  }
};

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
      const { direction, footerContainer } = useOptions() as UseOptions;
      const app = useApp();
      const model = useModel();
      const constraints = useConstraints();
      const translator = useTranslator() as ExtendedTranslator;
      const selectionsAPI = useSelections() as ExtendedSelectionAPI;
      const keyboard = useKeyboard();
      const rect = useRect();
      const theme = useExtendedTheme(rootElement);
      const embed = useEmbed();
      const announce = useAnnounceAndTranslations(rootElement, translator);
      const changeSortOrder = useSorting(model, layout.qHyperCube);
      const updateColumnWidth = useColumnResize(model, layout.qHyperCube);

      const [pageInfo, setPageInfo] = useState(initialPageInfo);
      const shouldRenderVirtualizedTable = areBasicFeaturesEnabled && layout.presentation?.usePagination === false;
      const [tableData] = usePromise(
        async () =>
          (env.carbon && !model?.getHyperCubeData) || shouldRenderVirtualizedTable
            ? nothing()
            : manageData(model as EngineAPI.IGenericObject, layout, pageInfo, setPageInfo),
        [layout, pageInfo, model]
      );

      useContextMenu(areBasicFeaturesEnabled);

      useEffect(() => {
        if (!shouldRenderVirtualizedTable || !model || !changeSortOrder) return;

        renderVirtualizedTable(
          {
            layout,
            model,
            rect,
            theme,
            keyboard,
            translator,
            constraints,
            selectionsAPI,
            rootElement,
            embed,
            changeSortOrder,
          },
          reactRoot
        );
      }, [layout, model, rect, theme, keyboard, translator, constraints, selectionsAPI, changeSortOrder]);

      useEffect(() => {
        const isReadyToRender =
          !env.carbon && reactRoot && layout && tableData && changeSortOrder && theme && selectionsAPI && embed;
        isReadyToRender &&
          render(
            {
              rootElement,
              layout,
              tableData,
              direction,
              pageInfo,
              setPageInfo,
              constraints,
              translator,
              selectionsAPI,
              theme,
              changeSortOrder,
              keyboard,
              rect,
              footerContainer,
              announce,
              areBasicFeaturesEnabled,
              embed,
              updateColumnWidth,
            },
            reactRoot
          );
      }, [
        reactRoot,
        tableData,
        constraints,
        direction,
        selectionsAPI?.isModal(),
        theme,
        keyboard.active,
        rect.width,
        announce,
        changeSortOrder,
        updateColumnWidth,
      ]);

      // this is the one we want to use for carbon
      useEffect(() => {
        renderWithCarbon({
          env,
          rootElement,
          model,
          theme,
          selectionsAPI,
          app,
          rect,
          layout,
          changeSortOrder,
        });
      }, [layout, model, selectionsAPI?.isModal(), theme, translator.language(), app, changeSortOrder]);

      useEffect(
        () => () => {
          reactRoot && teardown(reactRoot);
        },
        [reactRoot]
      );
    },
  };
}
