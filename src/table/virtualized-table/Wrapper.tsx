import React, { memo, useMemo, useState } from 'react';
import { WrapperProps } from './types';
import PaginationContent from '../components/footer/PaginationContent';
import { StyledTableWrapper } from '../components/styles';
import { PageInfo } from '../../types';
import FooterWrapper from '../components/footer/FooterWrapper';
import Table from './Table';
import { MAX_PAGE_SIZE } from './constants';
import useOnPropsChange from './hooks/use-on-props-change';
import { TableContext, useContextSelector } from '../context';

const Wrapper = (props: WrapperProps) => {
  const { rect } = props;
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

  // Reset page on new layout
  useOnPropsChange(() => setPage(0), [layout]);

  return (
    <StyledTableWrapper data-testid="sn-table" background={theme.background} dir="ltr">
      <Table rect={rect} pageInfo={pageInfo} />
      {paginationNeeded && (
        <FooterWrapper>
          <PaginationContent
            handleChangePage={(currentPage) => setPage(currentPage)}
            isSelectionMode={false}
            tableData={tableData}
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
