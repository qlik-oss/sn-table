import { stardust, useEffect, useMemo } from '@nebula.js/stardust';
import { Root } from 'react-dom/client';
import { renderVirtualizedTable } from '../table/Root';
import getVirtualScrollTableData from '../table/virtualized-table/utils/get-table-data';
import {
  ChangeSortOrder,
  ExtendedSelectionAPI,
  ExtendedTheme,
  ExtendedTranslator,
  TableData,
  TableLayout,
} from '../types';

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
}: UseVirtualizedTable) => {
  const shouldRender = areBasicFeaturesEnabled && layout.presentation?.usePagination === false;
  const tableData = useMemo(() => {
    if (shouldRender) {
      return getVirtualScrollTableData(layout, constraints);
    }

    return {} as TableData;
  }, [layout, constraints, shouldRender]);

  useEffect(() => {
    if (!shouldRender || !model || !changeSortOrder) return;

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
  ]);
};

export default useVirtualizedTable;
