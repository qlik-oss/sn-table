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
} from '@nebula.js/stardust';
import registerLocale from './locale/src';
import properties from './object-properties';
import data from './data';
import ext from './ext';
import manageData from './handle-data';
import sortingFactory from './sorting-factory';
import { render, teardown } from './table/Root';
import muiSetup from './mui-setup';

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
      const layout = useStaleLayout();
      const { direction } = useOptions();
      const model = useModel();
      const constraints = useConstraints();
      const translator = useTranslator();
      const selectionsAPI = useSelections();
      const tableTheme = muiSetup(direction);
      const theme = useTheme();
      const keyboard = useKeyboard();
      const rect = useRect();
      const [pageInfo, setPageInfo] = useState(() => ({
        page: 0,
        rowsPerPage: 100,
        rowsPerPageOptions: [10, 25, 100],
      }));
      const [tableData] = usePromise(() => manageData(model, layout, pageInfo, setPageInfo), [layout, pageInfo]);

      useEffect(() => {
        if (layout && tableData) {
          registerLocale(translator);
          const changeSortOrder = sortingFactory(model);
          render(rootElement, {
            rootElement,
            layout,
            tableData,
            direction,
            pageInfo,
            setPageInfo,
            constraints,
            translator,
            selectionsAPI,
            tableTheme,
            theme,
            changeSortOrder,
            keyboard,
            rect,
          });
        }
      }, [
        tableData,
        constraints,
        direction,
        selectionsAPI.isModal(),
        theme.name(),
        keyboard.active,
        translator.language(),
        rect.width,
      ]);

      useEffect(
        () => () => {
          teardown(rootElement);
        },
        []
      );
    },
    ext: ext(env),
  };
}
