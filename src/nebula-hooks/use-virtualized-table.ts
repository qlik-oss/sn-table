import { stardust, useEffect, useMemo } from '@nebula.js/stardust';
import { Root } from 'react-dom/client';
import { renderVirtualizedTable } from '../table/Root';
import getVirtualScrollTableData from '../table/virtualized-table/utils/get-table-data';
import { ChangeSortOrder, ExtendedSelectionAPI, ExtendedTheme, ExtendedTranslator, TableLayout } from '../types';

interface UseVirtualizedTable {
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
  shouldRenderVirtualizedTable: boolean;
  reactRoot: Root;
}

const useVirtualizedTable = ({
  layout,
  model,
  rect,
  theme,
  keyboard,
  translator,
  constraints,
  selectionsAPI,
  changeSortOrder,
  shouldRenderVirtualizedTable,
  rootElement,
  embed,
  reactRoot,
}: UseVirtualizedTable) => {
  const tableData = useMemo(() => getVirtualScrollTableData(layout, constraints), [layout, constraints]);

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
        tableData,
      },
      reactRoot
    );
  }, [
    layout,
    model,
    rect,
    theme.name(),
    keyboard.active,
    translator,
    constraints,
    selectionsAPI,
    changeSortOrder,
    shouldRenderVirtualizedTable,
    rootElement,
    embed,
    reactRoot,
    tableData,
  ]);
};

export default useVirtualizedTable;
