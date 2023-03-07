import { useEffect, useMemo, useState } from '@nebula.js/stardust';
import { MAX_PAGE_SIZE } from '../../table/virtualized-table/constants';
import { PageInfo, TableLayout } from '../../types';

const usePageInfo = (layout: TableLayout, shouldRender: boolean) => {
  const [page, setPage] = useState(0);
  const pageSize = Math.min(MAX_PAGE_SIZE, layout.qHyperCube.qSize.qcy);
  const pageInfo = useMemo<PageInfo>(
    () => ({
      page,
      rowsPerPage: pageSize,
      rowsPerPageOptions: [],
    }),
    [pageSize, page]
  );

  useEffect(() => {
    if (shouldRender) {
      // Guard against new layout that contains fewer pages then previous layout
      if (layout.qHyperCube.qSize.qcy <= pageSize) {
        setPage(0);
      } else {
        const lastPage = Math.ceil(layout.qHyperCube.qSize.qcy / pageSize);
        setPage((prevPage) => Math.min(prevPage, lastPage));
      }
    }
  }, [layout.qHyperCube.qSize.qcy, pageSize, shouldRender]);

  return { pageInfo, setPage };
};

export default usePageInfo;
