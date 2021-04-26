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
} from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import ext from './ext';
import muiSetup from './mui-setup';
import { render, teardown } from './table/Root';
import manageData from './table/handle-data';
import sortingFactory from './table/sorting';

// This line is replaced by rollup with an import for internal builds
const __OPIONAL_THEME_DEPS__ = {}; // eslint-disable-line no-underscore-dangle

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

      const [pageInfo, setPageInfo] = useState(() => ({ top: 0, height: 100 }));
      const [muiParameters] = useState(() => muiSetup(__OPIONAL_THEME_DEPS__));
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
          });
        }
      }, [tableData, layout, constraints, selectionsAPI.isModal(), theme.name()]);

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
