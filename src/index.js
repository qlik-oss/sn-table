import {
  useElement,
  useStaleLayout,
  useEffect,
  useModel,
  useState,
  useConstraints,
  useSelections,
  useTheme,
  usePromise,
  useKeyboard,
} from '@nebula.js/stardust';
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
      const selectionsAPI = useSelections();
      const theme = useTheme();
      const keyboard = useKeyboard();

      const [pageInfo, setPageInfo] = useState(() => ({ top: 0, height: 100 }));
      const [muiParameters] = useState(() => muiSetup());
      const [tableData] = usePromise(() => manageData(model, layout, pageInfo), [layout, pageInfo]);

      useEffect(() => {
        if (layout && tableData) {
          const changeSortOrder = sortingFactory(model, tableData.columnOrder);
          render(rootElement, {
            rootElement,
            layout,
            tableData,
            setPageInfo,
            constraints,
            selectionsAPI,
            muiParameters,
            theme,
            changeSortOrder,
            keyboard,
          });
        }
      }, [tableData, constraints, selectionsAPI.isModal(), theme.name(), keyboard.active]);

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
