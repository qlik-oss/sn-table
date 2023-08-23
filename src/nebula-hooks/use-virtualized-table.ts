import { stardust, useEffect, useMemo } from '@nebula.js/stardust';
import { Root } from 'react-dom/client';
import { renderVirtualizedTable } from '../table/Root';
import getVirtualScrollTableData from '../table/virtualized-table/utils/get-table-data';
import {
  ApplyColumnWidths,
  ChangeSortOrder,
  ExtendedSelectionAPI,
  ExtendedTheme,
  ExtendedTranslator,
  TableLayout,
  ViewService,
} from '../types';
import useInitialDataPages from './virtualized-table/use-initial-data-pages';
import usePageInfo from './virtualized-table/use-page-info';

interface UseVirtualizedTable {
  app: EngineAPI.IApp | undefined;
  selectionsAPI: ExtendedSelectionAPI | undefined;
  layout: TableLayout;
  model: EngineAPI.IGenericObject | undefined;
  translator: ExtendedTranslator;
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
}: UseVirtualizedTable) => {
  const shouldRender = layout.usePagination === false;
  const tableData = useMemo(() => getVirtualScrollTableData(layout, interactions), [layout, interactions]);
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
  ]);
};

export default useVirtualizedTable;
