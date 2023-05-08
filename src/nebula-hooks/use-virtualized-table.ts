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
} from '../types';
import useInitialDataPages from './virtualized-table/use-initial-data-pages';
import usePageInfo from './virtualized-table/use-page-info';

interface UseVirtualizedTable {
  app?: EngineAPI.IApp;
  selectionsAPI?: ExtendedSelectionAPI;
  layout: TableLayout;
  model?: EngineAPI.IGenericObject;
  translator: ExtendedTranslator;
  constraints: stardust.Constraints;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  rect: stardust.Rect;
  rootElement: HTMLElement;
  embed: stardust.Embed;
  changeSortOrder?: ChangeSortOrder;
  reactRoot: Root;
  applyColumnWidths: ApplyColumnWidths;
  isFontLoaded: boolean;
}

const useVirtualizedTable = ({
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
}: UseVirtualizedTable) => {
  const shouldRender = layout.usePagination === false;
  const tableData = useMemo(() => getVirtualScrollTableData(layout, constraints), [layout, constraints]);
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
        constraints,
        selectionsAPI,
        rootElement,
        embed,
        changeSortOrder,
        tableData,
        applyColumnWidths,
        setPage,
        pageInfo,
        initialDataPages,
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
    constraints,
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
