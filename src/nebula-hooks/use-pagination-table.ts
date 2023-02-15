import { stardust, useEffect, useOptions, usePromise, useState } from '@nebula.js/stardust';
import { Root } from 'react-dom/client';
import manageData from '../handle-data';
import { render } from '../table/Root';
import {
  ExtendedSelectionAPI,
  TableLayout,
  ChangeSortOrder,
  ExtendedTranslator,
  ExtendedTheme,
  UseOptions,
  Galaxy,
} from '../types';
import useAnnounceAndTranslations from './use-announce-and-translations';
import useApplyColumnWidths from './use-apply-column-widths';

interface UsePaginationTable {
  env: Galaxy;
  selectionsAPI: ExtendedSelectionAPI;
  rootElement: HTMLElement;
  layout: TableLayout;
  changeSortOrder?: ChangeSortOrder;
  rect: stardust.Rect;
  constraints: stardust.Constraints;
  translator: ExtendedTranslator;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  model?: EngineAPI.IGenericObject;
  app?: EngineAPI.IApp;
  areBasicFeaturesEnabled?: boolean;
  embed?: stardust.Embed;
  reactRoot: Root;
}

const initialPageInfo = {
  page: 0,
  rowsPerPage: 100,
  rowsPerPageOptions: [10, 25, 100],
};

const usePaginationTable = ({
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
  areBasicFeaturesEnabled,
  embed,
  reactRoot,
}: UsePaginationTable) => {
  const shouldRender = !env.carbon && layout.presentation?.usePagination !== false;
  const { direction, footerContainer } = useOptions() as UseOptions;
  const announce = useAnnounceAndTranslations(rootElement, translator);
  const applyColumnWidths = useApplyColumnWidths(model, layout.qHyperCube);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [tableData] = usePromise(async () => {
    if (shouldRender) {
      return manageData(model as EngineAPI.IGenericObject, layout, pageInfo, setPageInfo);
    }

    return null;
  }, [layout, pageInfo, model, constraints, shouldRender]);

  useEffect(() => {
    const isReadyToRender =
      shouldRender &&
      reactRoot &&
      model &&
      app &&
      layout &&
      tableData &&
      changeSortOrder &&
      theme &&
      selectionsAPI &&
      embed;

    if (!isReadyToRender) return;

    render(
      {
        app,
        model,
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
        applyColumnWidths,
      },
      reactRoot
    );
  }, [
    app,
    model,
    reactRoot,
    tableData,
    constraints,
    direction,
    theme.name(),
    keyboard.active,
    announce,
    changeSortOrder,
    applyColumnWidths,
    shouldRender,
    layout,
    selectionsAPI,
    embed,
    rootElement,
    pageInfo,
    setPageInfo,
    translator,
    rect,
    footerContainer,
    areBasicFeaturesEnabled,
  ]);
};

export default usePaginationTable;
