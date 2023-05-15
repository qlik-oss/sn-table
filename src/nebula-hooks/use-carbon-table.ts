/* eslint-disable react-hooks/exhaustive-deps */
import { stardust, useEffect } from '@nebula.js/stardust';
import { renderPaginationTable } from '../table/Root';
import { RenderProps } from '../table/types';
import {
  ChangeSortOrder,
  ExtendedSelectionAPI,
  ExtendedTheme,
  ExtendedTranslator,
  Galaxy,
  TableLayout,
} from '../types';

interface UseCarbonTable {
  env: Galaxy;
  rootElement: HTMLElement;
  model?: EngineAPI.IGenericObject;
  theme: ExtendedTheme;
  selectionsAPI?: ExtendedSelectionAPI;
  app?: EngineAPI.IApp;
  rect: stardust.Rect;
  layout: TableLayout;
  changeSortOrder?: ChangeSortOrder;
  translator: ExtendedTranslator;
}

const useCarbonTable = ({
  env,
  rootElement,
  model,
  theme,
  selectionsAPI,
  app,
  rect,
  layout,
  changeSortOrder,
  translator,
}: UseCarbonTable) => {
  useEffect(() => {
    if (env.carbon && changeSortOrder && theme && selectionsAPI) {
      renderPaginationTable({
        env,
        rootElement,
        model,
        theme,
        selectionsAPI,
        app,
        rect,
        layout,
        changeSortOrder,
      } as unknown as RenderProps); // Does not pass in all required props so force type check to pass
    }
  }, [layout, model, selectionsAPI?.isModal(), theme, translator.language(), app, changeSortOrder]);
};

export default useCarbonTable;
