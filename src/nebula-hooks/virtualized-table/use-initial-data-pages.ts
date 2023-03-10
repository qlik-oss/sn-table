import { usePromise } from '@nebula.js/stardust';
import { INITIAL_DATA_FETCH_HEIGHT, INITIAL_DATA_FETCH_WIDTH } from '../../table/constants';
import { MAX_PAGE_SIZE } from '../../table/virtualized-table/constants';
import { TableLayout } from '../../types';

interface UseInitialDataPagesProps {
  model: EngineAPI.IGenericObject | undefined;
  layout: TableLayout;
  shouldRender: boolean;
  page: number;
}

type Result = {
  initialDataPages: EngineAPI.INxDataPage[];
  derivedFrom: {
    layout: TableLayout;
    page: number;
  };
};

const fetchInitialDataPages = async (
  model: EngineAPI.IGenericObject,
  layout: TableLayout,
  page: number
): Promise<Result> => {
  let { qDataPages } = layout.qHyperCube;
  if (page !== 0 || qDataPages === undefined || qDataPages.length === 0) {
    const qTop = page * Math.min(MAX_PAGE_SIZE, layout.qHyperCube.qSize.qcy);

    qDataPages = await model.getHyperCubeData('/qHyperCubeDef', [
      {
        qLeft: 0,
        qTop,
        qWidth: INITIAL_DATA_FETCH_WIDTH,
        qHeight: INITIAL_DATA_FETCH_HEIGHT,
      },
    ]);
  }

  return {
    initialDataPages: qDataPages,
    derivedFrom: {
      layout,
      page,
    },
  };
};

const useInitialDataPages = ({ model, layout, shouldRender, page }: UseInitialDataPagesProps) => {
  const [result] = usePromise(async () => {
    if (shouldRender && model) {
      return fetchInitialDataPages(model, layout, page);
    }

    return undefined;
  }, [model, layout, page]);

  // Initial data pages are loaded for a new layout or if a page has changed. Add a loading safe guard
  // to avoid rending with stale data when either a layout or a page change occured.
  const isLoading = result?.derivedFrom.layout !== layout || result?.derivedFrom.page !== page;

  return { initialDataPages: result?.initialDataPages, isLoading };
};

export default useInitialDataPages;
