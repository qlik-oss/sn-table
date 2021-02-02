import { useElement, useLayout, useEffect, useModel, useState, useConstraints } from '@nebula.js/stardust';
import properties from './object-properties';
import initSelections from './selections-factory';
import data from './data';
import ext from './ext';
import muiSetup from './mui-setup';
import shouldUpdateData from './utils/index-utils';
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

      const [pageInfo, setPageInfo] = useState({ top: 0, height: 100 });
      const [tableData, setTableData] = useState();
      const [muiParameters] = useState(muiSetup(constraints.active, __OPIONAL_THEME_DEPS__));

      const selections = initSelections(el);

      useEffect(() => {
        if (shouldUpdateData(layout, tableData)) {
          manageData(model, layout, pageInfo).then((d) => {
            setTableData(d);
          });
        }
      }, [layout, pageInfo]);

      useEffect(
        () => () => {
          teardown(el);
        },
        []
      );

      useEffect(() => {
        if (layout && tableData) {
          render(el, { tableData, setPageInfo, pageInfo, constraints, selections, muiParameters });
        }
      }, [tableData, selections.selected]);
    },
    ext: ext(env),
  };
}
