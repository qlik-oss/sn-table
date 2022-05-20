/* eslint-disable react-hooks/rules-of-hooks */
import {
  useElement,
  useStaleLayout,
  useEffect,
  useOptions,
  useModel,
  useState,
  useConstraints,
  useTranslator,
  useSelections,
  useTheme,
  usePromise,
  useKeyboard,
  useRect,
  useApp,
} from '@nebula.js/stardust';
import { createRoot } from 'react-dom/client';

import registerLocale from './locale/src';
import properties from './object-properties';
import data from './data';
import ext from './ext';
import manageData from './handle-data';
import sortingFactory from './sorting-factory';
import { mount, render, teardown } from './table/Root';
import muiSetup from './mui-setup';
import tableThemeColors from './table-theme-colors';

const initialPageInfo = {
  page: 0,
  rowsPerPage: 100,
  rowsPerPageOptions: [10, 25, 100],
};
const nothing = async () => {};
const renderWithCarbon = ({ env, translator, rootElement, model, theme, selectionsAPI, app, rect, layout }) => {
  if (env.carbon) {
    registerLocale(translator);
    const changeSortOrder = sortingFactory(model);
    render(rootElement, { layout, model, manageData, theme, selectionsAPI, changeSortOrder, app, rect });
  }
};

export default function supernova(env) {
  return {
    qae: {
      properties: {
        initial: properties,
      },
      data: data(env),
    },
    component() {
      const rootElement = useElement();
      const [reactRoot, setReactRoot] = useState();
      const layout = useStaleLayout();
      const { direction, footerContainer } = useOptions();
      const app = useApp();
      const model = useModel();
      const constraints = useConstraints();
      const translator = useTranslator();
      const selectionsAPI = useSelections();
      const theme = useTheme();
      theme.table = tableThemeColors(theme);
      const muiTheme = muiSetup(direction);
      const keyboard = useKeyboard();
      const rect = useRect();
      const [pageInfo, setPageInfo] = useState(() => initialPageInfo);
      const [tableData] = usePromise(() => {
        return env.carbon ? nothing() : manageData(model, layout, pageInfo, setPageInfo);
      }, [layout, pageInfo]);

      useEffect(() => {
        if (rootElement) {
          setReactRoot(createRoot(rootElement));
          mount(rootElement);
        }
      }, [rootElement]);

      useEffect(() => {
        if (layout && tableData && !env.carbon) {
          registerLocale(translator);
          const changeSortOrder = sortingFactory(model);
          render(reactRoot, {
            rootElement,
            layout,
            tableData,
            direction,
            pageInfo,
            setPageInfo,
            constraints,
            translator,
            selectionsAPI,
            muiTheme,
            theme,
            changeSortOrder,
            keyboard,
            rect,
            footerContainer,
          });
        }
      }, [
        reactRoot,
        tableData,
        constraints,
        direction,
        selectionsAPI.isModal(),
        theme.name(),
        theme.table.backgroundColor,
        keyboard.active,
        translator.language(),
        rect.width,
      ]);

      // this is the one we want to use for carbon
      useEffect(() => {
        renderWithCarbon({ env, translator, rootElement, model, theme, selectionsAPI, app, rect, layout });
      }, [layout, model, selectionsAPI.isModal(), theme.name(), manageData, translator.language(), app]);

      useEffect(
        () => () => {
          teardown();
        },
        []
      );
    },
    // Extension definition
    ext: ext(env),
  };
}
