import { useMemo, useState } from '@nebula.js/stardust';
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

  if (shouldRender) {
    // Guard against new layout that contains fewer pages then previous layout
    const lastPage = Math.floor(layout.qHyperCube.qSize.qcy / MAX_PAGE_SIZE);
    if (layout.qHyperCube.qSize.qcy <= MAX_PAGE_SIZE) {
      setPage(0);
    } else if (lastPage < page) {
      setPage(lastPage);
    }
  }

  return { pageInfo, setPage };
};

export default usePageInfo;
