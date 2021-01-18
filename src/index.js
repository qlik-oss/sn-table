import { useElement, useLayout, useEffect, useModel, useState, useConstraints } from '@nebula.js/stardust';
import properties from './object-properties';
import initSelections from './selections-factory';
import data from './data';
import ext from './ext';
import { render, teardown } from './table/root';
import manageData from './table/handle-data';
import './style.less';

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

<<<<<<< HEAD
      const selections = initSelections(el);
=======
      const selections = initSelections();
>>>>>>> main

      useEffect(() => {
        manageData(model, layout, pageInfo).then((d) => {
          setTableData(d);
        });
      }, [layout, pageInfo]);

      useEffect(
        () => () => {
          teardown(el);
        },
        []
      );

      useEffect(() => {
        if (layout && tableData) {
          render(el, { tableData, setPageInfo, pageInfo, constraints, selections });
        }
      }, [tableData, selections.selected]);
    },
    ext: ext(env),
  };
}
