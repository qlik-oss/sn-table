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
} from '@nebula.js/stardust';
import locale from '../locale/src';

import properties from './object-properties';
import data from './data';
import ext from './ext';
import muiSetup from './mui-setup';
import { render, teardown } from './table/Root';
import manageData from './table/handle-data';
import sortingFactory from './table/sorting';

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
      const theme = useTheme();

      const [pageInfo, setPageInfo] = useState(() => ({ top: 0, height: 100 }));
      const [muiParameters] = useState(() => muiSetup());
      const [tableData] = usePromise(() => manageData(model, layout, pageInfo), [layout, pageInfo]);

      useEffect(() => {
        if (layout && tableData) {
          locale(translator);
          const changeSortOrder = sortingFactory(model, tableData.columnOrder);
          render(rootElement, {
            rootElement,
            layout,
            tableData,
            setPageInfo,
            constraints,
            translator,
            selectionsAPI,
            muiParameters,
            theme,
            changeSortOrder,
          });
        }
      }, [tableData, constraints, selectionsAPI.isModal(), theme.name(), translator.language()]);

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
