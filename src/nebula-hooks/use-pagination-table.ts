import { stardust, useEffect, useOptions, usePromise, useState } from '@nebula.js/stardust';
import { Root } from 'react-dom/client';
import manageData from '../handle-data';
import { renderPaginationTable } from '../table/Root';
import {
  ExtendedSelectionAPI,
  TableLayout,
  ChangeSortOrder,
  ExtendedTranslator,
  ExtendedTheme,
  UseOptions,
  Galaxy,
  ApplyColumnWidths,
  ViewService,
} from '../types';
import useAnnounceAndTranslations from './use-announce-and-translations';

interface UsePaginationTable {
  env: Galaxy;
  selectionsAPI: ExtendedSelectionAPI | undefined;
  rootElement: HTMLElement;
  layout: TableLayout;
  changeSortOrder: ChangeSortOrder | undefined;
  rect: stardust.Rect;
  constraints: stardust.Constraints;
  translator: ExtendedTranslator;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  model: EngineAPI.IGenericObject | undefined;
  app: EngineAPI.IApp | undefined;
  embed: stardust.Embed;
  reactRoot: Root;
  applyColumnWidths: ApplyColumnWidths;
  isFontLoaded: boolean;
  viewService: ViewService;
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
  embed,
  reactRoot,
  applyColumnWidths,
  isFontLoaded,
  viewService,
}: UsePaginationTable) => {
  const { viewState, direction, footerContainer } = useOptions() as UseOptions;
  const isPrinting = layout.snapshotData || viewState?.visibleHeight !== undefined;
  const shouldRender = !env.carbon && (layout.usePagination !== false || isPrinting);
  const announce = useAnnounceAndTranslations(rootElement, translator);
  const tmpPageInfo = isPrinting
    ? {
        page: viewService.page || initialPageInfo.page,
        rowsPerPage: viewService.rowsPerPage || initialPageInfo.rowsPerPage,
        rowsPerPageOptions: initialPageInfo.rowsPerPageOptions,
      }
    : initialPageInfo;
  const [pageInfo, setPageInfo] = useState(tmpPageInfo);
  const [tableData] = usePromise(async () => {
    if (shouldRender) {
      return manageData(model as EngineAPI.IGenericObject, layout, pageInfo, setPageInfo, viewService);
    }

    return null;
  }, [layout, pageInfo, model, constraints, shouldRender]);

  useEffect(() => {
    const isReadyToRender = !!(
      shouldRender &&
      reactRoot &&
      model &&
      (layout.snapshotData || app) &&
      layout &&
      tableData &&
      changeSortOrder &&
      theme &&
      selectionsAPI &&
      isFontLoaded &&
      embed
    );

    if (!isReadyToRender) return;

    renderPaginationTable(
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
        embed,
        applyColumnWidths,
        viewService,
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
    isFontLoaded,
  ]);
};

export default usePaginationTable;
