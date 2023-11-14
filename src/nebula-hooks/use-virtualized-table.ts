/* eslint-disable react-hooks/exhaustive-deps */
import { stardust, useEffect, useMemo } from "@nebula.js/stardust";
import type { ExtendedTheme } from "@qlik/nebula-table-utils/lib/hooks/use-extended-theme/types";
import { Root } from "react-dom/client";
import renderAsPagination from "../render-as-pagination";
import { renderVirtualizedTable } from "../table/Root";
import getVirtualScrollTableData from "../table/virtualized-table/utils/get-table-data";
import { ApplyColumnWidths, ChangeSortOrder, ExtendedSelectionAPI, TableLayout, ViewService } from "../types";
import useInitialDataPages from "./virtualized-table/use-initial-data-pages";
import usePageInfo from "./virtualized-table/use-page-info";

interface UseVirtualizedTable {
  app: EngineAPI.IApp | undefined;
  selectionsAPI: ExtendedSelectionAPI | undefined;
  layout: TableLayout;
  model: EngineAPI.IGenericObject | undefined;
  translator: stardust.Translator;
  interactions: stardust.Interactions;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  rect: stardust.Rect;
  rootElement: HTMLElement;
  embed: stardust.Embed;
  changeSortOrder: ChangeSortOrder | undefined;
  reactRoot: Root;
  applyColumnWidths: ApplyColumnWidths;
  isFontLoaded: boolean;
  viewService: ViewService;
  isNewHeadCellMenuEnabled: boolean;
}

const useVirtualizedTable = ({
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
  isNewHeadCellMenuEnabled,
}: UseVirtualizedTable) => {
  const shouldRender = !renderAsPagination(layout, viewService);
  const tableData = useMemo(
    () => getVirtualScrollTableData(layout, interactions, viewService),
    [layout, interactions, viewService]
  );
  const { pageInfo, setPage } = usePageInfo(layout, shouldRender);
  const { initialDataPages, isLoading } = useInitialDataPages({ model, layout, page: pageInfo.page, shouldRender });

  useEffect(() => {
    if (!shouldRender || !model || !changeSortOrder || !initialDataPages || isLoading || !isFontLoaded) return;

    renderVirtualizedTable(
      {
        app,
        layout,
        model,
        rect,
        theme,
        keyboard,
        translator,
        interactions,
        selectionsAPI,
        rootElement,
        embed,
        changeSortOrder,
        tableData,
        applyColumnWidths,
        setPage,
        pageInfo,
        initialDataPages,
        viewService,
        isNewHeadCellMenuEnabled,
      },
      reactRoot
    );
  }, [
    app,
    layout,
    model,
    rect,
    theme.name(),
    keyboard.active,
    translator,
    interactions,
    selectionsAPI,
    changeSortOrder,
    shouldRender,
    rootElement,
    embed,
    reactRoot,
    tableData,
    applyColumnWidths,
    setPage,
    pageInfo,
    isLoading,
    initialDataPages,
    isFontLoaded,
    isNewHeadCellMenuEnabled,
  ]);
};

export default useVirtualizedTable;
