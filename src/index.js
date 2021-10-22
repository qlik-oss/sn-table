import {
  useElement,
  useStaleLayout,
  useEffect,
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
import locale from '../locale/src';
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
      const model = useModel();
      const constraints = useConstraints();
      const translator = useTranslator();
      const selectionsAPI = useSelections();
      const muiParameters = muiSetup();
      const theme = useTheme();
      const keyboard = useKeyboard();
      const rect = useRect();
      const [pageInfo, setPageInfo] = useState(() => ({ page: 0, rowsPerPage: 100 }));
      const [tableData] = usePromise(() => manageData(model, layout, pageInfo), [layout, pageInfo]);

      useEffect(() => {
        if (layout && tableData) {
          if (!tableData.rows.length && pageInfo.page > 0) {
            // If rows is empty and we are not on the first page, go back to the first page, thus fetching new data
            setPageInfo({ ...pageInfo, page: 0 });
          } else {
            locale(translator);
            const changeSortOrder = sortingFactory(model, tableData.columnOrder);
            render(rootElement, {
              rootElement,
              layout,
              tableData,
              pageInfo,
              setPageInfo,
              constraints,
              translator,
              selectionsAPI,
              muiParameters,
              theme,
              changeSortOrder,
              keyboard,
              rect,
            });
          }
        }
      }, [
        tableData,
        constraints,
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
