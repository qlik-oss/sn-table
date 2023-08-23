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
import isPrinting from '../is-printing';

interface UsePaginationTable {
  env: Galaxy;
  selectionsAPI: ExtendedSelectionAPI | undefined;
  rootElement: HTMLElement;
  layout: TableLayout;
  changeSortOrder: ChangeSortOrder | undefined;
  rect: stardust.Rect;
  interactions: stardust.Interactions;
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

export const initialPageInfo = {
  page: 0,
  rowsPerPage: 100,
  rowsPerPageOptions: [10, 25, 100],
};

const usePaginationTable = ({
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
}: UsePaginationTable) => {
  const { direction, footerContainer } = useOptions() as UseOptions;
  const isPrintingMode = isPrinting(layout, viewService);
  const shouldRender = layout.usePagination !== false;
  const announce = useAnnounceAndTranslations(rootElement, translator);
  const tmpPageInfo = isPrintingMode
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
  }, [layout, pageInfo, model, interactions, shouldRender]);

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
        interactions,
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
    interactions,
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
