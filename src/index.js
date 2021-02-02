import {
  useElement,
  useLayout,
  useEffect,
  useModel,
  useState,
  useConstraints,
  useSelections,
} from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import ext from './ext';
import { shouldUpdateData, muiSetup } from './index-helper';
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
      const layout = useLayout();
      const model = useModel();
      const constraints = useConstraints();
      const selectionsAPI = useSelections();

      const [pageInfo, setPageInfo] = useState({ top: 0, height: 100 });
      const [tableData, setTableData] = useState();
      const [muiParameters] = useState(muiSetup(constraints.active, __OPIONAL_THEME_DEPS__));

      useEffect(() => {
        if (shouldUpdateData(layout, tableData)) {
          manageData(model, layout, pageInfo).then((d) => {
            setTableData(d);
          });
        }
      }, [layout, pageInfo]);

      useEffect(() => {
        const onMouseUp = (e) => {
          const classes = e.target.className;
          const isSelectableCell = classes.includes('selected') || classes.includes('possible');
          if (selectionsAPI.isActive() && !isSelectableCell) {
            e.stopPropagation();
            selectionsAPI.confirm();
          }
        };

        el.addEventListener('mouseup', onMouseUp, true);
        return () => {
          el.removeEventListener('mouseup', onMouseUp, true);
        };
      }, []);

      useEffect(() => {
        if (layout && tableData) {
          render(el, { tableData, setPageInfo, pageInfo, constraints, selectionsAPI, muiParameters });
        }
      }, [tableData]);

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
