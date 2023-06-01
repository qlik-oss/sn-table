import { useMemo, useState } from '@nebula.js/stardust';
import { MAX_PAGE_SIZE } from '../../table/virtualized-table/constants';
import { PageInfo, TableLayout, ViewService } from '../../types';
import isPrinting from '../../is-printing';

const usePageInfo = (layout: TableLayout, shouldRender: boolean, viewService: ViewService) => {
  const isPrintingMode = isPrinting(layout, viewService);
  const tmpPage = isPrintingMode ? viewService.page || 0 : 0;
  const [page, setPage] = useState(tmpPage);
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
    if (lastPage < page) {
      setPage(lastPage);
    }
  }

  return { pageInfo, setPage };
};

export default usePageInfo;
