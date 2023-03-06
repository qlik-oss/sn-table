import { stardust, useEffect } from '@nebula.js/stardust';
import { Root } from 'react-dom/client';
import { renderVirtualizedTable } from '../table/Root';
import {
  ApplyColumnWidths,
  ChangeSortOrder,
  ExtendedSelectionAPI,
  ExtendedTheme,
  ExtendedTranslator,
  TableLayout,
} from '../types';
import usePageInfo from './virtualized-table/use-page-info';
import useTableData from './virtualized-table/use-table-data';

interface UseVirtualizedTable {
  app: EngineAPI.IApp | undefined;
  selectionsAPI: ExtendedSelectionAPI;
  layout: TableLayout;
  model: EngineAPI.IGenericObject | undefined;
  translator: ExtendedTranslator;
  constraints: stardust.Constraints;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  rect: stardust.Rect;
  rootElement: HTMLElement;
  embed: stardust.Embed;
  changeSortOrder: ChangeSortOrder | undefined;
  areBasicFeaturesEnabled: boolean;
  reactRoot: Root;
  applyColumnWidths: ApplyColumnWidths;
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
  areBasicFeaturesEnabled,
  rootElement,
  embed,
  reactRoot,
  applyColumnWidths,
}: UseVirtualizedTable) => {
  const shouldRender = areBasicFeaturesEnabled && layout.presentation?.usePagination === false;
  const { pageInfo, setPage } = usePageInfo(layout, shouldRender);
  const { tableData, isLoading } = useTableData({ model, layout, constraints, shouldRender, pageInfo });

  useEffect(() => {
    if (!shouldRender || !model || !changeSortOrder || !tableData || isLoading) return;

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
  ]);
};

export default useVirtualizedTable;
