/* eslint-disable react-hooks/exhaustive-deps */
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
  usePromise,
  useKeyboard,
  useRect,
  useApp,
} from '@nebula.js/stardust';

import properties from './object-properties';
import data from './data';
import ext from './ext';
import manageData from './handle-data';
import { render, teardown } from './table/Root';
import useReactRoot from './nebula-hooks/use-react-root';
import useAnnounceAndTranslations from './nebula-hooks/use-announce-and-translations';
import useSorting from './nebula-hooks/use-sorting';
import useExtendedTheme from './nebula-hooks/use-extended-theme';

const initialPageInfo = {
  page: 0,
  rowsPerPage: 100,
  rowsPerPageOptions: [10, 25, 100],
};
const nothing = async () => {};
const renderWithCarbon = ({ env, rootElement, model, theme, selectionsAPI, app, rect, layout, changeSortOrder }) => {
  if (env.carbon && changeSortOrder && theme) {
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
      const reactRoot = useReactRoot(rootElement);
      const layout = useStaleLayout();
      const { direction, footerContainer } = useOptions();
      const app = useApp();
      const model = useModel();
      const constraints = useConstraints();
      const translator = useTranslator();
      const selectionsAPI = useSelections();
      const keyboard = useKeyboard();
      const rect = useRect();
      const theme = useExtendedTheme(rootElement);
      const announce = useAnnounceAndTranslations(rootElement, translator);
      const changeSortOrder = useSorting(model);

      const [pageInfo, setPageInfo] = useState(initialPageInfo);
      const [tableData] = usePromise(() => {
        return env.carbon ? nothing() : manageData(model, layout, pageInfo, setPageInfo);
      }, [layout, pageInfo]);

      useEffect(() => {
        if (!env.carbon && layout && tableData && announce && changeSortOrder && theme) {
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
            theme,
            changeSortOrder,
            keyboard,
            rect,
            footerContainer,
            announce,
          });
        }
      }, [reactRoot, tableData, constraints, direction, theme, keyboard.active, rect.width, announce, changeSortOrder]);

      // this is the one we want to use for carbon
      useEffect(() => {
        renderWithCarbon({ env, rootElement, model, theme, selectionsAPI, app, rect, layout });
      }, [layout, model, theme, translator.language(), app, changeSortOrder]);

      useEffect(
        () => () => {
          reactRoot && teardown(reactRoot);
        },
        [reactRoot]
      );
    },
    // Extension definition
    ext: ext(env),
  };
}
