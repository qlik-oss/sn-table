import React, { memo, useMemo, useState } from 'react';
import PaginationContent from '../components/footer/PaginationContent';
import { StyledTableWrapper } from '../components/styles';
import { PageInfo } from '../../types';
import FooterWrapper from '../components/footer/FooterWrapper';
import Table from './Table';
import { MAX_PAGE_SIZE } from './constants';
import { TableContext, useContextSelector } from '../context';
import useOnPropsChange from './hooks/use-on-props-change';
import { WrapperProps } from './types';

const Wrapper = ({ rect }: WrapperProps) => {
  const { layout, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const tableData = useContextSelector(TableContext, (value) => value.tableData);
  const { paginationNeeded, totalRowCount } = tableData;
  const pageSize = Math.min(MAX_PAGE_SIZE, totalRowCount);
  const [page, setPage] = useState(0);
  const pageInfo = useMemo<PageInfo>(
    () => ({
      page,
      rowsPerPage: pageSize,
      rowsPerPageOptions: [],
    }),
    [pageSize, page]
  );

  useOnPropsChange(() => {
    // Guard against new layout that contains fewer pages then previous layout
    if (layout.qHyperCube.qSize.qcy <= pageSize) {
      setPage(0);
    } else {
      const lastPage = Math.ceil(layout.qHyperCube.qSize.qcy / pageSize);
      setPage((prevPage) => Math.min(prevPage, lastPage));
    }
  }, [layout]);

  return (
    <StyledTableWrapper data-testid="sn-table" background={theme.background} dir="ltr">
      <Table rect={rect} pageInfo={pageInfo} />
      {paginationNeeded && (
        <FooterWrapper>
          <PaginationContent
            handleChangePage={(currentPage) => setPage(currentPage)}
            isSelectionMode={false}
            pageInfo={pageInfo}
            setPageInfo={() => {}}
            rect={rect}
            announce={() => {}}
          />
        </FooterWrapper>
      )}
    </StyledTableWrapper>
  );
};

export default memo(Wrapper);
