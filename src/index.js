import {
  useElement,
  useStaleLayout,
  useEffect,
  useModel,
  useState,
  useConstraints,
  useSelections,
} from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import ext from './ext';
import muiSetup from './mui-setup';
import addEventListeners from './event-listeners';
import { render, teardown } from './table/root';
import manageData from './table/handle-data';

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
      const el = useElement();
      const layout = useStaleLayout();
      const model = useModel();
      const constraints = useConstraints();
      const selectionsAPI = useSelections();

      const [pageInfo, setPageInfo] = useState({ top: 0, height: 100 });
      const [tableData, setTableData] = useState();
      const [muiParameters] = useState(muiSetup(__OPIONAL_THEME_DEPS__));

      useEffect(() => {
        addEventListeners(el, selectionsAPI);
      }, []);

      useEffect(() => {
        manageData(model, layout, pageInfo).then((d) => {
          setTableData(d);
        });
      }, [layout, pageInfo]);

      useEffect(() => {
        if (layout && tableData) {
          render(el, { tableData, setPageInfo, pageInfo, constraints, selectionsAPI, muiParameters });
        }
      }, [tableData, constraints]);

      useEffect(
        () => () => {
          teardown(el);
        },
        []
      );
    },
    ext: ext(env),
  };
}
